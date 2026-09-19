import React, { useEffect } from 'react';

export default function Chatbot({ isOpen, onClose, onToggle }) {
  useEffect(() => {
    const scriptSrc = 'https://www.noupe.com/embed/01a0b92195487000847c5a3cf453248eb1c3.js';
    
    // Prevent duplicate script injection
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional cleanup on component unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null; // External widget embeds render their own UI
}