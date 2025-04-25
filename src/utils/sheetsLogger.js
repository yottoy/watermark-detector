/**
 * Utility to log analytics data to Google Sheets
 */

// The URL of your Google Apps Script web app
const SHEETS_ENDPOINT = import.meta.env.VITE_SHEETS_ENDPOINT || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Generate a simple session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store session ID for this browser session
const SESSION_ID = generateSessionId();

/**
 * Log analysis data to Google Sheets
 * @param {Object} analysisData - The analysis results
 */
export const logToGoogleSheets = async (analysisData) => {
  try {
    // Extract relevant data
    const {
      originalText,
      characterConfidence,
      spacingAnalysis,
      hiddenCharacters
    } = analysisData;
    
    // Get watermark types found
    const watermarkTypes = [];
    
    if (hiddenCharacters && hiddenCharacters.length > 0) {
      watermarkTypes.push('hidden-characters');
    }
    
    if (spacingAnalysis && spacingAnalysis.patternDetected) {
      if (spacingAnalysis.commonPatterns) {
        spacingAnalysis.commonPatterns.forEach(pattern => {
          watermarkTypes.push(pattern.type);
        });
      }
    }
    
    // Get device info
    const deviceInfo = {
      browser: navigator.userAgent,
      device: /mobile|android|iphone|ipad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      country: 'unknown' // You could use a geolocation service here if needed
    };
    
    // Prepare data for the sheet
    const sheetData = {
      sessionId: SESSION_ID,
      textLength: originalText.length,
      watermarkTypes: watermarkTypes.join(','),
      confidenceScore: characterConfidence || 
                      (spacingAnalysis ? spacingAnalysis.confidenceScore : 0),
      deviceInfo
    };
    
    // Send data to Google Sheets (non-blocking)
    fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(sheetData),
      mode: 'no-cors' // This is important for cross-origin requests
    }).catch(err => {
      // Silently fail - we don't want to affect the user experience
      console.log('Analytics logging failed silently', err);
    });
    
    return true;
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.log('Analytics error (handled)', error);
    return false;
  }
};
