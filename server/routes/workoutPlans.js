const express = require('express');
const { db } = require('../firebase');
const verifyToken = require('../middlewares/verifyToken'); // make sure this file exists
const router = express.Router();

const COHERE_API_KEY = process.env.COHERE_API_KEY;

// POST /api/workout-plans (Secure)
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.uid; // from token

  try {
    // 1. Get user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const user = userDoc.data();

    // 2. Calculate age
    let age = 'unknown';
    if (user.dob) {
      const year = new Date(user.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(year)) age = currentYear - year;
    }

    // 3. Build prompt
    const prompt = `
    Hi, my name is ${user.firstName} ${user.lastName}.
    Please create a detailed 7-day workout plan for me.

    Here is some information about me:
    - Age: ${age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Fitness Goal: ${user.goal}

    Each day should include:
    - The name of the workout or rest day
    - A brief explanation (1-2 lines) of what to do that day

   The plan should include different workouts per day, rest days if needed, and brief instructions for each.`;

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 600,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const workoutPlan = data.generations?.[0]?.text?.trim() || 'Could not generate plan.';

    // 5. Save to Firestore
    await db.collection('workoutPlans').add({
      userId,
      plan: workoutPlan,
      createdAt: new Date(),
    });

    res.status(201).json({ plan: workoutPlan });
  } catch (err) {
    console.error('Workout plan generation error:', err);
    res.status(500).json({ error: 'Failed to generate workout plan' });
  }
});

// GET /api/workout-plans (latest)
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const snapshot = await db
      .collection('workoutPlans')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) return res.status(404).json({ error: 'No workout plan found' });

    const doc = snapshot.docs[0];
    res.status(200).json({
      id: doc.id,
      plan: doc.data().plan,
      createdAt: doc.data().createdAt.toDate(),
    });
  } catch (err) {
    console.error('Failed to fetch workout plan:', err);
    res.status(500).json({ error: 'Failed to retrieve workout plan' });
  }
});

module.exports = router;
