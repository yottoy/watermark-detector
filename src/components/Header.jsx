import React from 'react'

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Watermark Detector
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Identify and remove invisible watermarking in text content
        </p>
      </div>
    </header>
  )
}

export default Header
