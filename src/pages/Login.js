import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/UserInputForm.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // For redirecting after login

  // Track user input and error message
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  // Update form data when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission and login logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Attempt to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // On success, navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid email or password.'); // Show error to user
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Login</h1>

      {/* Login form */}
      <form className="formContainer" onSubmit={handleSubmit}>
        {/* Email input */}
        <div className="inputContainer">
          <div className="iconContainer">📧</div>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
        </div>

        {/* Password input */}
        <div className="inputContainer">
          <div className="iconContainer">🔒</div>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />
        </div>

        {/* Error message */}
        {errorMessage && (
          <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button className="button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
