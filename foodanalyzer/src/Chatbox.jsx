// src/Chatbot.jsx

import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Chatbot = () => {
  return (
    <>
    <Navbar/>
     <div className="chatbot-container" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <iframe
        src="https://cdn.botpress.cloud/webchat/v3.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/03/16/20250803165730-FFDU497E.json"
        title="AI Chatbot"
        style={{ width: '85vw', height: '600px', border: 'none', borderRadius: '10px' }}
        allow="microphone"
      ></iframe>
      
    </div>
    <Footer/>
    </>
   

  );
};

export default Chatbot;
