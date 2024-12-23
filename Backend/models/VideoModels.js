const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    tags: {
        type: [String],
    },
    fileSize: {
        type: Number,
    },
    googleDriveLink: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
