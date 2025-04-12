const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// =========================
// POST /api/progress
// Save a new progress log
// =========================
router.post('/', async (req, res) => {
  try {
    const { userId, date, weight, note } = req.body;

    if (!userId || !date || weight === undefined) {
      return res.status(400).json({ error: 'Missing required fields: userId, date, weight' });
    }

    const progressData = {
      userId,
      date: new Date(date),
      weight: parseFloat(weight),
      note: note?.trim() || '',
      createdAt: new Date(),
    };

    const docRef = await db.collection('progressLogs').add(progressData);

    res.status(200).json({
      id: docRef.id,
      message: 'Progress saved successfully ✅',
    });
  } catch (error) {
    console.error('Progress save error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// ==============================
// GET /api/progress/:userId
// Fetch all logs for a user
// ==============================
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request URL' });
  }

  try {
    const snapshot = await db
      .collection('progressLogs')
      .where('userId', '==', userId)
      // .orderBy('date', 'asc') // Uncomment once index exists
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(logs);
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress logs' });
  }
});

// =========================
// PUT /api/progress/:id
// Update a progress log
// =========================
router.put('/:id', async (req, res) => {
  const docId = req.params.id;
  const { date, weight, note, userId } = req.body;

  if (!docId || !date || weight === undefined || !userId) {
    return res.status(400).json({ error: 'Missing required fields for update' });
  }

  try {
    await db.collection('progressLogs').doc(docId).update({
      userId,
      date: new Date(date),
      weight: parseFloat(weight),
      note: note?.trim() || '',
      updatedAt: new Date(),
    });

    res.status(200).json({ message: 'Progress log updated ✅' });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress log' });
  }
});

// =========================
// DELETE /api/progress/:id
// Delete a progress log
// =========================
// =========================
// DELETE /api/progress/:id
// =========================
router.delete('/:id', async (req, res) => {
  const docId = req.params.id;

  if (!docId) {
    return res.status(400).json({ error: 'Missing document ID' });
  }

  try {
    await db.collection('progressLogs').doc(docId).delete();
    res.status(200).json({ message: 'Progress log deleted ✅' });
  } catch (error) {
    console.error('Progress delete error:', error);
    res.status(500).json({ error: 'Failed to delete progress log' });
  }
});


module.exports = router;
