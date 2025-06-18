import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 mb-24 px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Brand message */}
        <p className="text-gray-600 text-sm">
          Made with <span className="text-braze-purple">♥︎</span> by The Brand Team
        </p>
        
        {/* Additional footer content can be added here */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span>Questions or feedback? Reach out to us on Slack! <span className="text-braze-purple">#brand-self-service</span></span>
          <a 
            href="https://www.braze.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-braze-purple transition-colors duration-200"
          >
            braze.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 