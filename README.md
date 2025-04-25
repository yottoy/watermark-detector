# Watermark Detector

A web-based tool to detect and remove invisible watermarking from text, including zero-width Unicode characters and subtle spacing patterns. Built with React, Vite, and Tailwind CSS. Runs entirely in the browser with analytics integration.

Visit [watermarkdetector.com](https://watermarkdetector.com) to use the application.

## Features
- Detects hidden/invisible Unicode characters (zero-width spaces, joiners, etc.)
- Analyzes spacing patterns for statistical watermarking
- Cleans text by removing hidden characters
- Copy cleaned text with one click
- Export detailed analysis results
- Responsive, mobile-friendly UI
- Privacy-focused: all processing happens in your browser

## Tech Stack
- React (with Vite)
- Tailwind CSS
- JavaScript (ES6+)
- Google Analytics for anonymous usage tracking
- Google Sheets API for analytics collection

## Development

### Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/watermark-detector.git
   cd watermark-detector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your environment variables:
   ```
   VITE_GA_MEASUREMENT_ID=G-X4VVRZ3W2Q
   VITE_SHEETS_ENDPOINT=https://script.google.com/macros/s/AKfycbzpdZvbwmCRtHvTLNDWQxFpf2u7Vd1NR4hzGKrRbVJVaGFXj1lkyLEVkIpmguCNZIrO/exec
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

### GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions:

1. Push your code to the main branch of your GitHub repository
2. GitHub Actions will automatically build and deploy the site to the gh-pages branch
3. The site will be available at your GitHub Pages URL or custom domain

### Custom Domain Setup

To set up a custom domain (like watermarkdetector.com):

1. In your domain registrar (e.g., name.com), configure the DNS settings:
   - Add an A record pointing to GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Add a CNAME record for www pointing to yourusername.github.io

2. In your GitHub repository settings:
   - Go to Settings > Pages
   - Under "Custom domain", enter your domain (e.g., watermarkdetector.com)
   - Check "Enforce HTTPS" once the certificate is provisioned

The CNAME file in the public directory ensures your custom domain persists between deployments.

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
