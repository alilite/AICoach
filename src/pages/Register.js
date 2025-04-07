import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), formData);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to register. Try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90vh',
      backgroundColor: '#f7f7f7',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '350px',
      gap: '12px',
      backgroundColor: 'white',
      padding: '25px',
      boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      marginTop: '-40px',
    },
    heading: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: '700',
      color: '#333',
      marginBottom: '10px',
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    input: {
      padding: '8px 12px',
      fontSize: '14px',
      border: '1.5px solid #ccc',
      width: '100%',
      paddingLeft: '40px',
      transition: 'border-color 0.3s',
      borderRadius: '4px',
    },
    button: {
      padding: '10px',
      backgroundColor: '#ff2625',
      color: 'white',
      fontSize: '14px',
      fontWeight: '700',
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase',
      boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
    },
    iconContainer: {
      position: 'absolute',
      left: '0',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      backgroundColor: '#ff2625',
      borderTopLeftRadius: '4px',
      borderBottomLeftRadius: '4px',
    },
    icon: {
      color: 'white',
      fontSize: '12px',
    },
    radioContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '6px',
      borderRadius: '4px',
      border: '1.5px solid #ccc',
    },
    radioLabel: {
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Register</h1>
      <form style={styles.formContainer} onSubmit={handleSubmit}>
        {/* First Name */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaUser style={styles.icon} /></div>
          <input
            name="firstName"
            style={styles.input}
            type="text"
            placeholder="First Name"
            required
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaUser style={styles.icon} /></div>
          <input
            name="lastName"
            style={styles.input}
            type="text"
            placeholder="Last Name"
            required
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaEnvelope style={styles.icon} /></div>
          <input
            name="email"
            style={styles.input}
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaLock style={styles.icon} /></div>
          <input
            name="password"
            style={styles.input}
            type="password"
            placeholder="Password"
            minLength="6"
            required
            onChange={handleChange}
          />
        </div>

        {/* Height */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaRulerVertical style={styles.icon} /></div>
          <input
            name="height"
            style={styles.input}
            type="number"
            placeholder="Height (cm)"
            min="0"
            required
            onChange={handleChange}
          />
        </div>

        {/* Weight */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaWeight style={styles.icon} /></div>
          <input
            name="weight"
            style={styles.input}
            type="number"
            placeholder="Weight (kg)"
            min="0"
            required
            onChange={handleChange}
          />
        </div>

        {/* Date of Birth */}
        <div style={styles.inputContainer}>
          <div style={styles.iconContainer}><FaUser style={styles.icon} /></div>
          <input
            name="dob"
            style={styles.input}
            type="date"
            required
            onChange={handleChange}
          />
        </div>

        {/* Fitness Goal */}
        <div style={styles.radioContainer}>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Fitness Goal:</label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="goal"
              value="lose-weight"
              required
              onChange={handleChange}
            />
            Lose Weight
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="goal"
              value="gain-muscle"
              required
              onChange={handleChange}
            />
            Gain Muscle
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="goal"
              value="maintain-weight"
              required
              onChange={handleChange}
            />
            Maintain Weight
          </label>
        </div>

        {/* Submit Button */}
        <button style={styles.button} type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
