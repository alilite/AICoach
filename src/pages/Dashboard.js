import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';

const Dashboard = () => {
  const [diet, setDiet] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dietSnap = await getDocs(query(collection(db, 'dietPlans'), orderBy('createdAt', 'desc'), limit(1)));
        const workoutSnap = await getDocs(query(collection(db, 'workoutPlans'), orderBy('createdAt', 'desc'), limit(1)));
        const chatSnap = await getDocs(query(collection(db, 'chats'), orderBy('timestamp', 'desc'), limit(1)));

        if (!dietSnap.empty) setDiet(dietSnap.docs[0].data());
        if (!workoutSnap.empty) setWorkout(workoutSnap.docs[0].data());
        if (!chatSnap.empty) setChat(chatSnap.docs[0].data());
      } catch (error) {
        console.error('Dashboard error:', error);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const Card = ({ title, content, timestamp }) => (
    <div style={{ background: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '8px' }}>{title}</h3>
      <p style={{ whiteSpace: 'pre-line', fontSize: '14px' }}>{content || 'No data available yet.'}</p>
      {timestamp && (
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          ⏱ Last updated: {new Date(timestamp?.toDate()).toLocaleString()}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h2>📊 Dashboard</h2>
      {loading ? (
        <p>Loading your insights...</p>
      ) : (
        <>
          <Card
            title="🥗 Latest Diet Plan"
            content={diet?.plan}
            timestamp={diet?.createdAt}
          />
          <Card
            title="🏋️ Most Recent Workout Plan"
            content={workout?.plan}
            timestamp={workout?.createdAt}
          />
          <Card
            title="💬 Last Chat Message"
            content={`You: ${chat?.user}\nAI: ${chat?.ai}`}
            timestamp={chat?.timestamp}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
