const express = require('express');
const router = express.Router();
const db = require('../firebase');

//POST: Save workout
router.post('/', async (req, res) => {
  try {
    const { userId, date, workout, notes } = req.body;

    const newEntry = {
      userId,
      date,
      workout,
      notes,
      createdAt: new Date(),
    };

    const docRef = await db.collection('workoutCalendar').add(newEntry);
    res.status(200).json({ id: docRef.id, message: 'Workout saved ✅' });
  } catch (error) {
    console.error('Workout calendar error:', error);
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

//GET: Fetch all for a user
router.get('/:userId', async (req, res) => {
  try {
    const snapshot = await db
      .collection('workoutCalendar')
      .where('userId', '==', req.params.userId)
      .orderBy('date')
      .get();

    const workouts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(workouts);
  } catch (error) {
    console.error('Fetch workout calendar error:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});
// PUT: Update workout
router.put('/:id', async (req, res) => {
    try {
      const docId = req.params.id;
      const updateData = req.body;
  
      await db.collection('workoutCalendar').doc(docId).update({
        ...updateData,
        updatedAt: new Date(),
      });
  
      res.status(200).json({ message: 'Workout updated ✅' });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Failed to update workout' });
    }
  });
  
  // DELETE: Remove workout
  router.delete('/:id', async (req, res) => {
    try {
      const docId = req.params.id;
      await db.collection('workoutCalendar').doc(docId).delete();
      res.status(200).json({ message: 'Workout deleted ✅' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete workout' });
    }
  });
  
module.exports = router;
