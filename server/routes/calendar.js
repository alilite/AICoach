const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Helper: Normalize incoming data
const sanitizeWorkoutEntry = ({ userId, date, workout, notes }) => ({
  userId,
  date: new Date(date),
  workout: workout?.trim(),
  notes: notes?.trim() || '',
  updatedAt: new Date()
});

// =============================
// POST /api/calendar
// Create new workout entry
// =============================
router.post('/', async (req, res) => {
  try {
    const { userId, date, workout } = req.body;

    if (!userId || !date || !workout) {
      return res.status(400).json({ error: 'Missing required fields: userId, date, workout' });
    }

    const entry = {
      ...sanitizeWorkoutEntry(req.body),
      createdAt: new Date(),
    };

    const docRef = await db.collection('workoutCalendar').add(entry);
    res.status(200).json({ id: docRef.id, message: 'Workout saved ✅' });
  } catch (error) {
    console.error('Workout save error:', error);
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

// =============================
// GET /api/calendar/:userId
// Fetch all workouts for a user
// =============================
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId in request URL' });
    }

    const snapshot = await db
      .collection('workoutCalendar')
      .where('userId', '==', userId)
      .orderBy('date', 'asc')
      .get();

    const workouts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Workout fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// =============================
// PUT /api/calendar/:id
// Update workout entry
// =============================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, workout } = req.body;

    if (!id || !userId || !date || !workout) {
      return res.status(400).json({ error: 'Missing required fields for update' });
    }

    await db.collection('workoutCalendar').doc(id).update(sanitizeWorkoutEntry(req.body));
    res.status(200).json({ message: 'Workout updated ✅' });
  } catch (error) {
    console.error('Workout update error:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// =============================
// DELETE /api/calendar/:id
// Delete workout entry
// =============================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('workoutCalendar').doc(id).delete();
    res.status(200).json({ message: 'Workout deleted ✅' });
  } catch (error) {
    console.error('Workout delete error:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

module.exports = router;
