import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getChatHistory, sendMessageToAI, deleteChatById } from '../utils/api';
import TypingIndicator from '../components/TypingIndicator';

const Chat = () => {
  const AI_NAME = 'Athena';
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hello! I'm ${AI_NAME}, your fitness assistant. How can I help you today?` }
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const t = await user.getIdToken();
        setToken(t);
      } else {
        setUserId(null);
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) {
      getChatHistory(token)
        .then((chats) => setChatHistory(chats))
        .catch((err) => console.error('Chat history error:', err));
    }
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setMessages((prev) => [...prev, { sender: 'ai', text: '...' }]);

    const historyText = messages
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`)
      .join('\n');

    try {
      const aiReply = await sendMessageToAI(token, input, historyText);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'ai', text: aiReply }
      ]);
      setChatHistory((prev) => [
        { id: Date.now(), userMessage: input, aiMessage: aiReply, timestamp: new Date() },
        ...prev
      ]);
    } catch (err) {
      console.error('AI response error:', err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'ai', text: 'Something went wrong. Please try again.' }
      ]);
    }

    setLoading(false);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChatById(token, chatId);
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (err) {
      console.error('Delete chat error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>💬 Chat with {AI_NAME}</h2>

      {/* Live Chat Box */}
      <div style={{ height: '400px', overflowY: 'auto', background: '#f5f5f5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '12px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You' : AI_NAME}:</strong>{' '}
            {msg.text === '...' ? <TypingIndicator /> : msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 15px', backgroundColor: '#ff2625', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          Send
        </button>
      </form>

      {/* Toggle Chat History */}
      <button
        onClick={() => setShowHistory((prev) => !prev)}
        style={{
          marginTop: '30px',
          padding: '8px 12px',
          backgroundColor: '#e0e0e0',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {showHistory ? 'Hide Chat History' : 'Show Chat History'}
      </button>

      {/* Chat History */}
      {showHistory && (
        <div style={{ marginTop: '20px' }}>
          <h3>📜 Chat History</h3>
          {chatHistory.length === 0 ? (
            <p style={{ color: '#888' }}>No chat history available.</p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  background: '#f0f0f0',
                  borderRadius: '8px',
                  position: 'relative'
                }}
              >
                <p><strong>You:</strong> {chat.userMessage}</p>
                <p><strong>{AI_NAME}:</strong> {chat.aiMessage}</p>
                <p style={{ fontSize: '12px', color: '#777' }}>{new Date(chat.timestamp).toLocaleString()}</p>
                <button
                  onClick={() => handleDeleteChat(chat.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: '#ff2625',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
