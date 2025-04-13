import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  generatePDF,
  parseStructuredPlan
} from '../utils/pdfHelpers';
import {
  generateWorkoutPlan,
  getWorkoutPlan,
  getUserProfile,
  getMealPlan,
  generateMealPlan
} from '../utils/api';
import '../styles/Home.css';

const Home = () => {
  // Authenticated user's info and plan states
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [workoutTime, setWorkoutTime] = useState(null);
  const [mealTime, setMealTime] = useState(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [loadingMeal, setLoadingMeal] = useState(true);

  // Detect logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile and plans
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // Get user name
        const profile = await getUserProfile(userId);
        if (profile.firstName && profile.lastName) {
          setUserName(`${profile.firstName} ${profile.lastName}`);
        }

        // Try fetching workout plan
        const workout = await getWorkoutPlan();
        setWorkoutPlan(workout.plan);
        setWorkoutTime(workout.createdAt);
      } catch (err) {
        // Generate a new one if not found
        if (err.message.includes('not found')) {
          await regenerateWorkoutPlan();
        } else {
          console.error('Workout fetch error:', err);
        }
      } finally {
        setLoadingWorkout(false);
      }

      try {
        // Try fetching meal plan
        const meal = await getMealPlan();
        setMealPlan(meal.plan);
        setMealTime(meal.createdAt);
      } catch (err) {
        // Generate a new one if not found
        if (err.message.includes('not found')) {
          await regenerateMealPlan();
        } else {
          console.error('Meal fetch error:', err);
        }
      } finally {
        setLoadingMeal(false);
      }
    };

    fetchData();
  }, [userId]);

  // Regenerate workout plan
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

  // Regenerate meal plan
  const regenerateMealPlan = async () => {
    setLoadingMeal(true);
    try {
      const data = await generateMealPlan(userId);
      setMealPlan(data.plan || 'No plan returned.');
      setMealTime(new Date());
    } catch (err) {
      console.error('Meal generation error:', err);
    } finally {
      setLoadingMeal(false);
    }
  };

  // Card component for displaying and downloading plans
  const Card = ({ title, icon, content, timestamp, onRegenerate, loading, downloadLabel }) => {
    const parsedContent = parseStructuredPlan(content);

    return (
      <div className="plan-card">
        <div className="card-header">
          <span>{icon}</span>
          <h3>{title}</h3>
        </div>

        {/* Plan content displayed line by line or day-by-day */}
        <div className="card-content">
          {Array.isArray(parsedContent) ? (
            parsedContent.map((entry, i) => (
              <div key={i}>
                <strong>{entry.day}</strong>
                <p>{entry.details}</p>
              </div>
            ))
          ) : (
            <p>{parsedContent || 'No data yet.'}</p>
          )}
        </div>

        {/* Timestamp of last generation */}
        {timestamp && (
          <p className="card-timestamp">
            ⏱ Last updated: {new Date(timestamp).toLocaleString()}
          </p>
        )}

        {/* Buttons: Regenerate + Download PDF */}
        <div className="card-actions">
          <button onClick={onRegenerate} disabled={loading} className="generate-button">
            {loading ? 'Generating...' : 'Generate New'}
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
    <div className="home-container">
      <h2>🏠 Home</h2>

      {/* Meal Plan Card */}
      <Card
        title="Meal Plan"
        content={mealPlan}
        timestamp={mealTime}
        onRegenerate={regenerateMealPlan}
        loading={loadingMeal}
        downloadLabel="Download Meal PDF"
      />

      {/* Workout Plan Card */}
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
