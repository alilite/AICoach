import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { registerUser } from '../utils/api';
import '../styles/UserInputForm.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    dob: '',
    goal: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try 
    {
      const response = await registerUser(formData);
      // immediately sign in using Firebase client SDK
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    }
      catch (error)
    {
      console.error('Error registering user:', error);
      setErrorMessage(error.message || 'Failed to register. Try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Register</h1>
      <form className="formContainer" onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="inputContainer">
          <div className="iconContainer"><FaUser className="icon" /></div>
          <input name="firstName" className="input" type="text" placeholder="First Name" required onChange={handleChange} />
        </div>

        {/* Last Name */}
        <div className="inputContainer">
          <div className="iconContainer"><FaUser className="icon" /></div>
          <input name="lastName" className="input" type="text" placeholder="Last Name" required onChange={handleChange} />
        </div>

        {/* Email */}
        <div className="inputContainer">
          <div className="iconContainer"><FaEnvelope className="icon" /></div>
          <input name="email" className="input" type="email" placeholder="Email" required onChange={handleChange} />
        </div>

        {/* Password */}
        <div className="inputContainer">
          <div className="iconContainer"><FaLock className="icon" /></div>
          <input name="password" className="input" type="password" placeholder="Password" minLength="6" required onChange={handleChange} />
        </div>

        {/* Height */}
        <div className="inputContainer">
          <div className="iconContainer"><FaRulerVertical className="icon" /></div>
          <input name="height" className="input" type="number" placeholder="Height (cm)" min="0" required onChange={handleChange} />
        </div>

        {/* Weight */}
        <div className="inputContainer">
          <div className="iconContainer"><FaWeight className="icon" /></div>
          <input name="weight" className="input" type="number" placeholder="Weight (kg)" min="0" required onChange={handleChange} />
        </div>

        {/* Date of Birth */}
        <div className="inputContainer">
          <div className="iconContainer"><FaUser className="icon" /></div>
          <input name="dob" className="input" type="date" required onChange={handleChange} />
        </div>

        {/* Fitness Goal */}
        <div className="radioContainer">
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Fitness Goal:</label>
          <label className="radioLabel">
            <input type="radio" name="goal" value="lose-weight" required onChange={handleChange} />
            Lose Weight
          </label>
          <label className="radioLabel">
            <input type="radio" name="goal" value="gain-muscle" required onChange={handleChange} />
            Gain Muscle
          </label>
          <label className="radioLabel">
            <input type="radio" name="goal" value="maintain-weight" required onChange={handleChange} />
            Maintain Weight
          </label>
        </div>

        {errorMessage && <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{errorMessage}</div>}

        <button className="button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
