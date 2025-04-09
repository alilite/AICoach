import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { generatePDF, parseStructuredPlan } from '../utils/pdfHelpers';
import { generateWorkoutPlan, getWorkoutPlan, getUserProfile } from '../utils/api';
import '../styles/Home.css';


const Home = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [workoutTime, setWorkoutTime] = useState(null);
  const [mealTime, setMealTime] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [loadingMeal, setLoadingMeal] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
  
    const fetchData = async () => {
      try {
        // Get User Profile
        const profile = await getUserProfile(userId);
        if (profile.firstName && profile.lastName) {
          setUserName(`${profile.firstName} ${profile.lastName}`);
        }
  
        // Get Workout Plan
        const workout = await getWorkoutPlan(userId);
        setWorkoutPlan(workout.plan);
        setWorkoutTime(workout.createdAt);
      } catch (err) {
        if (err.message.includes('not found')) {
          await regenerateWorkoutPlan();
        } else {
          console.error('Workout fetch error:', err);
        }
      } finally {
        setLoadingWorkout(false);
      }
    };
  
    fetchData();
  }, [userId]);

  const regenerateWorkoutPlan = async () => {
    setLoadingWorkout(true);
    try {
      const data = await generateWorkoutPlan(userId);
      setWorkoutPlan(data.plan || 'No plan returned.');
      setWorkoutTime(new Date());
    } catch (err) {
      console.error('Workout generation error:', err);
    } finally {
      setLoadingWorkout(false);
    }
  };

  const regenerateMealPlan = async () => {
    setLoadingMeal(true);
    try {
      const res = await fetch('http://localhost:5000/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setMealPlan(data.plan || 'No plan returned.');
      setMealTime(new Date());
    } catch (err) {
      console.error('Meal generation error:', err);
    } finally {
      setLoadingMeal(false);
    }
  };

  const Card = ({ title, icon, content, timestamp, onRegenerate, loading, downloadLabel }) => {
    const parsedContent = parseStructuredPlan(content);
  
    return (
      <div
        style={{
          background: '#f9f9f9',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          marginBottom: '30px',
          fontFamily: 'monospace'
        }}
      >
        {/* Title / Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>{icon}</span>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#222' }}>{title}</h3>
        </div>
  
        {/* Scrollable Content */}
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #eee',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#fff'
          }}
        >
          {Array.isArray(parsedContent) ? (
            parsedContent.map((entry, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <strong style={{ fontSize: '15px', color: '#333' }}>{entry.day}</strong>
                <p
                  style={{
                    whiteSpace: 'pre-line',
                    margin: '5px 0 0 10px',
                    fontSize: '13px',
                    color: '#444'
                  }}
                >
                  {entry.details}
                </p>
              </div>
            ))
          ) : (
            <p style={{ whiteSpace: 'pre-line', fontSize: '13px', color: '#444' }}>
              {parsedContent || 'No data yet.'}
            </p>
          )}
        </div>
  
        {/* Metadata */}
        {timestamp && (
          <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
            ⏱ Last updated: {new Date(timestamp).toLocaleString()}
          </p>
        )}
  
        {/* Buttons */}
        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={onRegenerate} disabled={loading} className="generate-button">
  {loading ? (
    <>
      Generating...
      <span className="spinner" />
    </>
  ) : (
    'Generate New'
  )}
</button>
          {content && (
            <button
            onClick={() =>
              generatePDF(
                title,
                parsedContent,
                title.replace(/\s+/g, '_'),
                userName,
                Array.isArray(parsedContent)
              )
            }
          >
            {downloadLabel}
          </button>          
          )}
        </div>
      </div>
    );
  };
  

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>🏠 Home</h2>
      <Card
        title="Meal Plan"
        content={mealPlan}
        timestamp={mealTime}
        onRegenerate={regenerateMealPlan}
        loading={loadingMeal}
        downloadLabel="Download Meal PDF"
      />
      <Card
        title="Workout Plan"
        content={workoutPlan}
        timestamp={workoutTime}
        onRegenerate={regenerateWorkoutPlan}
        loading={loadingWorkout}
        downloadLabel="Download Workout PDF"
      />
    </div>
  );
};

export default Home;