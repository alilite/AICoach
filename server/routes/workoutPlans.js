const express = require('express');
const { db } = require('../firebase');
const router = express.Router();

const COHERE_API_KEY = process.env.COHERE_API_KEY;

router.post('/', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 1. Get user profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    // 2. Calculate age from dob safely
    let age = 'unknown';
    if (user.dob) {
      const year = new Date(user.dob).getFullYear(); // Extract year from dob
      const currentYear = new Date().getFullYear();
      if (!isNaN(year)) {
        age = currentYear - year;
      }
    }

    // 3. Build Cohere prompt
    const prompt = `
    Hi my name is ${user.firstName} ${user.lastName},
    Create me a detailed workout plan for me
    Here are some information regarding me:
    - Age: ${age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Fitness Goal: ${user.goal}

    The plan should include different workouts per day, rest days if needed, and brief instructions for each.`;


    // 4. Call Cohere
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

    //console.log('Prompt sent to Cohere:\n', prompt);
    //console.log('Cohere response status:', response.status);
    const data = await response.json();
    //console.log('Cohere response data:', data);

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

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const snapshot = await db
        .collection('workoutPlans')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
  
      if (snapshot.empty) {
        return res.status(404).json({ error: 'No workout plan found' });
      }
  
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
