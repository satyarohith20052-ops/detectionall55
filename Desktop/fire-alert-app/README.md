# 🔥 Fire & Smoke Detection Alert System

A Progressive Web App (PWA) that detects fire and smoke using device camera and sends real-time alerts with GPS location, video, and photos to multiple email recipients.

## Features

✅ **Real-time Detection**: Uses device camera to detect fire and smoke patterns  
✅ **GPS Location Tracking**: Captures exact latitude and longitude  
✅ **Email Alerts**: Sends alerts to primary email + 2 optional emails  
✅ **Media Attachments**: Includes detection photo and 10-second video clip  
✅ **PWA Support**: Installable on home screen like a native app  
✅ **Offline Capable**: Service worker caching for offline functionality  
✅ **Visual & Audio Alerts**: Screen flashing and alarm sounds  
✅ **Browser Notifications**: Desktop push notifications  

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern mobile device or browser with camera access
- HTTPS (required for PWA, production deployment)

## Installation

### 1. Clone/Extract Project
```bash
cd fire-alert-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Email Credentials

The app is pre-configured with:
- **Sender Email**: `emergencyalertbysatya@gmail.com`
- **App Password**: `fvuuzpbqbnmrfxgt` (stored in `server.js`)

> ⚠️ **Security Note**: In production, use environment variables or secure vaults instead of hardcoding credentials.

## Running the Application

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:3000`

### In Browser
1. Open `http://localhost:3000` in Chrome/Firefox
2. Grant camera, location, and notification permissions
3. Enter your name and email
4. The app will start monitoring for fire/smoke

## Testing Email Alerts

### Test Fire/Smoke Detection
1. Point camera at something with **red/orange colors** (fire) or **gray/dark tones** (smoke)
2. Detection occurs at thresholds:
   - **Fire**: > 8% of frame with red/orange patterns
   - **Smoke**: > 15% of frame with gray patterns

### Send Test Email
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@gmail.com"}'
```

## Project Structure

```
fire-alert-app/
├── index.html          # Main PWA UI
├── server.js           # Node.js backend (email service)
├── sw.js               # Service worker (offline support)
├── manifest.json       # PWA manifest & icons
├── package.json        # Dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## API Endpoints

### POST `/api/send-alert`
Sends fire/smoke detection alert with attachments

**Request Body:**
```json
{
  "alertType": "FIRE DETECTED!",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "optionalEmail1": "manager@example.com",
  "optionalEmail2": "safety@example.com",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "pictureBase64": "data:image/jpeg;base64,...",
  "videoBase64": "data:video/webm;base64,...",
  "timestamp": "2026-02-16T14:23:45.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert sent to 3 recipient(s)",
  "recipients": ["john@example.com", "manager@example.com", "safety@example.com"]
}
```

### POST `/api/test-email`
Sends a test email to verify configuration

**Request Body:**
```json
{
  "testEmail": "recipient@example.com"
}
```

### GET `/api/health`
Health check endpoint

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Railway/Render
Follow their deployment guides after connecting your GitHub repo

### Important for PWA
- Use **HTTPS** only (required for camera, location, notifications)
- Update `API_ENDPOINT` in `index.html` to your deployed server URL
- Ensure CORS is properly configured for your domain

## Customization

### Change Detection Thresholds
Edit in `index.html`, `startFireSmokeDetection()` function:
```javascript
if (fireRatio > 0.08 && !fireDetected) {  // Change 0.08
    // ...
}
```

### Modify Email Templates
Edit email HTML in `server.js`, `POST /api/send-alert` endpoint

### Change Theme Colors
Edit CSS in `index.html`:
```css
--primary-color: #ff4500;  /* Orange/Red */
```

## Performance Tips

1. **Reduce Video Quality**: Lower `toDataURL()` quality parameters for faster processing
2. **Increase Detection Interval**: Modify `FRAME_INTERVAL` for lower CPU usage
3. **Fewer Email Recipients**: Reduces backend processing time

## Troubleshooting

### Camera Permission Denied
- Check browser permissions
- Use HTTPS on production
- Try incognito mode

### Emails Not Sending
- Verify email credentials in `server.js`
- Check Gmail "Less Secure Apps" settings (if using personal Gmail)
- Ensure "App Password" is correct for Gmail
- Check server logs for errors

### Location Not Found
- Enable location services on device
- Grant location permission to browser
- May take 10-30 seconds to acquire GPS lock

### PWA Not Installing
- Use HTTPS
- Check manifest.json is valid
- Check browser console for errors
- Use Chrome/Edge on desktop or Android

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari | ⚠️ Limited (no notification permission) |
| Internet Explorer | ❌ Not supported |

## Security Considerations

1. **HTTPS Required**: Always use HTTPS in production
2. **Email Credentials**: Use environment variables or secret management
3. **Rate Limiting**: Implement rate limiting for alert API in production
4. **Input Validation**: All user inputs are validated in the code
5. **CORS**: Configure CORS to trust only your domains

## Future Enhancements

- [ ] ML-based fire/smoke detection (TensorFlow.js)
- [ ] SMS alerts in addition to email
- [ ] Alert history dashboard
- [ ] Multi-device synchronization
- [ ] Advanced analytics and heatmaps
- [ ] Integration with emergency services
- [ ] Audio-based fire alarm detection

## License

MIT License - Feel free to use and modify

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check server logs: `npm start` output

## Author

Emergency Alert System by Satya  
Email: emergencyalertbysatya@gmail.com

---

⚠️ **Disclaimer**: This system is for demonstration/monitoring purposes. For official fire safety, use certified fire alarms and contact local emergency services (911 in US).
