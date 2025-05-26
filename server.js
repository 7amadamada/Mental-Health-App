const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth');

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,x-auth-token'
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/radiant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.log('Continuing without database connection. Some features may not work.');
});

const inMemoryMoods = [];
const inMemoryFitness = [];
const inMemoryJournals = [];
const inMemoryUsers = [{
    id: 'default-user',
    name: 'Test User',
    email: 'test@example.com',
    settings: {
        notifications: true,
        darkMode: false
    }
}];

// Mood routes
const moodSchema = new mongoose.Schema({
    mood: { type: String, required: true },
    intensity: { type: Number, min: 1, max: 5, default: 3 },
    notes: { type: String },
    factors: [{ type: String }],
    date: { type: Date, default: Date.now }
});

const Mood = mongoose.model('Mood', moodSchema);

app.get('/api/moods', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const moods = await Mood.find();
            res.json(moods);
        } else {
            res.json(inMemoryMoods);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/moods', async (req, res) => {
    try {
        const { mood: moodValue, intensity, notes, factors } = req.body;
        if (!moodValue) {
            return res.status(400).json({ message: 'Mood is required' });
        }

        if (mongoose.connection.readyState === 1) {
            const newMood = new Mood({ 
                mood: moodValue,
                intensity,
                notes,
                factors
            });
            const savedMood = await newMood.save();
            res.status(201).json(savedMood);
        } else {
            const newMood = { 
                mood: moodValue,
                intensity,
                notes,
                factors,
                date: new Date(),
                _id: Date.now().toString()
            };
            inMemoryMoods.push(newMood);
            res.status(201).json(newMood);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/fitness', (req, res) => {
    res.json(inMemoryFitness);
});

app.post('/api/fitness', (req, res) => {
    const newActivity = {
        ...req.body,
        date: new Date(),
        _id: Date.now().toString()
    };
    inMemoryFitness.push(newActivity);
    res.status(201).json(newActivity);
});

app.get('/api/journals', (req, res) => {
    res.json(inMemoryJournals);
});

app.post('/api/journals', (req, res) => {
    const newEntry = {
        ...req.body,
        date: new Date(),
        _id: Date.now().toString()
    };
    inMemoryJournals.push(newEntry);
    res.status(201).json(newEntry);
});

app.get('/api/users/me', (req, res) => {
    res.json(inMemoryUsers[0]);
});

app.put('/api/users/me', (req, res) => {
    inMemoryUsers[0] = { ...inMemoryUsers[0], ...req.body };
    res.json(inMemoryUsers[0]);
});

app.get('/', (req, res) => {
    res.send('Radiant API is running');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server IP: ${require('os').networkInterfaces()['Wi-Fi']?.[0]?.address || '172.20.10.1'}`);
    console.log(`Try accessing at http://172.20.10.1:${PORT}/api/test`);
    });
