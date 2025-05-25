const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User',
        required: true   
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        required: false,
        enum: ['happy', 'neutral', 'sad', 'angry', 'anxious', 'other']
    },
    tags: [{
        type: String,
    }],
    isPrivate: {
        type: Boolean,
        default: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

journalSchema.index({ user: 1, Date: -1 });
module.exports = mongoose.model('Journal', journalSchema);
