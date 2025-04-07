import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExerciseDetail from './pages/ExerciseDetail';
import News from './pages/News';
import UserForm from './pages/UserForm';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';
import Profile from './pages/Profile';
import WorkoutPlans from './pages/WorkoutPlans';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import WorkoutCalendar from './pages/WorkoutCalendar';
import ProgressTracker from './pages/ProgressTracker';

// import PaymentSuccess from './pages/PaymentSuccess';
// import PaymentCancel from './pages/PaymentCancel';








const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/user" element={<UserForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat-history" element={<ChatHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/workout-plans" element={<WorkoutPlans />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/calendar" element={<WorkoutCalendar />} />
        <Route path="/progress" element={<ProgressTracker />} />

        {/* <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} /> */}













      </Routes>
    </div>
  );
};

export default App;
