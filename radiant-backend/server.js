const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
