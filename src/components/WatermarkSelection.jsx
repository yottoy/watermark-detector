import React, { useState } from 'react'

const WatermarkSelection = ({ watermarkOptions, selectedWatermarks, onWatermarkToggle, onAnalyze, isAnalyzing, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Group watermark options by category
  const groupedOptions = watermarkOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {});

  return (
    <div className="card mt-4 p-4">
      <div className="flex justify-between items-center">
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center cursor-pointer"
        >
          <svg 
            className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {isExpanded ? 'Hide Detection Options' : 'Detection Options'}
          </h3>
        </div>
        
        <button
          onClick={(e) => {
            e.preventDefault();
            onAnalyze();
          }}
          className="btn btn-primary"
          disabled={isAnalyzing || disabled}
          type="button"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Select which types of watermarks you want to detect and remove. Unchecking a watermark type will preserve its formatting in the cleaned text.
          </p>
          
          {Object.entries(groupedOptions).map(([category, options]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</h3>
              <div className="space-y-2">
                {options.map(option => (
                  <div key={option.id} className="flex items-start p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center h-4 mt-0.5">
                      <input
                        id={`watermark-${option.id}`}
                        type="checkbox"
                        checked={selectedWatermarks.includes(option.id)}
                        onChange={() => onWatermarkToggle(option.id)}
                        className="focus:ring-blue-500 h-3 w-3 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-2 text-xs">
                      <label htmlFor={`watermark-${option.id}`} className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer">
                        {option.name}
                      </label>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        <span className="font-medium">Severity:</span> {option.severity} - {option.severityDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs text-blue-800 dark:text-blue-400">
              <span className="font-medium">Note:</span> Some academic formatting like double spacing or specific line breaks might be detected as watermarks. Uncheck those options if you want to preserve your document's formatting.
            </p>
          </div>
          

        </div>
      )}
    </div>
  )
}

export default WatermarkSelection
