import React from 'react';

// This component shows a typing indicator (3 animated dots)
const TypingIndicator = () => {
  return (
    <div style={{ display: 'inline-block', marginLeft: '5px' }}>
      {/* Dots that simulate typing animation */}
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />

      {/* Inline CSS for dot animation */}
      <style>{`
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: #888;
          border-radius: 50%; /* Makes the dot circular */
          animation: bounce 1.4s infinite; /* Applies bouncing animation */
        }

        /* Add delay for the second dot */
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        /* Add delay for the third dot */
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Animation keyframes for the bouncing effect */
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0); // dot disappears
          } 
          40% {
            transform: scale(1); // dot appears (bounce effect)
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
