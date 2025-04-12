const express = require('express');
const { db } = require('../firebase'); // Firebase database
const verifyToken = require('../middlewares/verifyToken'); // Middleware to check if user is logged in
const router = express.Router();

// Get your Cohere API key from environment variables
const COHERE_API_KEY = process.env.COHERE_API_KEY;

/**
 * POST / => Generate a 7-day personalized meal plan for the authenticated user
 */
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.uid; // Get the user ID from the token

  try {
    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const user = userDoc.data(); // Extract user details
    let age = 'unknown';

    // Calculate age if date of birth is available
    if (user.dob) {
      const year = new Date(user.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(year)) age = currentYear - year;
    }

    // Create a prompt for the Cohere AI to generate a meal plan
    const prompt = `
    Hi, my name is ${user.firstName} ${user.lastName}.
    Create a 7-day personalized meal plan for me based on:
    - Age: ${age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Fitness Goal: ${user.goal}

    The meal plan should include 3 meals per day (breakfast, lunch, dinner), and be specific with portion size and nutrition if possible.
    `;

    // Send the request to Cohere's API
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt,
        max_tokens: 700, // Max number of tokens (words/chars) in response
        temperature: 0.7, // Randomness in the output
      }),
    });

    // Read the response from Cohere
    const data = await response.json();
    const mealPlan = data.generations?.[0]?.text?.trim() || 'Could not generate meal plan.';

    // Save the meal plan to the database
    await db.collection('mealPlans').add({
      userId,
      plan: mealPlan,
      createdAt: new Date(),
    });

    // Return the meal plan to the client
    res.status(201).json({ plan: mealPlan });
  } catch (err) {
    console.error('Meal plan generation error:', err);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});

/**
 * GET / => Fetch the latest meal plan for the authenticated user
 */
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    // Find the most recent meal plan created by this user
    const snapshot = await db
      .collection('mealPlans')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc') // newest first
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'No meal plan found' });
    }

    // Extract and return the meal plan data
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

// Export this router so it can be used in your main server file
module.exports = router;
