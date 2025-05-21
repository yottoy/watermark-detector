import { useState, useCallback, useEffect } from 'react'
import './App.css'
import { detectHiddenCharacters } from './utils/characterDetector'
import { analyzeSpacingPatterns } from './utils/spacingAnalyzer'
import { logToGoogleSheets } from './utils/sheetsLogger'
import { watermarkOptions, getDefaultSelectedWatermarks, watermarkOptionToCharacterCategories, watermarkOptionToSpacingFeatures } from './utils/watermarkOptions'
import TextInput from './components/TextInput'
import TextOutput from './components/TextOutput'
import CharacterAnalysis from './components/CharacterAnalysis'
import SpacingAnalysis from './components/SpacingAnalysis'
import Footer from './components/Footer'
import WatermarkSelection from './components/WatermarkSelection'
import Header from './components/Header'
import PrivacyPolicy from './components/PrivacyPolicy'
import AdSense from './components/AdSense'

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

// Custom event tracking functions
const trackAnalysis = (analysisData) => {
  const {
    confidenceScore,
    totalHiddenChars,
    categories,
    spacingAnalysis,
    watermarkSummary
  } = analysisData;

  // Track overall analysis results
  ReactGA.event({
    category: 'Analysis',
    action: 'Analysis Complete',
    label: confidenceScore >= 70 ? 'High Confidence' : confidenceScore >= 40 ? 'Medium Confidence' : 'Low Confidence',
    value: confidenceScore,
    non_interaction: true,
    custom_map: {
      dimension1: 'confidence_score',
      dimension2: 'total_hidden_chars',
      dimension3: 'category_count',
      dimension4: 'has_spacing_patterns',
      dimension5: 'primary_strategy'
    },
    dimension1: confidenceScore,
    dimension2: totalHiddenChars,
    dimension3: categories.length,
    dimension4: spacingAnalysis?.patternDetected ? 'yes' : 'no',
    dimension5: watermarkSummary?.primaryStrategy || 'none'
  });

  // Track detected categories
  categories.forEach(category => {
    ReactGA.event({
      category: 'Analysis',
      action: 'Category Detected',
      label: category.category,
      value: category.count,
      non_interaction: true
    });
  });

  // Track spacing patterns if detected
  if (spacingAnalysis?.patternDetected) {
    ReactGA.event({
      category: 'Analysis',
      action: 'Spacing Pattern Detected',
      label: spacingAnalysis.patternDetected,
      value: spacingAnalysis.confidenceScore,
      non_interaction: true
    });
  }
};

const trackUserAction = (action, details) => {
  ReactGA.event({
    category: 'User Action',
    action: action,
    label: details,
    non_interaction: false
  });
};

const trackError = (errorType, errorDetails) => {
  ReactGA.event({
    category: 'Error',
    action: errorType,
    label: errorDetails,
    non_interaction: true
  });
};

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
  const [selectedWatermarks, setSelectedWatermarks] = useState(getDefaultSelectedWatermarks())
  const [lastAnalyzedText, setLastAnalyzedText] = useState('')

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
      
      trackUserAction('Text Input', `Length: ${lengthRange}`);
    }
  }

  const copyCleanedText = useCallback(() => {
    if (!cleanedText) return
    
    trackUserAction('Copy Cleaned Text', `Length: ${cleanedText.length}`);
    
    navigator.clipboard.writeText(cleanedText)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text: ', err)
        trackError('Copy Failed', err.message);
      })
  }, [cleanedText]);

  // Function to handle watermark toggle
  const handleWatermarkToggle = (watermarkId) => {
    const newSelectedWatermarks = selectedWatermarks.includes(watermarkId)
      ? selectedWatermarks.filter(id => id !== watermarkId)
      : [...selectedWatermarks, watermarkId];
    
    setSelectedWatermarks(newSelectedWatermarks);
    trackUserAction('Watermark Toggle', `Watermark: ${watermarkId}, Selected: ${newSelectedWatermarks.includes(watermarkId)}`);
    
    // If we've already analyzed text, update the cleaned text based on new selections
    if (lastAnalyzedText) {
      updateCleanedText(lastAnalyzedText, newSelectedWatermarks);
    }
  };
  
  // Function to update cleaned text based on selected watermarks
  const updateCleanedText = (textToAnalyze, watermarkSelection = selectedWatermarks) => {
    // Analyze hidden characters with selected watermarks
    const { 
      cleanText, 
      detectedChars, 
      categories, 
      confidenceScore: charConfidence,
      totalHiddenChars: totalChars
    } = detectHiddenCharacters(textToAnalyze, watermarkSelection, watermarkOptionToCharacterCategories);
    
    setCleanedText(cleanText);
    setHiddenCharacters(detectedChars);
    setCharacterCategories(categories);
    setConfidenceScore(charConfidence);
    setTotalHiddenChars(totalChars);
    
    // Analyze spacing patterns with selected watermarks
    const spacingResults = analyzeSpacingPatterns(textToAnalyze, watermarkSelection, watermarkOptionToSpacingFeatures);
    setSpacingAnalysis(spacingResults);
    
    // Update export data
    setExportData({
      originalText: textToAnalyze,
      cleanedText: cleanText,
      hiddenCharacters: detectedChars,
      characterCategories: categories,
      characterConfidence: charConfidence,
      spacingAnalysis: spacingResults,
      selectedWatermarks: watermarkSelection,
      timestamp: new Date().toISOString()
    });
  };

  const analyzeText = (sampleText) => {
    const textToAnalyze = sampleText || inputText
    
    if (!textToAnalyze) return
    if (textToAnalyze.length > CHARACTER_LIMIT) {
      setTextTooLong(true)
      trackError('Text Too Long', `Length: ${textToAnalyze.length}`);
      return
    }
    
    if (sampleText) {
      setInputText(sampleText)
    }
    
    trackUserAction('Analyze Text', `Length: ${textToAnalyze.length}`);
    
    setIsAnalyzing(true)
    setLastAnalyzedText(textToAnalyze)
    
    setTimeout(() => {
      updateCleanedText(textToAnalyze);
      setIsAnalyzing(false);
      
      // Track analysis results
      if (exportData) {
        trackAnalysis(exportData);
        logToGoogleSheets(exportData);
      }
    }, 10)
  }

  // Function to export analysis results
  const handleExport = () => {
    if (!exportData) return
    
    trackUserAction('Export Results', `Confidence: ${exportData.characterConfidence}`);
    
    const jsonData = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
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
              textTooLong={textTooLong}
              onTextChange={handleTextChange}
            >
              {/* Watermark Selection Component */}
              <WatermarkSelection 
                watermarkOptions={watermarkOptions}
                selectedWatermarks={selectedWatermarks}
                onWatermarkToggle={handleWatermarkToggle}
                onAnalyze={() => analyzeText()}
                isAnalyzing={isAnalyzing}
                disabled={!inputText.trim() || isAnalyzing || textTooLong}
              />
            </TextInput>
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
              <SpacingAnalysis 
                analysis={spacingAnalysis}
              />
            )}
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8">
          <AdSense 
            slot="0987654321" 
            format="horizontal"
            className="w-full"
          />
        </div>
      </div>

      <Footer onPrivacyClick={() => setShowPrivacyPolicy(true)} />
      
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
    </div>
  )
}

export default App
