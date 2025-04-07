import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = {
    marginRight: '15px',
    color: 'white',
    textDecoration: 'none'
  };

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
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/news" style={linkStyle}>News</Link>
        <Link to="/user" style={linkStyle}>User Form</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
        <Link to="/chat" style={linkStyle}>Chat</Link>
        <Link to="/chat-history" style={linkStyle}>ChatHistory</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
        <Link to="/workout-plans" style={linkStyle}>WorkoutPlans</Link>
        <Link to="/contact" style={linkStyle}>ContactUs</Link>
        <Link to="/packages" style={linkStyle}>Packages</Link>
        <Link to="/calendar" style={linkStyle}>WorkoutCalendar</Link>
        <Link to="/progress" style={linkStyle}>ProgressTracker</Link>




        





      </div>
    </nav>
  );
};

export default Navbar;
