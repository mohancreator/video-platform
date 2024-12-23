const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const Video = require('./models/VideoModels');
const User = require('./models/FormModels');
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();

const url = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
// Upload Video
app.post('/upload', async (req, res) => {
    const { title, description, tags, googleDriveLink, fileSize, userId } = req.body;

    try {
        const videoData = new Video({
            userId,
            title,
            description,
            tags,
            googleDriveLink,
            fileSize,
        });

        await videoData.save();
        res.status(201).json({ message: 'Video uploaded successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading video' });
    }
});

// Fetch Videos with Filters
app.get('/videos', async (req, res) => {
    const { page = 1, title = '', tag = '', date = '', limit = 10, userId } = req.query;
    const skip = (page - 1) * limit;

    try {
        const filters = {};
        if (userId) filters.userId = userId; 
        if (title) filters.title = { $regex: title, $options: 'i' }; 
        if (tag) filters.tags = { $in: [tag] };
        if (date) filters.uploadedAt = { $gte: new Date(date) };

        const videos = await Video.find(filters)
            .skip(skip)
            .limit(parseInt(limit, 10))
            .sort({ uploadedAt: -1 });

        const totalVideos = await Video.countDocuments(filters);

        res.status(200).json({
            videos,
            pagination: {
                totalVideos,
                currentPage: parseInt(page, 10),
                totalPages: Math.ceil(totalVideos / limit),
            },
        });
    } catch (err) {
        console.error('Error fetching videos:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Register User
app.post('/register', async (req, res) => {
    const { username, password, email, name } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) return res.status(400).json({ error: 'Email or Username already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, name });
        await newUser.save();

        res.status(201).json({ message: `User ${username} registered successfully!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { emailorusername, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: emailorusername }, { username: emailorusername }] });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id }, 
            'your-secret-key', 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: `Welcome, ${user.username}`,
            token, 
            userId: user._id 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Start Server
app.listen(8001, () => {
    console.log('Server running at http://localhost:8001');
});
