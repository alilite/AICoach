# 🧠 AI Coach – Your Smart Fitness Companion

**AI Coach** is a modern, AI-powered fitness web app that provides users with personalized exercise routines, diet plans, workout tracking, progress analytics, and real-time fitness news — all in one place.

---

## 📁 Project Structure

```bash
AICoach/
├── public/                      # Public assets
├── src/                         # Frontend code (React)
│   ├── components/              # Reusable UI elements (Navbar, Cards, etc.)
│   ├── pages/                   # App pages
│   │   ├── Home.js
│   │   ├── ExerciseDetail.js
│   │   ├── UserForm.js
│   │   ├── Chat.js
│   │   ├── ChatHistory.js
│   │   ├── Profile.js
│   │   ├── News.js
│   │   ├── ContactUs.js
│   │   └── WorkoutPlans.js
│   ├── utils/                   # API helpers and AI logic
│   │   ├── fetchData.js
│   │   └── cohere.js
│   ├── styles/                  # Styling files
│   ├── App.js                   # App root component
│   └── firebase.js              # Firebase client config
├── server/                      # Backend (Node.js + Express)
│   ├── index.js                 # Main server file
│   ├── firebase.js              # Firebase Admin SDK config
│   └── routes/                  # Express routes
│       ├── stripe.js
│       └── workouts.js
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md

---

## 🔧 Features

- 🏋️‍♀️ **Browse 1300+ Exercises** using RapidAPI
- 🎯 **Filter by Body Part, Target Muscle, or Equipment**
- 🍽️ **AI-Powered Diet Plans** via Cohere API
- 🗓️ **Workout Calendar** with Add/Edit/Delete
- 📈 **Weight Progress Tracker** using Chart.js
- 🧠 **AI Chat & Coaching** *(Coming soon!)*
- 📰 **Live Fitness News** from NewsAPI
- 📩 **Contact Support** via EmailJS
- 🔐 **Firebase** for database storage

---

## 🚀 Technologies Used

### Frontend
- React
- React Router
- Firebase (Web SDK)
- Chart.js
- EmailJS
- Cohere AI

### Backend
- Node.js + Express
- Firebase Admin SDK

---

## 📁 Project Setup

### Install Dependencies

```bash
npm install

##Front-end start
npm start

##Back-end start
node index.js


Contributors
This app was developed by:

Ali

Erfan

Mohammad

 Adril

George
