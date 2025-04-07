import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your fitness assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const conversation = messages
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n') + `\nUser: ${input}\nAI:`;

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: conversation,
          max_tokens: 150,
          temperature: 0.7,
          k: 0,
          stop_sequences: ['User:', 'AI:'],
          return_likelihoods: 'NONE',
        }),
      });

      const data = await response.json();
      const aiMessage = data.generations?.[0]?.text?.trim() || "Sorry, I didn't understand that.";

      const aiResponse = { sender: 'ai', text: aiMessage };
      setMessages((prev) => [...prev, aiResponse]);

      // firebase 
      await addDoc(collection(db, 'chats'), {
        user: input,
        ai: aiMessage,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Cohere error:', error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Something went wrong. Please try again.' }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>💬 AI Chat Assistant</h2>
      <div style={{ height: '400px', overflowY: 'auto', background: '#f5f5f5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '12px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#ff2625', color: '#fff', border: 'none', borderRadius: '5px' }}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
