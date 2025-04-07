import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { generateDietPlan } from '../utils/cohere';

const UserForm = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    height: '',
    weight: '',
    goal: '',
  });

  const [dietPlan, setDietPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const age = calculateAge(user.dob);

    try {
      const response = await generateDietPlan({ ...user, age });
      setDietPlan(response);

      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        age,
        dob: user.dob,
        goal: user.goal,
        height: user.height,
        weight: user.weight,
      };

      // Save user profile
      await fetch('http://localhost:5000/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Save diet plan
      await fetch('http://localhost:5000/api/save-diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userData, plan: response }),
      });
    } catch (err) {
      console.error(err);
      setDietPlan('⚠️ Something went wrong. Try again later.');
    }

    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Diet Plan for ${user.firstName} ${user.lastName}`, 10, 10);
    doc.text(dietPlan, 10, 20);
    doc.save(`${user.firstName}_diet_plan.pdf`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>🥗 Personalized Diet Plan Generator (Cohere AI)</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="firstName" placeholder="First Name" required onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
        <input name="dob" type="date" required onChange={handleChange} />
        <input name="height" type="number" placeholder="Height (cm)" required onChange={handleChange} />
        <input name="weight" type="number" placeholder="Weight (kg)" required onChange={handleChange} />
        <select name="goal" required onChange={handleChange}>
          <option value="">Select Fitness Goal</option>
          <option value="lose weight">Lose Weight</option>
          <option value="gain muscle">Gain Muscle</option>
          <option value="maintain weight">Maintain Weight</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#ff2625', color: 'white', border: 'none' }}
        >
          {loading ? 'Generating...' : 'Get Diet Plan'}
        </button>
      </form>

      {dietPlan && (
        <div style={{ marginTop: '30px', whiteSpace: 'pre-line', background: '#f7f7f7', padding: '20px', borderRadius: '10px' }}>
          <h3>Your Personalized Diet Plan:</h3>
          <p>{dietPlan}</p>

          <button
            onClick={handleDownloadPDF}
            style={{ marginTop: '20px', background: '#4caf50', color: '#fff', padding: '10px', border: 'none', borderRadius: '5px' }}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default UserForm;
