import React, { useState } from 'react'

const CharacterAnalysis = ({ characters, categories, confidenceScore, totalHiddenChars }) => {
  const [expandedCharacter, setExpandedCharacter] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [showContexts, setShowContexts] = useState(false)

  if (!characters || characters.length === 0) {
    return null
  }

  // Filter characters based on active category tab
  const filteredCharacters = activeTab === 'all' 
    ? characters 
    : characters.filter(char => char.category === activeTab)

  const toggleExpand = (id) => {
    if (expandedCharacter === id) {
      setExpandedCharacter(null)
    } else {
      setExpandedCharacter(id)
    }
  }

  // Get color based on confidence score
  const getConfidenceColor = () => {
    if (confidenceScore >= 70) return 'red'
    if (confidenceScore >= 40) return 'yellow'
    return 'blue'
  }
  
  const confidenceColor = getConfidenceColor()

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Hidden Character Detection</h2>
      
      <div className={`bg-${confidenceColor}-50 dark:bg-${confidenceColor}-900/20 border border-${confidenceColor}-200 dark:border-${confidenceColor}-800 rounded-md p-3 mb-4`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-${confidenceColor}-800 dark:text-${confidenceColor}-400 font-medium`}>
              Watermark Confidence: {confidenceScore}%
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {totalHiddenChars} hidden characters across {categories.length} categories
            </p>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setShowContexts(!showContexts)}
              className="text-sm text-blue-600 dark:text-blue-400 underline"
            >
              {showContexts ? 'Hide Contexts' : 'Show Contexts'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 text-sm rounded-full ${activeTab === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
        >
          All ({characters.length})
        </button>
        
        {categories.map(cat => (
          <button
            key={cat.category}
            onClick={() => setActiveTab(cat.category)}
            className={`px-3 py-1 text-sm rounded-full ${activeTab === cat.category 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            {cat.category} ({cat.count})
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {filteredCharacters.map((char) => (
          <div 
            key={char.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
          >
            <div 
              className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 cursor-pointer"
              onClick={() => toggleExpand(char.id)}
            >
              <div>
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm mr-2">
                  U+{char.codePoint}
                </span>
                <span className="font-medium">{char.name}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({char.category})
                </span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full text-sm">
                  {char.count} {char.count === 1 ? 'occurrence' : 'occurrences'}
                </span>
                <svg 
                  className={`w-5 h-5 ml-2 transition-transform ${expandedCharacter === char.id ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {expandedCharacter === char.id && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                {showContexts ? (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Character Context:</h4>
                    <div className="space-y-2">
                      {char.contexts.slice(0, 5).map((ctx, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                          <span className="text-gray-500 dark:text-gray-400 text-xs mr-2">[pos: {ctx.position}]</span>
                          <span className="font-mono">
                            <span className="text-gray-600 dark:text-gray-400">{ctx.before}</span>
                            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-1">[{char.name}]</span>
                            <span className="text-gray-600 dark:text-gray-400">{ctx.after}</span>
                          </span>
                        </div>
                      ))}
                      {char.contexts.length > 5 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          + {char.contexts.length - 5} more occurrences
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Positions in text:</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {char.positions.slice(0, 30).map((pos) => (
                        <div 
                          key={pos} 
                          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-center text-sm"
                        >
                          {pos}
                        </div>
                      ))}
                      {char.positions.length > 30 && (
                        <div className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">
                          + {char.positions.length - 30} more positions
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Character Information:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Unicode:</span>
                      <p className="font-mono">U+{char.codePoint}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
                      <p>{char.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CharacterAnalysis
