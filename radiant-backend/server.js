const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const meditationRoutes = require('./routes/meditation');
const moodRoutes = require('./routes/mood');
const fitnessRoutes = require('./routes/fitness');
const journalRoutes = require('./routes/journal');
const professionalRoutes = require('./routes/professional');

const App = express();

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/professional', professionalRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/radiant')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const moodSchema = new mongoose.Schema({

mood: { type: String,required: true},
date: { type: Date, default: Date.now}
});

const mood = mongoose.model('Mood', moodSchema);

app.get('/api/moods', async (req, res) => {
    try {
        const moods = await mood.find();
        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Radiant API is running');
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
