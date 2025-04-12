import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const WorkoutCalendar = () => {
  const [userId, setUserId] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ workout: '', notes: '' });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingId, setEditingId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [onlyThisWeek, setOnlyThisWeek] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) fetchWorkouts();
  }, [userId]);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/${userId}`);
      const data = await res.json();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const normalizeDate = (dateInput) => {
    try {
      if (!dateInput) return null;
      if (typeof dateInput.toDate === 'function') {
        return dateInput.toDate().toISOString().split('T')[0];
      }
      if (typeof dateInput === 'object' && '_seconds' in dateInput) {
        return new Date(dateInput._seconds * 1000).toISOString().split('T')[0];
      }
      const d = new Date(dateInput);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    } catch {
      return null;
    }
  };

  const isWithinThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays >= 0;
  };

  const selectedDateStr = normalizeDate(selectedDate);

  const filteredWorkouts = workouts.filter((w) => {
    const workoutDate = normalizeDate(w.date);
    if (!workoutDate) return false;

    const matchesType = filterType === 'all' || w.workout.toLowerCase() === filterType;
    const matchesWeek = !onlyThisWeek || isWithinThisWeek(workoutDate);

    return matchesType && matchesWeek && workoutDate === selectedDateStr;
  });

  const globalFiltered = workouts.filter((w) => {
    const workoutDate = normalizeDate(w.date);
    if (!workoutDate) return false;
    const matchesType = filterType === 'all' || w.workout.toLowerCase() === filterType;
    const matchesWeek = !onlyThisWeek || isWithinThisWeek(workoutDate);
    return matchesType && matchesWeek;
  });

  const workoutTypes = [...new Set(workouts.map(w => w.workout?.toLowerCase()).filter(Boolean))];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      date: selectedDateStr,
      userId,
    };

    const endpoint = editingId
      ? `http://localhost:5000/api/calendar/${editingId}`
      : 'http://localhost:5000/api/calendar';

    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      fetchWorkouts();
      setForm({ workout: '', notes: '' });
      setEditingId(null);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (entry) => {
    const date = entry.date?._seconds
      ? new Date(entry.date._seconds * 1000)
      : new Date(entry.date);
    setEditingId(entry.id);
    setForm({ workout: entry.workout, notes: entry.notes });
    setSelectedDate(date);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/calendar/${id}`, {
        method: 'DELETE',
      });
      fetchWorkouts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const chartData = Object.entries(
    globalFiltered.reduce((acc, curr) => {
      const day = normalizeDate(curr.date);
      if (!day) return acc;
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {})
  ).map(([date, count]) => ({ date, count }));

  const historyDates = [...new Set(globalFiltered.map(w => normalizeDate(w.date)).filter(d => d))];

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>📅 Workout Calendar</h2>

      <Calendar onChange={setSelectedDate} value={selectedDate} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
        <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
          <option value="all">All Types</option>
          {workoutTypes.map((type, i) => (
            <option key={i} value={type}>{type}</option>
          ))}
        </select>
        <label>
          <input type="checkbox" checked={onlyThisWeek} onChange={() => setOnlyThisWeek(prev => !prev)} /> This Week Only
        </label>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}
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
        <button
          type="button"
          onClick={() => setShowHistory(true)}
          style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px', border: 'none' }}
        >
          📖 View Workout History
        </button>
      </form>

      <h3>📊 Workout Frequency Chart:</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#ff2625" />
        </BarChart>
      </ResponsiveContainer>

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

      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white', padding: '30px', borderRadius: '10px', width: '300px', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <h3>🕓 Workout History</h3>
            <ul>
              {historyDates.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <button
              onClick={() => setShowHistory(false)}
              style={{ marginTop: '20px', background: '#ff2625', color: 'white', border: 'none', padding: '10px', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCalendar;


// import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { auth } from '../firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
// } from 'recharts';

// const WorkoutCalendar = () => {
//   const [userId, setUserId] = useState(null);
//   const [workouts, setWorkouts] = useState([]);
//   const [form, setForm] = useState({ workout: '', notes: '' });
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [editingId, setEditingId] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) setUserId(user.uid);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (userId) fetchWorkouts();
//   }, [userId]);

//   const fetchWorkouts = async () => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/calendar/${userId}`);
//       const data = await res.json();
//       setWorkouts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Fetch error:', error);
//     }
//   };

//   const normalizeDate = (dateInput) => {
//     try {
//       if (!dateInput) return null;

//       if (typeof dateInput.toDate === 'function') {
//         return dateInput.toDate().toISOString().split('T')[0];
//       }

//       if (typeof dateInput === 'object' && '_seconds' in dateInput) {
//         return new Date(dateInput._seconds * 1000).toISOString().split('T')[0];
//       }

//       const d = new Date(dateInput);
//       return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
//     } catch {
//       return null;
//     }
//   };

//   const selectedDateStr = normalizeDate(selectedDate);

//   const filteredWorkouts = workouts.filter((w) => {
//     const d = normalizeDate(w.date);
//     return d && d === selectedDateStr;
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...form,
//       date: selectedDateStr,
//       userId,
//     };

//     const endpoint = editingId
//       ? `http://localhost:5000/api/calendar/${editingId}`
//       : 'http://localhost:5000/api/calendar';

//     const method = editingId ? 'PUT' : 'POST';

//     try {
//       await fetch(endpoint, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       fetchWorkouts();
//       setForm({ workout: '', notes: '' });
//       setEditingId(null);
//     } catch (err) {
//       console.error('Submit error:', err);
//     }
//   };

//   const handleEdit = (entry) => {
//     const date = entry.date?._seconds
//       ? new Date(entry.date._seconds * 1000)
//       : new Date(entry.date);

//     setEditingId(entry.id);
//     setForm({ workout: entry.workout, notes: entry.notes });
//     setSelectedDate(date);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/calendar/${id}`, {
//         method: 'DELETE',
//       });
//       fetchWorkouts();
//     } catch (err) {
//       console.error('Delete error:', err);
//     }
//   };

//   const chartData = Object.entries(
//     workouts.reduce((acc, curr) => {
//       const day = normalizeDate(curr.date);
//       if (!day) return acc;
//       acc[day] = (acc[day] || 0) + 1;
//       return acc;
//     }, {})
//   ).map(([date, count]) => ({ date, count }));

//   const historyDates = [...new Set(
//     workouts.map(w => normalizeDate(w.date)).filter(d => d)
//   )];

//   return (
//     <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
//       <h2>📅 Workout Calendar</h2>

//       <Calendar onChange={setSelectedDate} value={selectedDate} />

//       <form
//         onSubmit={handleSubmit}
//         style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
//       >
//         <input
//           type="text"
//           name="workout"
//           placeholder="Workout type"
//           value={form.workout}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="notes"
//           placeholder="Notes..."
//           value={form.notes}
//           onChange={handleChange}
//           rows={3}
//         />
//         <button
//           type="submit"
//           style={{ backgroundColor: '#ff2625', color: 'white', padding: '10px', border: 'none' }}
//         >
//           {editingId ? '✏️ Update Workout' : `➕ Add Workout for ${selectedDate.toDateString()}`}
//         </button>

//         <button
//           type="button"
//           onClick={() => setShowHistory(true)}
//           style={{ marginTop: '10px', backgroundColor: '#1976d2', color: 'white', padding: '10px', border: 'none' }}
//         >
//           📖 View Workout History
//         </button>
//       </form>

//       <h3>📊 Workout Frequency Chart:</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Bar dataKey="count" fill="#ff2625" />
//         </BarChart>
//       </ResponsiveContainer>

//       <h3>🗓️ Workouts on {selectedDate.toDateString()}:</h3>
//       {filteredWorkouts.length === 0 ? (
//         <p>No workouts scheduled for this day.</p>
//       ) : (
//         filteredWorkouts.map((w) => (
//           <div
//             key={w.id}
//             style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}
//           >
//             <strong>{normalizeDate(w.date)}</strong>
//             <h4>{w.workout}</h4>
//             <p>{w.notes}</p>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button onClick={() => handleEdit(w)} style={{ background: '#ffa726', color: 'white', padding: '5px 10px', border: 'none' }}>
//                 ✏️ Edit
//               </button>
//               <button onClick={() => handleDelete(w.id)} style={{ background: '#e53935', color: 'white', padding: '5px 10px', border: 'none' }}>
//                 🗑️ Delete
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       {/* 🧾 Modal Popup */}
//       {showHistory && (
//         <div
//           onClick={() => setShowHistory(false)}
//           style={{
//             position: 'fixed',
//             top: 0, left: 0,
//             width: '100%', height: '100%',
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 999
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               background: 'white',
//               padding: '30px',
//               borderRadius: '10px',
//               width: '300px',
//               maxHeight: '80vh',
//               overflowY: 'auto',
//               boxShadow: '0 0 15px rgba(0,0,0,0.2)',
//             }}
//           >
//             <h3>🕓 Workout History</h3>
//             <ul style={{ paddingLeft: '20px' }}>
//               {historyDates.map((d, i) => (
//                 <li key={i}>{d}</li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setShowHistory(false)}
//               style={{ marginTop: '20px', background: '#ff2625', color: 'white', border: 'none', padding: '10px', width: '100%' }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WorkoutCalendar;
