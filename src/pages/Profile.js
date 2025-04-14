import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../utils/api';
import '../styles/Profile.css';

const Profile = () => {
  // State to track user and profile details
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    height: '',
    weight: '',
    dob: '',
    goal: '',
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [editing, setEditing] = useState(false); // Toggle edit mode
  const [message, setMessage] = useState(''); // Success/error message
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile from backend
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);

        // Convert Firestore timestamp to ISO date format for input
        if (data.dob && data.dob._seconds) {
          const date = new Date(data.dob._seconds * 1000);
          data.dob = date.toISOString().split('T')[0];
        }

        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setMessage('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Update input values in state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated profile to backend
  const handleUpdate = async () => {
    try {
      await updateUserProfile(userId, profile);
      setMessage('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Failed to update profile.');
    }
  };

  // Delete user account
  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      setMessage('User deleted. Please refresh or logout.');
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Failed to delete user.');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>👤 Profile</h2>

      {/* Display message if any */}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Show fallback if no profile */}
      {Object.keys(profile).length === 0 ? (
        <p>No profile data available.</p>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
          {/* Loop through profile fields */}
          {['firstName', 'lastName', 'email', 'dob', 'height', 'weight'].map((field) => (
            <div key={field} style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 'bold', display: 'block' }}>
                {field.replace(/([A-Z])/g, ' $1')}:
              </label>
              <input
                type={field === 'dob' ? 'date' : 'text'}
                name={field}
                value={profile[field]}
                onChange={handleChange}
                disabled={!editing}
                style={{
                  width: '100%',
                  padding: '8px',
                  fontSize: '14px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  background: editing ? '#fff' : '#f1f1f1',
                }}
              />
            </div>
          ))}

          {/* Goal dropdown field */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Goal:</label>
            <select
              name="goal"
              value={profile.goal}
              onChange={handleChange}
              disabled={!editing}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                background: editing ? '#fff' : '#f1f1f1',
              }}
            >
              <option value="">Select your goal</option>
              <option value="lose-weight">Lose Weight</option>
              <option value="gain-muscle">Gain Muscle</option>
              <option value="maintain-weight">Maintain Weight</option>
            </select>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            {!editing ? (
              <button onClick={() => setEditing(true)}>Edit</button>
            ) : (
              <>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </>
            )}
            <button
              onClick={handleDelete}
              style={{ backgroundColor: 'red', color: 'white' }}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
