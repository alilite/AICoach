import React, { useState } from 'react';
import { fetchData, exerciseOptions } from '../utils/fetchData';

const SearchExercises = ({ setExercises }) => {
  const [search, setSearch] = useState('');

  const handleSearch = async () => {
    if (search.trim()) {
      const data = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises',
        exerciseOptions
      );

      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.bodyPart.toLowerCase().includes(search.toLowerCase()) ||
          item.target.toLowerCase().includes(search.toLowerCase()) ||
          item.equipment.toLowerCase().includes(search.toLowerCase())
      );

      setExercises(filtered);
      setSearch('');
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '30px auto' }}>
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px 20px' }}>
        Search
      </button>
    </div>
  );
};

export default SearchExercises;
