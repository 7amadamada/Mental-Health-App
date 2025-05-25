const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAnonymous: {
        type: Boolean,
        default: false 
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
    },
    theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark', 'system']
    },
    privacyLevel: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private'
    }
},
healthData: {
    height: Number,
    weight: Number,
    age: Number
    }
 
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isAnonymous) return next();
    try {
        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bycrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);