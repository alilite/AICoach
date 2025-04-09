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
    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    // Calculate age
    let age = 'unknown';
    if (user.dob) {
      const year = new Date(user.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(year)) {
        age = currentYear - year;
      }
    }

    // Build prompt for Cohere
    const prompt = `
    Hi, my name is ${user.firstName} ${user.lastName}.
    Create a 7-day personalized meal plan for me based on:
    - Age: ${age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Fitness Goal: ${user.goal}

    The meal plan should include 3 meals per day (breakfast, lunch, dinner), and be specific with portion size and nutrition if possible.
    `;

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const mealPlan = data.generations?.[0]?.text?.trim() || 'Could not generate meal plan.';

    // Save to Firestore
    await db.collection('mealPlans').add({
      userId,
      plan: mealPlan,
      createdAt: new Date(),
    });

    res.status(201).json({ plan: mealPlan });
  } catch (err) {
    console.error('Meal plan generation error:', err);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

// GET latest meal plan
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await db
      .collection('mealPlans')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No meal plan found' });
    }

    const doc = snapshot.docs[0];
    res.status(200).json({
      id: doc.id,
      plan: doc.data().plan,
      createdAt: doc.data().createdAt.toDate(),
    });
  } catch (err) {
    console.error('Failed to fetch meal plan:', err);
    res.status(500).json({ error: 'Failed to retrieve meal plan' });
  }
});

module.exports = router;
