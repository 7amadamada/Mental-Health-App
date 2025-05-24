const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    activityType: {
        type: String,
        required: true,
        enum: ['walking', 'running', 'cycling', 'swimming', 'yoga', 'strength', 'other']
    },
    duration: {
        type: Number, 
        required: true
    },
    distance: {
        type: Number, 
        required: false
    },
    caloriesBurned: {
        type: Number, 
        required: false
    },
    steps: {
        type: Number, 
        required: false
    },
    heartRate: {
        average: Number,
        max: Number
    },
    notes: {
        type: String,
        required: false
    }

    }, {timestamps: true});

fitnessSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Fitness', fitnessSchema);