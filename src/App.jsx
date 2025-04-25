import { useState, useCallback, useEffect } from 'react'
import './App.css'
import { detectHiddenCharacters } from './utils/characterDetector'
import { analyzeSpacingPatterns } from './utils/spacingAnalyzer'
import { logToGoogleSheets } from './utils/sheetsLogger'
import TextInput from './components/TextInput'
import TextOutput from './components/TextOutput'
import CharacterAnalysis from './components/CharacterAnalysis'
import SpacingAnalysis from './components/SpacingAnalysis'
import Footer from './components/Footer'
import WatermarkingInfo from './components/WatermarkingInfo'
import SampleGenerator from './components/SampleGenerator'
import Header from './components/Header'
import PrivacyPolicy from './components/PrivacyPolicy'

// Initialize Google Analytics
import ReactGA from 'react-ga4'

// Initialize with your actual measurement ID
// In production, this should come from an environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
ReactGA.initialize(GA_MEASUREMENT_ID);

// Enable debug mode in development
if (import.meta.env.DEV) {
  ReactGA.set({ debug: true });
}

function App() {
  // Track page view on component mount
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  
  const [inputText, setInputText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [textTooLong, setTextTooLong] = useState(false)
  const CHARACTER_LIMIT = 100000
  const [hiddenCharacters, setHiddenCharacters] = useState([])
  const [characterCategories, setCharacterCategories] = useState([])
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [totalHiddenChars, setTotalHiddenChars] = useState(0)
  const [spacingAnalysis, setSpacingAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [exportData, setExportData] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)

  const handleTextChange = (newText) => {
    setInputText(newText)
    setCleanedText('')
    setHiddenCharacters([])
    setCharacterCategories([])
    setConfidenceScore(0)
    setTotalHiddenChars(0)
    setSpacingAnalysis(null)
    setExportData(null)
    setTextTooLong(newText.length > CHARACTER_LIMIT)
    
    // Track text length ranges for analytics
    if (newText.length > 0) {
      const lengthRange = 
        newText.length <= 1000 ? '0-1K' :
        newText.length <= 5000 ? '1K-5K' :
        newText.length <= 10000 ? '5K-10K' :
        newText.length <= 50000 ? '10K-50K' :
        newText.length <= 100000 ? '50K-100K' : '100K+';
      
      ReactGA.event({
        category: 'Text Input',
        action: 'Text Length',
        label: lengthRange
      });
    }
  }

  const copyCleanedText = useCallback(() => {
    if (!cleanedText) return
    
    // Track copy event
    ReactGA.event({
      category: 'User Action',
      action: 'Copy Cleaned Text',
      value: Math.min(Math.floor(cleanedText.length / 100), 1000) // Value capped at 1000
    })
    
    navigator.clipboard.writeText(cleanedText)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
      })
  }, [cleanedText]);

  const analyzeText = (sampleText) => {
    // If sample text is provided, use it instead of the input text
    const textToAnalyze = sampleText || inputText
    
    if (!textToAnalyze) return
    if (textToAnalyze.length > CHARACTER_LIMIT) {
      setTextTooLong(true)
      return
    }
    
    // If sample text is provided, update the input text
    if (sampleText) {
      setInputText(sampleText)
    }
    
    // Track analysis event
    ReactGA.event({
      category: 'Analysis',
      action: 'Analyze Text',
      value: Math.min(Math.floor(inputText.length / 100), 1000) // Value capped at 1000
    })
    
    setIsAnalyzing(true)
    
    // Process in next tick to allow UI to update
    setTimeout(() => {
      // Analyze hidden characters
      const { 
        cleanText, 
        detectedChars, 
        categories, 
        confidenceScore: charConfidence,
        totalHiddenChars: totalChars
      } = detectHiddenCharacters(textToAnalyze)
      
      setCleanedText(cleanText)
      setHiddenCharacters(detectedChars)
      setCharacterCategories(categories)
      setConfidenceScore(charConfidence)
      setTotalHiddenChars(totalChars)
      
      // Analyze spacing patterns
      const spacingResults = analyzeSpacingPatterns(textToAnalyze)
      setSpacingAnalysis(spacingResults)
      
      // Prepare export data
      const analysisData = {
        originalText: textToAnalyze,
        cleanedText: cleanText,
        hiddenCharacters: detectedChars,
        characterCategories: categories,
        characterConfidence: charConfidence,
        spacingAnalysis: spacingResults,
        timestamp: new Date().toISOString()
      };
      
      setExportData(analysisData);
      
      // Log to Google Sheets (non-blocking, won't affect user experience)
      logToGoogleSheets(analysisData);
      
      setIsAnalyzing(false)
    }, 10)
  }

  // Function to export analysis results
  const handleExport = () => {
    if (!exportData) return
    
    // Track export event
    ReactGA.event({
      category: 'User Action',
      action: 'Export Results',
      label: exportData.characterConfidence > 70 ? 'High Confidence' : 'Low Confidence'
    })
    
    // Create a JSON blob
    const jsonData = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    // Create a download link and trigger it
    const a = document.createElement('a')
    a.href = url
    a.download = `watermark-analysis-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TextInput 
              onAnalyze={analyzeText} 
              isAnalyzing={isAnalyzing}
              textTooLong={textTooLong}
              onTextChange={handleTextChange}
            />
            <SampleGenerator onSelectSample={analyzeText} />
          </div>
          
          <div className="space-y-6">
            {cleanedText && (
              <TextOutput 
                cleanedText={cleanedText} 
                hasHiddenChars={hiddenCharacters.length > 0}
                onExport={exportData ? handleExport : null}
                onCopy={copyCleanedText}
                copySuccess={copySuccess}
              />
            )}
            
            {hiddenCharacters.length > 0 && (
              <CharacterAnalysis 
                characters={hiddenCharacters} 
                categories={characterCategories}
                confidenceScore={confidenceScore}
                totalHiddenChars={totalHiddenChars}
              />
            )}
            
            {spacingAnalysis && (
              <SpacingAnalysis analysis={spacingAnalysis} />
            )}
            
            {/* About Watermarking Information */}
            <WatermarkingInfo />
          </div>
        </div>
      </div>
      <Footer 
        companyName="Watermark Detector" 
        privacyPolicyLink="#privacy" 
        onPrivacyPolicyClick={() => setShowPrivacyPolicy(true)} 
      />
      {showPrivacyPolicy && <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />}
    </div>
  )
}

export default App
