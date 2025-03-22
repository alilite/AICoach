import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import News from './pages/News';
import UserForm from './pages/UserForm';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/user" element={<UserForm />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />


      </Routes>
    </div>
  );
};

export default App;
