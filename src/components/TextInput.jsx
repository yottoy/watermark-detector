import React, { useState } from 'react'

const TextInput = ({ onAnalyze, isAnalyzing, onTextChange, textTooLong, characterLimit = 100000 }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !textTooLong) {
      onAnalyze()
    }
  }
  
  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    onTextChange(newText)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Input Text</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className={`w-full h-64 p-3 border rounded-md resize-none
            ${textTooLong ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          placeholder="Paste text here to analyze for hidden characters and spacing patterns..."
          value={text}
          onChange={handleTextChange}
          disabled={isAnalyzing}
        />
        <div className="mt-4 flex justify-between items-center">
          <div className={`text-sm ${textTooLong ? 'text-red-500 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
            {text.length} / {characterLimit} characters
            {textTooLong && (
              <div className="text-red-600 dark:text-red-400 mt-1">
                Text exceeds the {characterLimit.toLocaleString()} character limit
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!text.trim() || isAnalyzing || textTooLong}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TextInput
