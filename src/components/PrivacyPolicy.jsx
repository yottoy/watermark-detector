import React from 'react'
import AdSense from './AdSense'

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Top Ad */}
          <div className="mb-6">
            <AdSense 
              slot="2468101214" 
              format="horizontal"
              className="w-full"
            />
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h2>Privacy Policy</h2>
            
            <p><strong>Last Updated: April 25, 2025</strong></p>
            
            <p>
              This Privacy Policy describes how Watermark Detector ("we", "us", or "our") collects, uses, and protects information when you use our watermark detection tool.
            </p>
            
            <h3>Information We Collect</h3>
            
            <p>We collect the following types of anonymized information to improve our service:</p>
            
            <h4>1. Usage Metrics</h4>
            <ul>
              <li>Number of visits and unique visitors</li>
              <li>Session duration and time spent on site</li>
              <li>Pages and features accessed</li>
              <li>Geographic region (city/country level only)</li>
              <li>Device type, browser, and operating system</li>
              <li>Referral source (e.g., how you found the site)</li>
            </ul>
            
            <h4>2. Feature Usage</h4>
            <ul>
              <li>Frequency of analyses performed</li>
              <li>Types of watermarks detected</li>
              <li>Frequency of "Copy Cleaned Text" and "Export Results" actions</li>
              <li>Character count of analyzed text</li>
              <li>Percentage of text containing watermarks</li>
            </ul>
            
            <h4>3. Content Patterns (Anonymized)</h4>
            <ul>
              <li>Distribution of text lengths</li>
              <li>Watermark density and types (statistical only)</li>
              <li>Cryptographically salted hash values of analyzed text to detect repeated content patterns without storing the original content</li>
              <li>Language detection (e.g., English, Korean, etc.)</li>
              <li>General content category (e.g., academic, technical, narrative) — not the actual content</li>
            </ul>
            
            <h4>4. Error Tracking</h4>
            <ul>
              <li>Analysis failures or timeouts</li>
              <li>Performance metrics</li>
              <li>UI interaction issues</li>
            </ul>
            
            <h3>How We Use Information</h3>
            
            <p>We use the information we collect to:</p>
            
            <ul>
              <li>Improve and optimize watermark detection and removal capabilities</li>
              <li>Identify and fix technical issues</li>
              <li>Understand feature usage and content pattern trends</li>
              <li>Guide future feature development</li>
              <li>Monitor performance and system stability</li>
              <li>Detect emerging commercial use cases and adjust accordingly</li>
            </ul>
            
            <h3>Text Privacy</h3>
            
            <p>
              All text submitted for analysis is processed entirely in your browser and is not transmitted to or stored on our servers. We do not log or retain the original text.
              We store only anonymized metadata and salted hashes, which are non-reversible and used only to identify repeated patterns across users.
            </p>
            
            <p>
              In the event that future features (such as advanced detection models or watermark injection) require optional server-side processing, users will be explicitly informed and given the choice to opt in before any content is transmitted.
            </p>
            
            <h3>Analytics</h3>
            
            <p>We use Google Analytics to collect anonymized usage data. Google Analytics may use cookies to collect technical information about your visit.</p>
            
            <ul>
              <li>You can learn more here: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy & Terms</a></li>
              <li>You may opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Add-on</a>.</li>
              <li>We are actively exploring privacy-focused alternatives to reduce dependency on third-party analytics.</li>
            </ul>
            
            <h3>Data Security</h3>
            
            <p>
              We implement technical and organizational measures to protect the data we collect. All sensitive computations (such as character detection and spacing analysis) occur locally in your browser by default.
            </p>
            
            <p>
              Where optional features may involve server-side computation in the future, data will be encrypted in transit and handled in accordance with applicable data protection regulations.
            </p>
            
            <h3>Your Rights</h3>
            
            <p>Depending on your location, you may have rights regarding your personal information, including:</p>
            
            <ul>
              <li>The right to access the information we have about you</li>
              <li>The right to request deletion of associated data (including hashes)</li>
              <li>The right to opt out of analytics and feature tracking</li>
            </ul>
            
            <p>
              To exercise these rights or for any questions, contact: privacy@watermarkdetector.com
            </p>
            
            <h3>Acceptable Use</h3>
            
            <ul>
              <li>This tool is intended for legitimate, educational, research, and privacy-related use.</li>
              <li>You may not use this tool to circumvent platform policies, academic integrity standards, or for any deceptive or unethical purposes.</li>
            </ul>
            
            <h3>Changes to This Privacy Policy</h3>
            
            <p>
              We may update this policy periodically. We will notify you by updating this page and changing the "Last Updated" date above.
            </p>
            
            <h3>Contact Us</h3>
            
            <p>
              If you have questions about this Privacy Policy, email us at:<br/>
              📧 privacy@watermarkdetector.com
            </p>
          </div>
          
          {/* Bottom Ad */}
          <div className="mt-6">
            <AdSense 
              slot="13579111315" 
              format="horizontal"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
