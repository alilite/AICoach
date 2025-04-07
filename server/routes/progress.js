const express = require('express');
const router = express.Router();
const db = require('../firebase');

// POST: Save progress log
router.post('/', async (req, res) => {
  try {
    const { userId, date, weight, note } = req.body;

    const docRef = await db.collection('progressLogs').add({
      userId,
      date,
      weight: parseFloat(weight),
      note: note || '',
      createdAt: new Date(),
    });

    res.status(200).json({ id: docRef.id, message: 'Progress saved ✅' });
  } catch (error) {
    console.error('Progress save error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// GET: Fetch logs by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db
      .collection('progressLogs')
      .where('userId', '==', userId)
      .orderBy('date', 'asc')
      .get();

    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(logs);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress logs' });
  }
});

module.exports = router;
