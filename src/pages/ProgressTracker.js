import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const ProgressTracker = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    date: '',
    weight: '',
    note: '',
  });

  const userId = 'demoUser1';

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/progress/${userId}`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, userId }),
    });
    setForm({ date: '', weight: '', note: '' });
    fetchLogs();
  };

  const chartData = {
    labels: logs.map((log) =>
      log.date ? new Date(log.date).toLocaleDateString() : 'Unknown Date'
    ),
    datasets: [
      {
        label: 'Weight Progress (kg)',
        data: logs.map((log) => Number(log.weight || 0)),
        fill: false,
        borderColor: '#ff2625',
        backgroundColor: 'rgba(255, 38, 37, 0.2)',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>📈 Progress Tracker</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" required />
        <textarea name="note" value={form.note} onChange={handleChange} placeholder="Note (optional)" rows="2" />
        <button type="submit" style={{ backgroundColor: '#ff2625', color: 'white', padding: '10px', border: 'none' }}>
          ➕ Add Progress Log
        </button>
      </form>

      <div style={{ background: '#fff', borderRadius: '10px', padding: '20px' }}>
        {logs.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p style={{ textAlign: 'center' }}>No data yet. Submit progress to see your chart 📊</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
