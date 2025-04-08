const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const auth = admin.auth();

// LOGIN route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    // Admin SDK cannot sign in directly
    // So we use Firebase Client SDK logic on frontend
    return res
      .status(400)
      .json({ error: 'Login must be handled from frontend using Firebase SDK' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
