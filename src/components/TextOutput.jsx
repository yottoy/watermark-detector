import React, { useRef } from 'react'

const TextOutput = ({ cleanedText, hasHiddenChars, onExport, onCopy, copySuccess }) => {
  const textRef = useRef(null)

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(cleanedText)
        .then(() => {
          // Could add a toast notification here
          console.log('Text copied to clipboard')
        })
        .catch(err => {
          console.error('Failed to copy text: ', err)
        })
    }
  }

  if (!cleanedText) {
    return null
  }

  return (
    <div className="card">
      {/* Prominent Copy Cleaned Text button at the top */}
      {onCopy && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-400">Watermarks Removed</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">This text has been cleaned of all detected watermarks.</p>
          </div>
          <button
            onClick={onCopy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            {copySuccess ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Cleaned Text
              </>
            )}
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Cleaned Text</h2>
        <div className="flex space-x-2">
          {onExport && (
            <button
              onClick={onExport}
              className="btn btn-primary text-sm"
              title="Export analysis results as JSON"
            >
              Export Results
            </button>
          )}
          <button 
            onClick={copyToClipboard}
            className="btn btn-secondary text-sm"
            disabled={!cleanedText}
            title="Copy cleaned text to clipboard"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>
      
      {hasHiddenChars ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3 mb-4">
          <p className="text-green-800 dark:text-green-400 text-sm">
            Hidden characters were found and removed from the text below.
          </p>
        </div>
      ) : cleanedText ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
          <p className="text-blue-800 dark:text-blue-400 text-sm">
            No hidden characters were detected in this text.
          </p>
        </div>
      ) : null}
      
      <div 
        ref={textRef}
        className="w-full h-48 p-3 border border-gray-300 dark:border-gray-700 rounded-md 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-auto"
      >
        {cleanedText}
      </div>
    </div>
  )
}

export default TextOutput
