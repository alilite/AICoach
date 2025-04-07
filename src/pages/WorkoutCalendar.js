import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const WorkoutCalendar = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ id: null, date: '', workout: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);

  const userId = 'demoUser1';

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/${userId}`);
      const data = await res.json();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setWorkouts([]);
    }
  };

  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  };

  const selectedDateString = selectedDate.toISOString().split('T')[0];

  const filteredWorkouts = workouts.filter(
    (w) => normalizeDate(w.date) === selectedDateString
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = form.date || selectedDateString;

    if (editingId) {
      // Editing an entry
      await fetch(`http://localhost:5000/api/calendar/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, userId }),
      });
      setEditingId(null);
    } else {
      // Adding a new entry
      await fetch('http://localhost:5000/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, userId }),
      });
    }

    setForm({ id: null, date: '', workout: '', notes: '' });
    fetchWorkouts();
  };

  const handleEdit = (workout) => {
    setEditingId(workout.id);
    setForm({ ...workout });
    setSelectedDate(new Date(workout.date));
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/calendar/${id}`, {
      method: 'DELETE',
    });
    fetchWorkouts();
  };

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
      <h2>📅 Workout Calendar</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <form
        onSubmit={handleSubmit}
        style={{ marginTop: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <input
          type="text"
          name="workout"
          placeholder="Workout type"
          value={form.workout}
          onChange={handleChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Notes..."
          value={form.notes}
          onChange={handleChange}
          rows={3}
        />
        <button type="submit" style={{ backgroundColor: '#ff2625', color: 'white', padding: '10px', border: 'none' }}>
          {editingId ? '✏️ Update Workout' : `➕ Add Workout for ${selectedDate.toDateString()}`}
        </button>
      </form>

      <h3>🗓️ Workouts on {selectedDate.toDateString()}:</h3>
      {filteredWorkouts.length === 0 ? (
        <p>No workouts scheduled for this day.</p>
      ) : (
        filteredWorkouts.map((w) => (
          <div
            key={w.id}
            style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}
          >
            <strong>{normalizeDate(w.date)}</strong>
            <h4>{w.workout}</h4>
            <p>{w.notes}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEdit(w)} style={{ background: '#ffa726', color: 'white', padding: '5px 10px', border: 'none' }}>
                ✏️ Edit
              </button>
              <button onClick={() => handleDelete(w.id)} style={{ background: '#e53935', color: 'white', padding: '5px 10px', border: 'none' }}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutCalendar;
