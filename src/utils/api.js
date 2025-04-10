import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

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
export const generateWorkoutPlan = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/workout-plans`, {
    method: 'POST',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate workout plan');
  return data;
};

// Get Workout Plan
export const getWorkoutPlan = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/workout-plans`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch workout plan');
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

 // Generate Meal Plan (Secure)
export const generateMealPlan = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/meal-plans`, {
    method: 'POST',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate meal plan');
  return data;
};

// Get Latest Meal Plan (Secure)
export const getMealPlan = async () => {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_URL}/meal-plans`, { headers });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch meal plan');
  return data;
};

  // Update User Profile
export const updateUserProfile = async (userId, updatedData) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user profile');
  }

  return data;
};

// Delete User
export const deleteUser = async (userId) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete user');
  }

  return data;
};


// Get chat history
export const getChatHistory = async (token) => {
  const res = await fetch(`${API_URL}/chats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch chat history');
  return data;
};

// Send message to AI
export const sendMessageToAI = async (token, input, history) => {
  const res = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ input, history }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data.response;
};

// Delete Chat
export const deleteChatById = async (token, chatId) => {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete chat');
  return data;
};

  

