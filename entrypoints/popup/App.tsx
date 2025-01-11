import { useState } from 'react';
import './App.css';
import '@/assets/main.css';

function App() {

  const handleActivate = () => {
    // Send a message to the content script to reload the current tab
    chrome.runtime.sendMessage({ action: "reloadPage" }, (response) => {
      console.log(response?.status);
    });
  }

  return (
    <div className="h-auto w-80 p-6 flex flex-col items-center justify-center gap-6 bg-white">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient-x">
        Twitter Follow
      </h1>

      <div className="w-full flex flex-col items-start justify-start gap-3">
        <span className="text-sm font-medium text-gray-700">Instructions:</span>
        <ul className="space-y-2">
          {[
            "For using the extension user should be on home page in 'For you' Section",
            "Click 'Follow All' on the floating button to automate.",
            "Click 'Stop' on the floating button to stop the process."
          ].map((text, index) => (
            <li key={index} className="font-semibold text-justify text-sm text-gray-600 flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
          Press this button only on Home page in For You section
        </span>
        <button onClick={handleActivate} className="px-6 py-2.5 font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-purple-200 outline-none focus:outline-none">
          Activate
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-sm text-gray-600">Made by</span>
        <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Avinash Gupta
        </span>
        <span className="animate-bounce">🤟</span>
      </div>
    </div>
  );
}

export default App;