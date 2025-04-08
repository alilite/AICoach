const express = require('express');
const { db, auth } = require('../firebase');
const { validationResult } = require('express-validator');
const { userValidationRules } = require('../validators/userValidator');

const router = express.Router();

// CREATE user
router.post('/', userValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  
    const { email, password, ...profileData } = req.body;
  
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
      });
  
      // Save additional profile data in Firestore
      await db.collection('users').doc(userRecord.uid).set(profileData);
  
      res.status(201).json({
        id: userRecord.uid,
        email: userRecord.email,
        ...profileData,
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: err.message || 'Failed to register user' });
    }
  });
  
  // UPDATE user
  router.put('/:id', userValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  
    try {
      await db.collection('users').doc(req.params.id).update(req.body);
      res.json({ id: req.params.id, ...req.body });
    } catch (err) {
      console.error('User update error:', err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

// READ user
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).delete();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
