/** 
 * Imports the React library, providing core functionality for building user interface components.
 */
import React from 'react';

const HorizontalScrollbar = ({ data, selectedBodyPart, setSelectedBodyPart }) => {
  return (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      padding: '10px 0',
      gap: '15px',
      marginBottom: '20px',
      scrollBehavior: 'smooth'
    }}>
      {data.map((item) => (
        <button
          key={item}
          onClick={() => setSelectedBodyPart(item)}
          style={{
            padding: '10px 20px',
            minWidth: '120px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: selectedBodyPart === item ? '#ff2625' : '#fff',
            color: selectedBodyPart === item ? '#fff' : '#000',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default HorizontalScrollbar;
