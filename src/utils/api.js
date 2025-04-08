import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const registerUser = async (formData) => {
    const res = await fetch('http://localhost:5000/api/users', {
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
  