import React, { useState } from 'react'

const SampleGenerator = ({ onSelectSample }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelectSample = (sample) => {
    onSelectSample(sample.text)
    setIsOpen(false)
  }
  
  const samples = [
    {
      id: 'zwj',
      name: 'Zero-Width Joiner Example',
      description: 'Text with zero-width joiners (ZWJ) hidden between words',
      text: 'This‍ text‍ contains‍ zero-width‍ joiners‍ between‍ words.'
    },
    {
      id: 'zwsp',
      name: 'Zero-Width Space Example',
      description: 'Text with zero-width spaces hidden throughout',
      text: 'This​ text​ has​ zero-width​ spaces​ inserted​ between​ words.'
    },
    {
      id: 'mixed',
      name: 'Mixed Hidden Characters',
      description: 'Text with various hidden characters mixed in',
      text: 'This⁠ text⁠ has⁠ various⁠ hidden⁠ characters⁠ like⁠ ZWJ‍, ZWSP​, and⁠ word⁠ joiners⁠.'
    },
    {
      id: 'spacing',
      name: 'Spacing Pattern Example',
      description: 'Text with unusual spacing patterns that follow a mathematical sequence',
      text: 'This  text  has  unusual   spacing   patterns    that     follow      mathematical       sequences.'
    }
  ]

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 dark:text-blue-400 text-sm flex items-center"
      >
        <svg 
          className={`w-4 h-4 mr-1 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {isOpen ? 'Hide Sample Text' : 'Try Sample Text'}
      </button>
      
      {isOpen && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {samples.map((sample) => (
            <div 
              key={sample.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => handleSelectSample(sample)}
            >
              <h3 className="font-medium text-blue-600 dark:text-blue-400">{sample.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sample.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SampleGenerator
