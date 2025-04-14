import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation between pages
import { useAuth } from '../context/AuthContext'; // Custom hook to get logged-in user
import { signOut } from 'firebase/auth'; // Sign out function from Firebase
import { auth } from '../firebase'; // Firebase auth instance

const Navbar = () => {
  const { user } = useAuth(); // Get current user from context
  const [showDropdown, setShowDropdown] = useState(false); // Show/hide profile dropdown menu

  // Style for links in the navbar
  const linkStyle = {
    marginRight: '15px',
    color: 'white',
    textDecoration: 'none',
    position: 'relative',
    fontWeight: 'bold',
  };

  // Style for the dropdown container (like Profile ▼)
  const dropdownContainerStyle = {
    position: 'relative',
    cursor: 'pointer',
  };

  // Style for the dropdown box
  const dropdownStyle = {
    position: 'absolute',
    top: '40px',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    animation: 'fadeDown 0.3s ease-in-out',
    zIndex: 1000,
    minWidth: '200px',
  };

  // Style for each dropdown item (links inside the menu)
  const dropdownItemStyle = {
    padding: '12px 18px',
    display: 'block',
    color: '#333',
    textDecoration: 'none',
    transition: 'background 0.3s',
  };

  // What happens when hovering over a dropdown item
  const dropdownItemHover = {
    backgroundColor: '#f5f5f5',
  };

  // When the user clicks "Logout"
  const handleLogout = async () => {
    await signOut(auth); // Firebase sign out
    localStorage.removeItem('token'); // Remove stored user data
    localStorage.removeItem('userId');
  };

  return (
    <>
      {/* Simple animation when dropdown shows */}
      <style>
        {`
          @keyframes fadeDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Navbar main layout */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#ff2625',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🔥 Fitness App</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            // If user is logged in, show all nav links + profile dropdown
            <>
              <Link to="/" style={linkStyle}>Home</Link>
              <Link to="/exercises" style={linkStyle}>Exercises</Link>
              <Link to="/news" style={linkStyle}>News</Link>
              <Link to="/chat" style={linkStyle}>Chat</Link>
              <Link to="/contact" style={linkStyle}>Contact</Link>
              <Link to="/packages" style={linkStyle}>Packages</Link>

              {/* Dropdown for profile options */}
              <div
                style={dropdownContainerStyle}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <span style={linkStyle}>Profile ▼</span>

                {showDropdown && (
                  <div style={dropdownStyle}>
                    {/* Hover effect handled manually with inline events */}
                    <Link to="/profile" style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                      👤 My Profile
                    </Link>
                    <Link to="/calendar" style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                      🗓 Workout Calendar
                    </Link>
                    <Link to="/progress" style={dropdownItemStyle}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                      📈 Progress Tracker
                    </Link>
                    <span
                      onClick={handleLogout}
                      style={{ ...dropdownItemStyle, cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = ''}>
                      🔓 Logout
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            // If user is not logged in
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/register" style={linkStyle}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { signOut } from 'firebase/auth';
// import { auth } from '../firebase';

// const Navbar = () => {
//   const { user } = useAuth();

//   const linkStyle = {
//     marginRight: '15px',
//     color: 'white',
//     textDecoration: 'none',
//   };

//   const handleLogout = async () => {
//     await signOut(auth);
//     localStorage.removeItem('token');
//     localStorage.removeItem('userId');
//   };

//   return (
//     <nav style={{
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px',
//       backgroundColor: '#ff2625',
//       color: '#fff'
//     }}>
//       <h1>Fitness App</h1>
//       <div>
//         {user ? (
//           <>
//             <Link to="/" style={linkStyle}>Home</Link>
//             <Link to="/exercises" style={linkStyle}>Exercises</Link>
//             <Link to="/news" style={linkStyle}>News</Link>
//             <Link to="/chat" style={linkStyle}>Chat</Link>
//             <Link to="/profile" style={linkStyle}>Profile</Link>
//             <Link to="/contact" style={linkStyle}>ContactUs</Link>
//             <Link to="/packages" style={linkStyle}>Packages</Link>
//             <Link to="/calendar" style={linkStyle}>WorkoutCalendar</Link>
//             <Link to="/progress" style={linkStyle}>ProgressTracker</Link>
//             <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer' }}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" style={linkStyle}>Login</Link>
//             <Link to="/register" style={linkStyle}>Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
