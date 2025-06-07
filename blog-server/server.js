const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// MongoDB Schema
const PostSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  imageUrl: String,
});
const Post = mongoose.model('Post', PostSchema);

// Create Post
app.post('/posts', async (req, res) => {
  const { userId, title, description, imageUrl } = req.body;
  try {
    const newPost = new Post({ userId, title, description, imageUrl });
    await newPost.save();
    res.status(201).json({ message: 'Post created' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get all Posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
