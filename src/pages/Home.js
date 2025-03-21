import React, { useEffect, useState } from 'react';
import { fetchData, exerciseOptions } from '../utils/fetchData';

const Home = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const getExercises = async () => {
      const data = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises',
        exerciseOptions
      );
      setExercises(data);
    };

    getExercises();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to the Fitness App</h2>
      <p>Showing {exercises.length} exercises from RapidAPI!</p>
      <ul>
        {exercises.slice(0, 10).map((exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
