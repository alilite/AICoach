import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [mealPlan, setMealPlan] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [loadingMeal, setLoadingMeal] = useState(false);
  const [loadingWorkout, setLoadingWorkout] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const workoutSnapshot = await getDocs(
          query(collection(db, 'workoutPlans'), orderBy('createdAt', 'desc'))
        );
        const latestWorkout = workoutSnapshot.docs[0]?.data()?.plan || '';
        setWorkoutPlan(latestWorkout);

        const dietSnapshot = await getDocs(
          query(collection(db, 'dietPlans'), orderBy('createdAt', 'desc'))
        );
        const latestMeal = dietSnapshot.docs[0]?.data()?.plan || '';
        setMealPlan(latestMeal);
      } catch (err) {
        console.error('Error fetching plans:', err);
      }
    };

    fetchPlans();
  }, []);

  const handleGenerateMealPlan = async () => {
    setLoadingMeal(true);
    try {
      const res = await fetch('http://localhost:5000/api/meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'some-user-id' }), // Replace with real ID or token-based logic
      });
      const data = await res.json();
      setMealPlan(data.plan || 'No plan returned.');
    } catch (err) {
      console.error('Error generating meal plan:', err);
    }
    setLoadingMeal(false);
  };

  const handleGenerateWorkoutPlan = async () => {
    setLoadingWorkout(true);
    try {
      const res = await fetch('http://localhost:5000/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'some-user-id' }),
      });
      const data = await res.json();
      setWorkoutPlan(data.plan || 'No plan returned.');
    } catch (err) {
      console.error('Error generating workout plan:', err);
    }
    setLoadingWorkout(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🏠 Welcome Back!</h2>

      <section style={{ marginBottom: '30px' }}>
        <h3>🥗 Meal Plan</h3>
        {mealPlan ? (
          <>
            <div style={{ whiteSpace: 'pre-line', background: '#f7f7f7', padding: '15px', borderRadius: '10px' }}>
              {mealPlan}
            </div>
            <button onClick={handleGenerateMealPlan} disabled={loadingMeal} style={{ marginTop: '15px' }}>
              {loadingMeal ? 'Generating...' : 'Generate Another Meal Plan'}
            </button>
          </>
        ) : (
          <button onClick={handleGenerateMealPlan} disabled={loadingMeal}>
            {loadingMeal ? 'Generating...' : 'Generate Meal Plan'}
          </button>
        )}
      </section>

      <section>
        <h3>💪 Workout Plan</h3>
        {workoutPlan ? (
          <>
            <div style={{ whiteSpace: 'pre-line', background: '#f1f1f1', padding: '15px', borderRadius: '10px' }}>
              {workoutPlan}
            </div>
            <button onClick={handleGenerateWorkoutPlan} disabled={loadingWorkout} style={{ marginTop: '15px' }}>
              {loadingWorkout ? 'Generating...' : 'Generate Another Workout Plan'}
            </button>
          </>
        ) : (
          <button onClick={handleGenerateWorkoutPlan} disabled={loadingWorkout}>
            {loadingWorkout ? 'Generating...' : 'Generate Workout Plan'}
          </button>
        )}
      </section>
    </div>
  );
};

export default Home;
