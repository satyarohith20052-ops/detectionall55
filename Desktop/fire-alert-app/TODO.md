# Fire & Smoke Detector App - Implementation Plan

## Current Status
- ✅ Smoke animation in background
- ✅ Email registration (mandatory)
- ✅ Fire detection using camera
- ✅ Smoke detection using camera
- ✅ GPS location tracking
- ✅ Add to home screen button
- ✅ Alert modal with location

## Features to Add
- [ ] Backend server for sending emails with SMTP
- [ ] Video recording (10 seconds) on fire/smoke detection
- [ ] 2 optional email fields for additional recipients
- [ ] Email attachments (video + location data)
- [ ] PWA manifest (manifest.json)
- [ ] App icon (icon.png)

## Technical Implementation

### 1. Backend (server.js)
- Express.js server
- Nodemailer for SMTP email sending
- Endpoint to receive detection data and send emails
- Video file upload handling

### 2. Frontend Updates (index.html)
- Add 2 optional email input fields
- Implement MediaRecorder for 10-second video capture
- Send data to backend for email delivery
- Show recording indicator

### 3. Assets
- manifest.json for PWA
- icon.png for app icon

## Email Configuration
- Sender: emergencyalertbysatya@gmail.com
- App Password: fvuuzpbqbnmrfxgt (as provided)
- Recipients: User email + 2 optional emails

## Dependencies
- express
- nodemailer
- multer (for file uploads)
- cors
