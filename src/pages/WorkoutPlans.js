import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const WorkoutPlans = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    goal: '',
  });

  const [workoutPlan, setWorkoutPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `Create a detailed 7-day workout plan for:
    - Name: ${user.firstName} ${user.lastName}
    - Age: ${user.age}
    - Fitness Goal: ${user.goal}
    
    The plan should include different workouts per day, rest days if needed, and brief instructions for each.`;

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt,
          max_tokens: 600,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const planText = data.generations?.[0]?.text?.trim() || 'Could not generate workout plan.';
      setWorkoutPlan(planText);

      await addDoc(collection(db, 'workoutPlans'), {
        user,
        plan: planText,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Workout generation error:', error);
      setWorkoutPlan('Error generating plan. Try again later.');
    }

    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`Workout Plan for ${user.firstName} ${user.lastName}`, 10, 10);
    doc.text(workoutPlan, 10, 20);
    doc.save(`${user.firstName}_workout_plan.pdf`);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>🏋️ Personalized Workout Plan</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="firstName" placeholder="First Name" required onChange={handleChange} />
        <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" required onChange={handleChange} />
        <select name="goal" required onChange={handleChange}>
          <option value="">Select Fitness Goal</option>
          <option value="build muscle">Build Muscle</option>
          <option value="lose weight">Lose Weight</option>
          <option value="improve endurance">Improve Endurance</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#ff2625', color: 'white', border: 'none' }}
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {workoutPlan && (
        <div style={{ marginTop: '30px', whiteSpace: 'pre-line', background: '#f7f7f7', padding: '20px', borderRadius: '10px' }}>
          <h3>💪 Weekly Workout Plan:</h3>
          <p>{workoutPlan}</p>

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

export default WorkoutPlans;
