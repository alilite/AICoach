import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/UserInputForm.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try 
    {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );

        navigate('/');
    } 
    catch (error) 
    {
      console.error('Login error:', error);
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Login</h1>
      <form className="formContainer" onSubmit={handleSubmit}>
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

        {errorMessage && (
          <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}

        <button className="button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
