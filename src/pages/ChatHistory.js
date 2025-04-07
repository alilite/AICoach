import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const q = query(collection(db, 'chats'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const chatData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
      setLoading(false);
    };

    fetchChats();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>📜 Chat History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p>No chat history found.</p>
      ) : (
        chats.map((chat, index) => (
          <div key={chat.id || index} style={{ background: '#f1f1f1', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
            <p><strong>You:</strong> {chat.user}</p>
            <p><strong>AI:</strong> {chat.ai}</p>
            <p style={{ fontSize: '12px', color: '#777' }}>{new Date(chat.timestamp?.toDate()).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
