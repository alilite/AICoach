const express = require('express');
const cors = require('cors');
//const stripeRoute = require('./routes/stripe');
const calendarRoute = require('./routes/calendar');
const progressRoute = require('./routes/progress');
const usersRoutes = require('./routes/users');
const workoutPlanRoutes = require('./routes/workoutPlans');

require('dotenv').config();

const app = express();
const db = require('./firebase');

app.use(cors());
app.use(express.json());
//app.use('/api/stripe', stripeRoute);
app.use('/api/calendar', calendarRoute);
app.use('/api/progress', progressRoute);
app.use('/api/users', usersRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('🔥 Express backend is running!');
});

// Test route
app.post('/api/test', (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello ${name}, your Express backend is working! 🚀` });
});

// Save Diet Plan to Firebase
app.post('/api/save-diet-plan', async (req, res) => {
  try {
    const { user, plan } = req.body;

    const docRef = await db.collection('dietPlans').add({
      user,
      plan,
      createdAt: new Date(),
    });

    res.status(200).json({ id: docRef.id });
  } catch (error) {
    console.error('Firebase Error:', error);
    res.status(500).json({ error: 'Failed to save diet plan' });
  }
});

//user-form
app.post('/api/save-user', async (req, res) => {
  try {
    const { firstName, lastName, dob, age, height, weight, goal } = req.body;

    const docRef = await db.collection('users').add({
      firstName,
      lastName,
      dob,
      age,
      height,
      weight,
      goal,
      createdAt: new Date(),
    });

    res.status(200).json({ id: docRef.id, message: 'User data saved successfully ✅' });
  } catch (error) {
    console.error('Save user error:', error);
    res.status(500).json({ error: 'Failed to save user info' });
  }
});


// //news-api
// app.get('/api/news', async (req, res) => {
//   const topic = req.query.topic || 'sports';

//   try {
//     const response = await fetch(
//       `https://newsapi.org/v2/everything?q=${topic}&language=en&sortBy=publishedAt&pageSize=10`,
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.NEWS_API_KEY}`
//         }
//       }
//     );

//     const data = await response.json();
//     res.json(data.articles || []);
//   } catch (error) {
//     console.error('News fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
