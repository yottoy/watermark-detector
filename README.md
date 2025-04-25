# Watermark Detector

A web-based tool to detect and remove invisible watermarking from text, including zero-width Unicode characters and subtle spacing patterns. Built with React, Vite, and Tailwind CSS. Runs entirely in the browser with analytics integration.

## Features
- Detects hidden/invisible Unicode characters
- Analyzes spacing patterns for watermarking
- Cleans text by removing hidden characters
- Copy cleaned text
- Responsive, mobile-friendly UI

## Tech Stack
- React (with Vite)
- Tailwind CSS
- JavaScript (ES6+)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Instructions

### Setting Up Google Analytics

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Set up a web data stream and copy your Measurement ID (starts with "G-")
3. Add your Measurement ID to the `.env.local` file:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Setting Up Google Sheets Integration

1. Create a Google Sheet with these column headers:
   - Timestamp
   - SessionID
   - TextLength
   - WatermarkTypes
   - ConfidenceScore
   - DeviceType
   - Browser
   - Country

2. In your Google Sheet, click on "Extensions" > "Apps Script"
3. Add the following code to the Apps Script editor:
   ```javascript
   function doPost(e) {
     try {
       // Parse the incoming data
       const data = JSON.parse(e.postData.contents);
       
       // Get the active sheet
       const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
       
       // Add a new row with the data
       sheet.appendRow([
         new Date(),                  // Timestamp
         data.sessionId,              // SessionID
         data.textLength,             // TextLength
         data.watermarkTypes,         // WatermarkTypes
         data.confidenceScore,        // ConfidenceScore
         data.deviceInfo.device,      // DeviceType
         data.deviceInfo.browser,     // Browser
         data.deviceInfo.country      // Country
       ]);
       
       // Return success response
       return ContentService.createTextOutput(JSON.stringify({
         result: "success"
       })).setMimeType(ContentService.MimeType.JSON);
       
     } catch (error) {
       // Return error response
       return ContentService.createTextOutput(JSON.stringify({
         result: "error",
         error: error.toString()
       })).setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```

4. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Description: "Watermark Detector Analytics"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"

5. Copy the Web App URL and add it to your `.env.local` file:
   ```
   VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

### Deploying to GitHub

1. Create a GitHub repository named "watermark-detector"

2. Initialize and push your code:
   ```bash
   # Initialize Git repository
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit of Watermark Detector"
   
   # Add remote repository
   git remote add origin https://github.com/yourusername/watermark-detector.git
   
   # Push to GitHub
   git push -u origin main
   ```

### Deploying with Netlify

1. Sign up or log in to [Netlify](https://www.netlify.com/)

2. Click "New site from Git"

3. Select your GitHub repository

4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Add environment variables in Netlify:
   - VITE_GA_MEASUREMENT_ID
   - VITE_SHEETS_ENDPOINT

6. Click "Deploy site"

### Connecting WatermarkDetector.com Domain

1. Purchase the domain "WatermarkDetector.com" from a domain registrar

2. In Netlify, go to "Domain settings"

3. Click "Add custom domain"

4. Enter "watermarkdetector.com"

5. Follow Netlify's instructions to configure DNS settings:
   - Add CNAME record pointing to your Netlify site
   - Or set up A records as instructed

6. Wait for DNS propagation (can take up to 48 hours)

7. HTTPS will be automatically provisioned by Netlify with Let's Encrypt
