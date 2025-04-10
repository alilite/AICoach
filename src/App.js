import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import News from './pages/News';
import Register from './pages/Register';
import Exercises from './pages/Exercises';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import Packages from './pages/Packages';
import WorkoutCalendar from './pages/WorkoutCalendar';
import ProgressTracker from './pages/ProgressTracker';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
        <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat-history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
        <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><WorkoutCalendar /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressTracker /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
