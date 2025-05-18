const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/radiant')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const moodSchema = new mongoose.Schema({

mood: { type: String,required: true},
date: { type: Date, default: Date.now}
});

const mood = mongoose.model('Mood', moodSchema);



app.get('/', (req, res) => {
    res.send('Radiant API is running');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
