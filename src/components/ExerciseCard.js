/** 
 * Imports the React library, providing core React functionality for component creation and rendering.
 */
import React from 'react';
import { Link } from 'react-router-dom';

const ExerciseCard = ({ exercise }) => {
  return (
    <Link to={`/exercise/${exercise.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        margin: '10px',
        width: '300px',
        textAlign: 'center',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
      }}>
        <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" style={{ width: '100%', borderRadius: '10px' }} />
        <h3 style={{ margin: '10px 0' }}>{exercise.name}</h3>
        <p>Body Part: {exercise.bodyPart}</p>
        <p>Equipment: {exercise.equipment}</p>
      </div>
    </Link>
  );
};

export default ExerciseCard;
