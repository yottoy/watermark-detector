import React from 'react'

const Footer = ({ companyName = 'watermarks.pro', privacyPolicyLink = '/privacy-policy', onPrivacyPolicyClick }) => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {companyName} &copy; {new Date().getFullYear()}
          </p>
          <a 
            href={privacyPolicyLink}
            onClick={(e) => {
              e.preventDefault();
              if (onPrivacyPolicyClick) onPrivacyPolicyClick();
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm cursor-pointer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
