import React, { useEffect, useState } from 'react';
import { fetchData, exerciseOptions } from '../utils/fetchData';
import SearchExercises from '../components/SearchExercises';
import ExerciseCard from '../components/ExerciseCard';
import HorizontalScrollbar from '../components/HorizontalScrollbar';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 10;

  useEffect(() => {
    const fetchBodyParts = async () => {
      const bodyPartData = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises/bodyPartList',
        exerciseOptions
      );
      setBodyParts(['all', ...bodyPartData]);
    };
    fetchBodyParts();
  }, []);

  useEffect(() => {
    const fetchExercisesData = async () => {
      const url =
        selectedBodyPart === 'all'
          ? 'https://exercisedb.p.rapidapi.com/exercises'
          : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedBodyPart}`;

      const data = await fetchData(url, exerciseOptions);
      setExercises(data);
      setCurrentPage(1);
    };
    fetchExercisesData();
  }, [selectedBodyPart]);

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧠 Explore Exercises</h2>
      <SearchExercises setExercises={setExercises} />
      <HorizontalScrollbar
        data={bodyParts}
        selectedBodyPart={selectedBodyPart}
        setSelectedBodyPart={setSelectedBodyPart}
      />
      <h3>Showing {exercises.length} exercises</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {[...Array(Math.ceil(exercises.length / exercisesPerPage)).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => paginate(num + 1)}
            style={{
              padding: '8px 16px',
              margin: '0 5px',
              backgroundColor: currentPage === num + 1 ? '#ff2625' : '#eee',
              color: currentPage === num + 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
