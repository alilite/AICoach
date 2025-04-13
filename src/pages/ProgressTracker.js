import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const ProgressTracker = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ date: '', weight: '', note: '' });
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Get user ID from Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch logs when user ID is available
  useEffect(() => {
    if (userId) fetchLogs();
  }, [userId]);

  // Fetch user's progress logs from backend
  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/progress/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
    }
  };

  // Normalize different timestamp formats to yyyy-mm-dd
  const normalizeDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000).toISOString().split('T')[0];
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toISOString().split('T')[0];
    const d = new Date(timestamp);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new or updated log
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, userId };
    const url = editingId
      ? `http://localhost:5000/api/progress/${editingId}`
      : 'http://localhost:5000/api/progress';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save log');
      setForm({ date: '', weight: '', note: '' });
      setEditingId(null);
      setError(null);
      fetchLogs();
    } catch (err) {
      console.error(err);
      setError('Failed to save log.');
    }
  };

  // Load selected log into form for editing
  const handleEdit = (log) => {
    setForm({
      date: normalizeDate(log.date),
      weight: log.weight,
      note: log.note,
    });
    setEditingId(log.id);
  };

  // Delete log from backend
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/progress/${id}`, {
        method: 'DELETE',
      });
      fetchLogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Prepare chart data
  const chartData = logs
    .map((log) => ({
      date: normalizeDate(log.date),
      weight: log.weight,
    }))
    .filter((entry) => entry.date && !isNaN(entry.weight));

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>📋 Progress Tracker</h2>

      {/* Progress form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}
      >
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" required />
        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Note (optional)" rows="2" />
        <button
          type="submit"
          style={{ backgroundColor: '#ff2625', color: 'white', padding: '10px', border: 'none', fontWeight: 'bold' }}
        >
          {editingId ? '✏️ Update Log' : '➕ Add Progress Log'}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <>
          <h3>📈 Weight Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#ff2625" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Logs Table */}
      {logs.length > 0 ? (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            marginTop: '40px'
          }}
        >
          <thead>
            <tr style={{ background: '#ff2625', color: 'white' }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Weight (kg)</th>
              <th style={thStyle}>Note</th>
              <th style={thStyle}>Submitted At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ textAlign: 'center' }}>
                <td style={tdStyle}>{normalizeDate(log.date)}</td>
                <td style={tdStyle}>{log.weight}</td>
                <td style={tdStyle}>{log.note || '-'}</td>
                <td style={tdStyle}>{normalizeDate(log.createdAt) || '-'}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(log)} style={{ marginRight: '8px', background: '#ffa726', color: 'white', border: 'none', padding: '5px 10px' }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(log.id)} style={{ background: '#e53935', color: 'white', border: 'none', padding: '5px 10px' }}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          No data yet. Submit progress to see your logs 📊
        </p>
      )}
    </div>
  );
};

// Table cell styles
const thStyle = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  fontSize: '14px',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #f0f0f0',
  fontSize: '13px',
};

export default ProgressTracker;
