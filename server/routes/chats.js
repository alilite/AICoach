const express = require('express');
const { db } = require('../firebase'); // Firebase Firestore database
const verifyToken = require('../middlewares/verifyToken'); // Auth middleware

const router = express.Router();
const COHERE_API_KEY = process.env.COHERE_API_KEY; // Get Cohere API key from env

// POST / => Generate AI response and save chat
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.uid; // Get authenticated user ID
  const { input, history } = req.body;

  // Check if input and history are provided
  if (!input || !history) {
    return res.status(400).json({ error: 'Missing input or history' });
  }

  // Build the prompt for the AI
  const prompt = `${history}\nUser: ${input}\nAI:`;

  try {
    // Call Cohere API to generate AI response
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
        k: 0,
        stop_sequences: ['User:', 'AI:'],
      }),
    });

    const data = await response.json();
    const aiMessage = data.generations?.[0]?.text?.trim(); // Get the AI message

    if (!aiMessage) {
      return res.status(500).json({ error: 'No AI response received' });
    }

    // Save chat to Firestore
    await db.collection('chats').add({
      userId,
      userMessage: input,
      aiMessage,
      timestamp: new Date(),
    });

    res.status(200).json({ response: aiMessage }); // Return AI response
  } catch (err) {
    console.error('Cohere Error:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// GET / => Get chat history for authenticated user
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    // Get chats ordered by newest first
    const snapshot = await db
      .collection('chats')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); // Return empty if no chats
    }

    // Format chat data
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(), // Convert timestamp
    }));

    res.status(200).json(chats); // Return chat list
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

// DELETE /:chatId => Delete a specific chat
router.delete('/:chatId', verifyToken, async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.uid;

  try {
    const chatDoc = await db.collection('chats').doc(chatId).get();

    // Only allow deletion if the user owns the chat
    if (!chatDoc.exists || chatDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this chat' });
    }

    await db.collection('chats').doc(chatId).delete(); // Delete chat
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;
