import React from 'react';
import { useParams } from 'react-router-dom';

const ExerciseDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Exercise Detail</h2>
      <p>Exercise ID: {id}</p>
    </div>
  );
};

export default ExerciseDetail;
