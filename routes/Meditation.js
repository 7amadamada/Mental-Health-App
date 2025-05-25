const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    audioUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['stress', 'sleep', 'focus', 'anxiety', 'gratitude', 'other'],
    },
    imageUrl: {
        type:String,
    },
    popularity: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Meditation', MeditationSchema);
