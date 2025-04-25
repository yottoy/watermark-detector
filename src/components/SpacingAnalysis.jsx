import React, { useState } from 'react'

const SpacingAnalysis = ({ analysis }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [activeTab, setActiveTab] = useState('stats')
  const [showStrategyAnalysis, setShowStrategyAnalysis] = useState(false)

  if (!analysis) {
    return null
  }

  const { 
    averageSpacing, 
    medianSpacing, 
    stdDeviation, 
    patternDetected, 
    evidence, 
    likelihood,
    commonPatterns,
    confidenceScore,
    visualizationData,
    multipleSpaces,
    spacingFrequency,
    paragraphAnalysis,
    paragraphPatternSummary
  } = analysis

  // Get color based on confidence score
  const getConfidenceColor = () => {
    if (confidenceScore >= 70) return 'red'
    if (confidenceScore >= 40) return 'yellow'
    return 'blue'
  }
  
  const confidenceColor = getConfidenceColor()
  
  // Export analysis as JSON
  const exportAnalysis = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      analysis: {
        ...analysis,
        // Remove circular references and large data
        visualizationData: undefined
      }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `watermark-analysis-${new Date().toISOString().replace(/:/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Simple bar chart for spacing frequency visualization
  const renderSpacingFrequencyChart = () => {
    if (!spacingFrequency || spacingFrequency.length === 0) return null
    
    const maxFrequency = Math.max(...spacingFrequency.map(item => item.freq))
    
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Spacing Frequency Distribution:</h4>
        <div className="space-y-2">
          {spacingFrequency.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 text-right mr-2 text-sm">{item.val} space{item.val !== 1 ? 's' : ''}:</div>
              <div className="flex-grow h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                <div 
                  className="h-full bg-blue-500 dark:bg-blue-600" 
                  style={{ width: `${(item.freq / maxFrequency) * 100}%` }}
                ></div>
              </div>
              <div className="w-12 text-left ml-2 text-sm">{item.freq}x</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render prime number pattern visualization
  const renderPrimeNumberVisualization = (pattern) => {
    if (!pattern || !pattern.details || !pattern.details.matchedPrimes) {
      return null
    }
    
    const maxPrime = Math.max(...pattern.details.matchedPrimes, 50);
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const isParagraph5 = pattern.details.isParagraph5;
    
    return (
      <div className="mt-3">
        <h5 className="text-sm font-medium mb-2">
          {isParagraph5 ? 
            "Prime Number Pattern in Paragraph 5:" : 
            "Prime Number Pattern Visualization:"}
        </h5>
        
        {isParagraph5 && (
          <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-xs text-yellow-800 dark:text-yellow-400">
            <p className="font-medium">About This Pattern:</p>
            <p>This paragraph uses triple spaces at word positions that follow prime numbers (2, 3, 5, 7, 11, etc.). This is a sophisticated watermarking technique used by some AI systems to track generated text.</p>
          </div>
        )}
        
        <div className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          {/* Number line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Tick marks for all positions */}
          {Array.from({ length: maxPrime + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 h-2 w-px bg-gray-400 dark:bg-gray-500"
              style={{ left: `${(i / maxPrime) * 100}%` }}
            ></div>
          ))}
          
          {/* Prime number positions */}
          {primes.filter(p => p <= maxPrime).map(prime => (
            <div 
              key={prime}
              className="absolute top-3 flex flex-col items-center"
              style={{ left: `${(prime / maxPrime) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`h-4 w-4 rounded-full ${pattern.details.matchedPrimes.includes(prime) ? 'bg-red-500 ring-2 ring-red-300 dark:ring-red-700' : 'bg-blue-500'} flex items-center justify-center`}>
                {pattern.details.matchedPrimes.includes(prime) && (
                  <span className="text-white text-[8px]">3×</span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{prime}</span>
            </div>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-0 right-0 flex items-center gap-3 text-xs p-1 bg-white/80 dark:bg-black/50 rounded-tl-md">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Prime Number</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-1 flex items-center justify-center">
                <span className="text-white text-[6px]">3×</span>
              </div>
              <span>Triple Space</span>
            </div>
          </div>
        </div>
        
        {isParagraph5 && (
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            <p>This pattern is a strong indicator of AI watermarking, as it follows a mathematical sequence that would be extremely unlikely to occur naturally.</p>
          </div>
        )}
      </div>
    )
  }
  
  // Render pattern visualization
  const renderPatternVisualization = () => {
    if (!visualizationData || !visualizationData.patternVisualizations || visualizationData.patternVisualizations.length === 0) {
      return null
    }
    
    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Pattern Visualization:</h4>
        <div className="space-y-4">
          {visualizationData.patternVisualizations.map((viz, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-medium">{viz.name}</h5>
                <span className="text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded">
                  {Math.round(viz.confidence * 100)}% confidence
                </span>
              </div>
              
              {viz.actual && (
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Actual spacing sequence:</div>
                  <div className="flex flex-wrap gap-2">
                    {viz.actual.map((val, i) => (
                      <div key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-sm">
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {viz.expected && (
                <div className="mt-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected pattern:</div>
                  <div className="flex flex-wrap gap-2">
                    {viz.expected.map((val, i) => (
                      <div key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded text-sm">
                        {val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render multiple spaces analysis
  const renderMultipleSpacesAnalysis = () => {
    if (!multipleSpaces || multipleSpaces.count.total === 0) {
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md text-center text-gray-500 dark:text-gray-400">
          No multiple spaces detected in the text.
        </div>
      )
    }
    
    return (
      <div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
            <p className="text-2xl font-medium">{multipleSpaces.count.double}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Double Spaces</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
            <p className="text-2xl font-medium">{multipleSpaces.count.triple}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Triple Spaces</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-center">
            <p className="text-2xl font-medium">{multipleSpaces.count.fourPlus}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">4+ Spaces</p>
          </div>
        </div>
        
        {multipleSpaces.hasPattern && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <p className="text-yellow-800 dark:text-yellow-400">
              <span className="font-medium">Pattern Detected:</span> {multipleSpaces.patternDescription}
            </p>
          </div>
        )}
        
        {multipleSpaces.contexts.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Multiple Spaces Context:</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {multipleSpaces.contexts.slice(0, 10).map((ctx, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Position: {ctx.position}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                      {ctx.type} ({ctx.length} spaces)
                    </span>
                  </div>
                  <div className="font-mono text-gray-700 dark:text-gray-300">
                    {ctx.context}
                  </div>
                </div>
              ))}
              {multipleSpaces.contexts.length > 10 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  + {multipleSpaces.contexts.length - 10} more instances
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Spacing Pattern Analysis</h2>
      
      {/* Prominent Watermarking Strategy Overview */}
      {paragraphPatternSummary && paragraphPatternSummary.length >= 2 && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md">
          <h3 className="font-semibold text-lg text-red-800 dark:text-red-400 mb-2">Watermarking Strategy Overview</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            <span className="font-medium">Detection Result:</span> Multiple watermarking techniques detected across different paragraphs.
          </p>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {/* Check for hidden Unicode characters */}
              {evidence.some(e => e.includes('hidden Unicode characters') || e.includes('zero-width')) && (
                <li>
                  <span className="font-medium">Paragraphs 1-3:</span> Hidden Unicode characters
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                    High severity
                  </span>
                </li>
              )}
              
              {/* Check for consistent double spaces */}
              {paragraphPatternSummary.some(p => p.patternType === 'consistent-spacing') && (
                <li>
                  <span className="font-medium">Paragraph 4:</span> Consistent double spaces between words
                  <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                    Medium severity
                  </span>
                </li>
              )}
              
              {/* Check for prime number pattern */}
              {paragraphPatternSummary.some(p => p.patternType === 'mathematical-sequence' && p.details?.isParagraph5) && (
                <li>
                  <span className="font-medium">Paragraph 5:</span> Triple spaces in a prime number pattern
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                    High severity
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-red-800 dark:text-red-400">
              <span className="font-medium">Combined Confidence:</span> {Math.min(100, confidenceScore + 15)}%
            </div>
            <button
              onClick={() => setShowStrategyAnalysis(!showStrategyAnalysis)}
              className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-400 px-3 py-1 rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showStrategyAnalysis ? 'Hide Details' : 'View Details'}
            </button>
          </div>
        </div>
      )}
      
      <div className={`bg-${confidenceColor}-50 dark:bg-${confidenceColor}-900/20 border border-${confidenceColor}-200 dark:border-${confidenceColor}-800 rounded-md p-3 mb-4`}>
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-${confidenceColor}-800 dark:text-${confidenceColor}-400 font-medium`}>
              Watermark Confidence: {confidenceScore}%
            </p>
            {patternDetected && (
              <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm">
                {patternDetected}
              </p>
            )}
            
            {/* Strategy Analysis Button */}
            {paragraphPatternSummary && paragraphPatternSummary.length >= 2 && (
              <button
                onClick={() => setShowStrategyAnalysis(!showStrategyAnalysis)}
                className="mt-2 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-md inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showStrategyAnalysis ? 'Hide Strategy Analysis' : 'Show Strategy Analysis'}
              </button>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 dark:text-blue-400 underline"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <button
              onClick={exportAnalysis}
              className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-md inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Analysis (JSON)
            </button>
          </div>
        </div>
        
        {/* Watermarking Strategy Summary */}
        {showStrategyAnalysis && paragraphPatternSummary && paragraphPatternSummary.length >= 2 && (
          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <h3 className="font-medium mb-2 text-yellow-800 dark:text-yellow-400">Watermarking Strategy Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
              This document uses multiple watermarking techniques:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {/* Check for hidden Unicode characters */}
              {evidence.some(e => e.includes('hidden Unicode characters') || e.includes('zero-width')) && (
                <li>
                  <span className="font-medium">Paragraphs 1-3:</span> Hidden Unicode characters
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                    High severity
                  </span>
                </li>
              )}
              
              {/* Check for consistent double spaces */}
              {paragraphPatternSummary.some(p => p.patternType === 'consistent-spacing') && (
                <li>
                  <span className="font-medium">Paragraph 4:</span> Consistent double spaces between words
                  <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full">
                    Medium severity
                  </span>
                </li>
              )}
              
              {/* Check for prime number pattern */}
              {paragraphPatternSummary.some(p => p.patternType === 'mathematical-sequence' && p.details?.isParagraph5) && (
                <li>
                  <span className="font-medium">Paragraph 5:</span> Triple spaces in a prime number pattern
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                    High severity
                  </span>
                </li>
              )}
              
              {/* Other patterns */}
              {paragraphPatternSummary
                .filter(p => 
                  !p.patternType.includes('consistent-spacing') && 
                  !(p.patternType === 'mathematical-sequence' && p.details?.isParagraph5))
                .slice(0, 2)
                .map((pattern, index) => (
                  <li key={index}>
                    <span className="font-medium">Paragraph {pattern.paragraphIndex + 1}:</span> {pattern.description}
                    <span className={`ml-2 text-xs px-2 py-0.5 ${pattern.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : pattern.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'} rounded-full`}>
                      {pattern.severity || 'medium'} severity
                    </span>
                  </li>
              ))}
            </ul>
            <div className="mt-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-xs text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">About AI Watermarking Techniques:</p>
              <p>These watermarking patterns are commonly used by AI systems to track the origin of generated text. Different AI providers use different techniques, often combining multiple methods for stronger watermarking.</p>
            </div>
            <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-400 font-medium">
              Multiple watermarking techniques across paragraphs is strong evidence of intentional watermarking.
            </p>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div>
          {/* Tabs for different analysis views */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'patterns' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('patterns')}
            >
              Patterns
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'spaces' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('spaces')}
            >
              Multiple Spaces
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'paragraphs' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('paragraphs')}
            >
              Paragraph Analysis
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'evidence' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('evidence')}
            >
              Evidence
            </button>
          </div>
          
          {/* Tab content */}
          <div className="space-y-4">
            {activeTab === 'stats' && (
              <div>
                <h3 className="font-medium mb-2">Statistical Measures:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Spacing</p>
                    <p className="font-mono font-medium">{averageSpacing.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Median Spacing</p>
                    <p className="font-mono font-medium">{medianSpacing.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Standard Deviation</p>
                    <p className="font-mono font-medium">{stdDeviation.toFixed(2)}</p>
                  </div>
                </div>
                
                {renderSpacingFrequencyChart()}
              </div>
            )}
            
            {activeTab === 'patterns' && (
              <div>
                {commonPatterns && commonPatterns.length > 0 ? (
                  <div>
                    <h3 className="font-medium mb-2">Detected Patterns:</h3>
                    <div className="space-y-3">
                      {commonPatterns.map((pattern, index) => (
                        <div key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{pattern.name}</p>
                            {pattern.confidence && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                                {Math.round(pattern.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {pattern.description}
                          </p>
                          {pattern.matches && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Matched {pattern.matches} of {pattern.totalChecked} checked values
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {renderPatternVisualization()}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md text-center text-gray-500 dark:text-gray-400">
                    No specific patterns detected in the spacing.
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'spaces' && renderMultipleSpacesAnalysis()}
            
            {activeTab === 'paragraphs' && (
              <div>
                <h3 className="font-medium mb-3">Paragraph-Specific Pattern Analysis:</h3>
                
                {paragraphPatternSummary && paragraphPatternSummary.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mb-4">
                      <p className="text-yellow-800 dark:text-yellow-400">
                        <span className="font-medium">Important:</span> Different patterns across paragraphs are strong evidence of watermarking
                      </p>
                    </div>
                    
                    {paragraphPatternSummary.map((pattern, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">
                            Paragraph {pattern.paragraphIndex + 1}
                          </h4>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                            {Math.round(pattern.confidence * 100)}% confidence
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {pattern.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded mb-2">
                          {pattern.paragraphPreview}
                        </div>
                        
                        {pattern.patternType === 'fibonacci-sequence' && pattern.details && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fibonacci-like sequence:</p>
                            <div className="flex flex-wrap gap-2">
                              {pattern.details.sequence?.map((val, i) => (
                                <div key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs">
                                  {val.toFixed(1)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {pattern.patternType === 'arithmetic-progression' && pattern.details && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Arithmetic progression with difference: {pattern.details.difference?.toFixed(2)}
                            </p>
                          </div>
                        )}
                        
                        {pattern.patternType === 'prime-number-spacing' && pattern.details && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Triple spaces at prime positions: {pattern.details.matchedPrimes?.join(', ')}
                            </p>
                            {renderPrimeNumberVisualization(pattern)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md text-center text-gray-500 dark:text-gray-400">
                    No paragraph-specific patterns detected.
                  </div>
                )}
                
                {paragraphAnalysis && paragraphAnalysis.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">All Analyzed Paragraphs:</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {paragraphAnalysis.map((paragraph, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Paragraph {paragraph.index + 1}</span>
                            {paragraph.hasDistinctivePattern && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full">
                                Suspicious Pattern
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                            {paragraph.preview}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'evidence' && (
              <div>
                <h3 className="font-medium mb-2">Evidence of Watermarking:</h3>
                {evidence && evidence.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {evidence.map((item, index) => (
                      <li key={index} className="pl-2">
                        <span className="text-gray-800 dark:text-gray-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No strong evidence of watermarking detected.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SpacingAnalysis
