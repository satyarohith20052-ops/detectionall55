# 🔥 Quick Setup Guide - Fire & Smoke Detection Alert System

## Option 1: Instant Setup (No Backend Required) ⚡

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Device with camera
- Internet connection

### Steps
1. **Open the App**
   - Open `index.html` directly in your browser, OR
   - Serve it locally using: `python -m http.server` or VS Code Live Server

2. **Users will be prompted for:**
   - Camera permission (for fire/smoke detection)
   - Location permission (for GPS coordinates)
   - Notification permission (for alerts)

3. **How to Test**
   - Point camera at something red/orange (for fire detection)
   - Point camera at something gray/dark (for smoke detection)
   - When detected, an alert will appear with email client opened

4. **Email Alerts**
   - Clicking the alert will open your default email client
   - You'll compose an email with:
     - Alert type and details
     - Your location coordinates
     - Recipients: Primary + 2 optional emails
   - You manually send it from your configured email account

### Pros
✅ No server setup needed  
✅ Works immediately  
✅ Privacy-focused (no data sent to external servers)  

### Cons
❌ Requires manual email sending  
❌ Limited to email client's capabilities  

---

## Option 2: Full-Featured Backend (Automatic Emails) 🚀

### Requirements
- Node.js v14+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- Gmail account with 2-Factor Authentication
- Gmail App Password ([Create one](https://support.google.com/accounts/answer/185833))

### Step 1: Install Node.js
**Windows:**
1. Download from https://nodejs.org (LTS version)
2. Run installer with defaults
3. Restart terminal/PowerShell

**Mac/Linux:**
```bash
brew install node
```

### Step 2: Verify Installation
```bash
node --version
npm --version
```

### Step 3: Install Project Dependencies
```bash
cd fire-alert-app
npm install
```

This installs:
- Express.js (web server)
- Nodemailer (email service)
- CORS (cross-origin support)

### Step 4: Update Email Configuration

If using the pre-configured `emergencyalertbysatya@gmail.com`:
- Email: `emergencyalertbysatya@gmail.com`
- App Password: `fvuuzpbqbnmrfxgt`
- ✅ Already configured in `server.js`

**To use your own Gmail:**
1. Open `server.js`
2. Find the email config section:
   ```javascript
   auth: {
     user: 'emergencyalertbysatya@gmail.com',  // Change this
     pass: 'fvuuzpbqbnmrfxgt'                  // Change to your App Password
   }
   ```
3. Save the file

### Step 5: Start the Server
```bash
npm start
```

Expected output:
```
🚨 Fire Alert Server running on http://localhost:3000
Email service configured: emergencyalertbysatya@gmail.com
```

### Step 6: Open the App
1. Open browser: `http://localhost:3000`
2. Grant permissions (camera, location, notifications)
3. Enter name and email

### Step 7: Test Fire/Smoke Detection
- Point camera at:
  - **Red/Orange object** → Triggers FIRE alert
  - **Gray/Dark object** → Triggers SMOKE alert

**On Alert:**
- Full-screen red alert appears
- Sound and screen flash
- Email automatically sent to all recipients
- Email includes: photo, video clip (10 sec), GPS location, timestamp

### Pros
✅ Fully automated email sending  
✅ Sends photo + video evidence  
✅ Includes 10-second video clip  
✅ Professional alert emails  
✅ Multiple recipient support  

### Cons
❌ Requires server setup  
❌ Needs Gmail configuration  

---

## Testing Emails

### Option 1: Test Email Endpoint
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail":"your-email@gmail.com"}'
```

### Option 2: Trigger Detection
1. Point camera at fire/smoke colors
2. Alert will automatically send email

---

## Troubleshooting

### Server Won't Start
**Error: "npm: command not found"**
- Solution: Install Node.js from https://nodejs.org

**Error: "Port 3000 already in use"**
- Solution: Change PORT in `server.js` OR kill process: `lsof -i :3000 | kill -9`

### No Camera Access
- ✅ Check browser permissions
- ✅ Use HTTPS (for production)
- ✅ Try incognito mode
- ✅ Check if camera is already in use

### Emails Not Sending
- ✅ Verify app password (not regular password)
- ✅ Check server logs for error messages
- ✅ Ensure "Less Secure Apps" enabled (if using personal Gmail)
- ✅ Check spam folder

### Location Shows "Unable to Get"
- ✅ Enable location services on device
- ✅ Grant location permission to browser
- ✅ Wait 10-30 seconds (GPS lock takes time)
- ✅ Detection works without location

### App Not Installable (Home Screen)
- ✅ Use HTTPS (only works on secure connections)
- ✅ For local testing, HTTPS not required
- ✅ Use Chrome/Edge (best PWA support)

---

## File Structure

```
fire-alert-app/
├── index.html          ← Main app file (open this!)
├── server.js           ← Backend (if using Option 2)
├── sw.js               ← Service Worker (offline support)
├── manifest.json       ← PWA configuration
├── package.json        ← Dependencies (Option 2)
├── README.md           ← Full documentation
├── SETUP.md            ← This file
└── .gitignore          ← Git configuration
```

---

## For Advanced Users

### Deploy to Production

**Vercel (Recommended for PWA):**
```bash
npm install -g vercel
vercel
```

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Important:** Update API_ENDPOINT in index.html to your deployed server URL!

### Use with Custom Email Service
Edit `server.js` to use SendGrid, AWS SES, or Mailgun instead of Gmail.

### Enable Email Attachments
Currently sends video as composite image. To add true video:
1. Install `ffmpeg`
2. Modify `createVideoFromFrames()` to use RecordRTC or MediaRecorder
3. Convert to WebM format

---

## Security Notes

🔒 **For Production:**
- ✅ Use environment variables for email credentials
- ✅ Use HTTPS everywhere
- ✅ Implement rate limiting
- ✅ Add user authentication
- ✅ Use secure email service (SendGrid, AWS SES)

🔓 **Current Setup (Demo Only):**
- App password visible in code (for demo purposes)
- No rate limiting
- No user authentication

---

## Quick Command Reference

```bash
# Start server
npm start

# Test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail":"test@gmail.com"}'

# Check server health
curl http://localhost:3000/api/health

# Install dependencies
npm install

# View logs
npm start
```

---

## Next Steps

1. ✅ Choose Option 1 (instant) or Option 2 (backend)
2. ✅ Follow setup steps
3. ✅ Test with detection
4. ✅ Add to home screen (PWA)
5. ✅ Share with team

---

**Questions?** Check the full README.md or review console errors (F12 → Console tab)

Happy protecting! 🚨🔥
