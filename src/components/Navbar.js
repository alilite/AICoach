import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#ff2625',
      color: '#fff'
    }}>
      <h1>Fitness App</h1>
      <div>
        <Link to="/" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/news" style={linkStyle}>News</Link>
        <Link to="/user" style={linkStyle}>User Form</Link>

      </div>
    </nav>
  );
};

export default Navbar;
