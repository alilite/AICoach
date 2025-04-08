import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{ display: 'inline-block', marginLeft: '5px' }}>
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <style>{`
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: #888;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
