import React from 'react'
import AdSense from './AdSense'

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watermark Detector</h1>
        <AdSense 
          slot="1234567890" 
          format="horizontal"
          className="w-full"
        />
      </div>
    </header>
  )
}

export default Header
