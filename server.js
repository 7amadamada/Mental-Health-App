const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

// Add a check to verify the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not defined');
  console.error('Please create a .env file with your MongoDB connection string');
  process.exit(1);
}

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

    const moodSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  date: { type: Date, default: Date.now }
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
