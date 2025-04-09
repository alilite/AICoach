import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api';

// Register User (Backend creates Firebase user + stores Firestore profile)
export const registerUser = async (formData) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};

// Login User with Firebase Auth SDK
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    return {
      token,
      userId: userCredential.user.uid,
      email: userCredential.user.email,
    };
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

// Generate Workout Plan
export const generateWorkoutPlan = async (userId) => {
  const res = await fetch(`${API_URL}/workout-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate workout plan');
  }

  return data;
};

// Get Latest Workout Plan
export const getWorkoutPlan = async (userId) => {
  const res = await fetch(`${API_URL}/workout-plans/${userId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch workout plan');
  }

  return data;
};

// Get User Profile
export const getUserProfile = async (userId) => {
    const res = await fetch(`${API_URL}/users/${userId}`);
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch user profile');
    }
  
    return data;
  };
  

