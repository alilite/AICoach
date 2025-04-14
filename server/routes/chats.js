const express = require('express');
const { db } = require('../firebase');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

const COHERE_API_KEY = process.env.COHERE_API_KEY;

router.post('/', verifyToken, async (req, res) => {
  console.log('Chat endpoint hit');
  console.log('Using Cohere API key:', COHERE_API_KEY);

  const userId = req.user.uid;
  const { input, history } = req.body;

  if (!input || !history) {
    return res.status(400).json({ error: 'Missing input or history' });
  }

  const prompt = `${history}\nUser: ${input}\nAI:`;

  try {
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
    const aiMessage = data.generations?.[0]?.text?.trim();

    if (!aiMessage) {
      return res.status(500).json({ error: 'No AI response received' });
    }

    await db.collection('chats').add({
      userId,
      userMessage: input,
      aiMessage,
      timestamp: new Date(),
    });

    res.status(200).json({ response: aiMessage });
  } catch (err) {
    console.error('Cohere Error:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db
      .collection('chats')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    }));

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

router.delete('/:chatId', verifyToken, async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.uid;

  try {
    const chatDoc = await db.collection('chats').doc(chatId).get();

    if (!chatDoc.exists || chatDoc.data().userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this chat' });
    }

    await db.collection('chats').doc(chatId).delete();
    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;
