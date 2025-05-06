import React from 'react';

function HelloCard() {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        {/* You can replace this with an actual image or icon */}
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Hello!</div>
        <p className="text-gray-500">This is a Tailwind CSS card.</p>
      </div>
    </div>
  );
}

export default HelloCard; 