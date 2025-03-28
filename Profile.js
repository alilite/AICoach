import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const [latestPlan, setLatestPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDietPlan = async () => {
      try {
        const q = query(collection(db, 'dietPlans'), orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setLatestPlan(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching diet plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestDietPlan();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>👤 User Profile</h2>

      {loading ? (
        <p>Loading profile...</p>
      ) : !latestPlan ? (
        <p>No profile data available yet. Generate a diet plan first!</p>
      ) : (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
          <p><strong>Name:</strong> {latestPlan.user.firstName} {latestPlan.user.lastName}</p>
          <p><strong>Age:</strong> {latestPlan.user.age || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {latestPlan.user.dob}</p>
          <p><strong>Height:</strong> {latestPlan.user.height} cm</p>
          <p><strong>Weight:</strong> {latestPlan.user.weight} kg</p>
          <p><strong>Fitness Goal:</strong> {latestPlan.user.goal}</p>
          <p><strong>Last Generated:</strong> {latestPlan.createdAt?.toDate().toLocaleString()}</p>
          
          <div style={{ marginTop: '20px' }}>
            <h3>🥗 Latest Diet Plan:</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{latestPlan.plan}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
