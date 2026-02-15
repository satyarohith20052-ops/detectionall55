const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emergencyalertbysatya@gmail.com',
    pass: 'fvuuzpbqbnmrfxgt' // App-specific password
  }
});

// Function to convert base64 to buffer
function base64ToBuffer(base64String, mimeType) {
  const base64Data = base64String.replace(/^data:[^;]+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

// Send alert email endpoint
app.post('/api/send-alert', async (req, res) => {
  try {
    const {
      alertType,
      userName,
      userEmail,
      optionalEmail1,
      optionalEmail2,
      latitude,
      longitude,
      videoBase64,
      pictureBase64,
      timestamp
    } = req.body;

    // Build recipient list
    const recipients = [userEmail];
    if (optionalEmail1 && optionalEmail1.trim()) recipients.push(optionalEmail1);
    if (optionalEmail2 && optionalEmail2.trim()) recipients.push(optionalEmail2);

    // Prepare attachments
    const attachments = [];

    // Add picture attachment
    if (pictureBase64) {
      const pictureBuffer = base64ToBuffer(pictureBase64, 'image/jpeg');
      attachments.push({
        filename: `fire-smoke-alert-${Date.now()}.jpg`,
        content: pictureBuffer,
        contentType: 'image/jpeg'
      });
    }

    // Add video attachment (10-second clip)
    if (videoBase64) {
      const videoBuffer = base64ToBuffer(videoBase64, 'video/webm');
      attachments.push({
        filename: `alert-video-${Date.now()}.webm`,
        content: videoBuffer,
        contentType: 'video/webm'
      });
    }

    // Create email content
    const locationInfo = latitude && longitude 
      ? `\nLocation: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\nGoogle Maps: https://maps.google.com/?q=${latitude},${longitude}`
      : '\nLocation: Unable to retrieve GPS coordinates';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .alert-header { background: #ff4500; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
          .alert-title { font-size: 28px; font-weight: bold; margin: 0; }
          .content { background: #fff3e0; padding: 15px; border-left: 4px solid #ff4500; margin-bottom: 20px; border-radius: 3px; }
          .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; margin-left: 5px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="alert-header">
            <div class="alert-title">🚨 ${alertType} 🚨</div>
          </div>
          
          <div class="content">
            <p><strong>URGENT ALERT!</strong> ${alertType} has been detected by the Fire & Smoke Detection System.</p>
          </div>

          <div class="details">
            <div class="detail-row">
              <span class="label">📍 Person:</span>
              <span class="value">${userName}</span>
            </div>
            <div class="detail-row">
              <span class="label">📧 Email:</span>
              <span class="value">${userEmail}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Time:</span>
              <span class="value">${new Date(timestamp).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">📍 Coordinates:</span>
              <span class="value">${latitude ? latitude.toFixed(6) : 'N/A'}, ${longitude ? longitude.toFixed(6) : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🗺️ Map Link:</span>
              <span class="value"><a href="https://maps.google.com/?q=${latitude},${longitude}">Open in Google Maps</a></span>
            </div>
          </div>

          <div class="details">
            <p><strong>Evidence Attachments:</strong></p>
            <ul>
              ${pictureBase64 ? '<li>📸 Alert Photo (JPEG)</li>' : ''}
              ${videoBase64 ? '<li>🎥 Alert Video Clip (WebM, ~10 seconds)</li>' : ''}
            </ul>
          </div>

          <div class="footer">
            <p>This is an automated alert from the Fire & Smoke Detection System</p>
            <p>If you received this by mistake or have concerns, please contact the alert originator immediately.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails
    for (const recipient of recipients) {
      const mailOptions = {
        from: 'emergencyalertbysatya@gmail.com',
        to: recipient,
        subject: `🔥 EMERGENCY: ${alertType} Detected! Location: ${latitude ? latitude.toFixed(4) : 'Unknown'}, ${longitude ? longitude.toFixed(4) : 'Unknown'}`,
        html: htmlContent,
        attachments: attachments
      };

      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent to: ${recipient}`);
    }

    res.json({
      success: true,
      message: `Alert sent to ${recipients.length} recipient(s)`,
      recipients: recipients
    });

  } catch (error) {
    console.error('Error sending alert:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { testEmail } = req.body;

    const mailOptions = {
      from: 'emergencyalertbysatya@gmail.com',
      to: testEmail,
      subject: 'Fire & Smoke Alert System - Test Email',
      html: '<h2>✅ Test Email Successful!</h2><p>Your Fire & Smoke Detection System is properly configured and can send alert emails.</p>'
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Test email sent successfully' });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚨 Fire Alert Server running on http://localhost:${PORT}`);
  console.log(`Email service configured: emergencyalertbysatya@gmail.com`);
});
