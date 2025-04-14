import React, { useState } from 'react';
import { fetchData, exerciseOptions } from '../utils/fetchData'; // Utility functions to fetch data from API

// This component provides a search bar to find exercises
const SearchExercises = ({ setExercises }) => {
  const [search, setSearch] = useState(''); // State to hold the current search input

  // Function triggered when the user clicks the Search button
  const handleSearch = async () => {
    if (search.trim()) {
      // Fetch all exercises from the API
      const data = await fetchData(
        'https://exercisedb.p.rapidapi.com/exercises',
        exerciseOptions
      );

      // Filter exercises based on the search query (name, body part, target muscle, or equipment)
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.bodyPart.toLowerCase().includes(search.toLowerCase()) ||
          item.target.toLowerCase().includes(search.toLowerCase()) ||
          item.equipment.toLowerCase().includes(search.toLowerCase())
      );

      setExercises(filtered); // Update parent component with the filtered results
      setSearch(''); // Clear the input field
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '30px auto' }}>
      {/* Input field for user to type search term */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Update state as user types
        style={{ padding: '10px', width: '300px', marginRight: '10px' }}
      />

      {/* Button to trigger search */}
      <button onClick={handleSearch} style={{ padding: '10px 20px' }}>
        Search
      </button>
    </div>
  );
};

export default SearchExercises;

