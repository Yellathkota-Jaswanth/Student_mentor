// server.js
const express = require('express');
const connectDB = require('./db/config');
const bodyParser = require('body-parser');

const mentorRoutes = require('./routes/mentorRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());

// Mount Routes
app.use('/api', mentorRoutes);
app.use('/api', studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
