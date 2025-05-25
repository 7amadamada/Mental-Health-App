const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true,
        enum: ['happy', 'neutral', 'sad', 'angry', 'anxious', 'other']
    },
    intensity: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    notes: {
        type: String,
        required: false
    },
    factor: {
        type: String,
        required: false,
        enum: ['work', 'relationships', 'health', 'finance', 'other']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

MoodSchema.index({ user: 1, date: -1 });

const Mood = mongoose.models.Mood || mongoose.model('Mood', MoodSchema);

router.get('/', async (req, res) => {
    try {
        const moods = await Mood.find();
        res.json(moods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
