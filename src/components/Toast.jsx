import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 pixel-box bg-pixel-goldenSun text-black px-4 py-2.5 text-xs font-bold transition-all duration-200 animate-bounce"
      role="status"
    >
      {message}
    </div>
  );
}
