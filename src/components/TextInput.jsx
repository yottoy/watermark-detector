import React, { useState } from 'react'

const TextInput = ({ onTextChange, textTooLong, characterLimit = 100000, children }) => {
  const [text, setText] = useState('')
  
  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    onTextChange(newText)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Input Text</h2>
      <div>
        <textarea
          className={`w-full h-64 p-3 border rounded-md resize-none
            ${textTooLong ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
          placeholder="Paste text here to analyze for hidden characters and spacing patterns..."
          value={text}
          onChange={handleTextChange}
          disabled={false}
        />
        <div className="mt-4">
          {/* Children will be the WatermarkSelection component */}
          {children}
          
          <div className="mt-4 text-right">
            <div className={`text-sm ${textTooLong ? 'text-red-500 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {text.length} / {characterLimit} characters
              {textTooLong && (
                <div className="text-red-600 dark:text-red-400 mt-1">
                  Text exceeds the {characterLimit.toLocaleString()} character limit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextInput
