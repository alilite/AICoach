import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { user } = useAuth();

  const linkStyle = {
    marginRight: '15px',
    color: 'white',
    textDecoration: 'none',
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
        {user ? (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <Link to="/exercises" style={linkStyle}>Exercises</Link>
            <Link to="/news" style={linkStyle}>News</Link>
            <Link to="/chat" style={linkStyle}>Chat</Link>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <Link to="/contact" style={linkStyle}>ContactUs</Link>
            <Link to="/packages" style={linkStyle}>Packages</Link>
            <Link to="/calendar" style={linkStyle}>WorkoutCalendar</Link>
            <Link to="/progress" style={linkStyle}>ProgressTracker</Link>
            <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
