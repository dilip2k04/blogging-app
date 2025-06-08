const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'https://blogging-app-a9md.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Cloudinary config (if you need image upload)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Post schema with likes array
const PostSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  title: String,
  description: String,
  imageUrl: String,
  likes: [{ type: String }], // store userIds who liked the post
});
const Post = mongoose.model('Post', PostSchema);

app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// Create a post
app.post('/posts', async (req, res) => {
  try {
    const { userId, userName, title, description, imageUrl } = req.body;
    const newPost = new Post({ userId, userName, title, description, imageUrl, likes: [] });
    await newPost.save();
    res.status(201).json({ message: '✅ Post created successfully' });
  } catch (err) {
    console.error("❌ Error saving post:", err);
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Like a post
app.post('/posts/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required to like a post' });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'User already liked this post' });
    }

    post.likes.push(userId);
    await post.save();

    res.json({ message: 'Post liked', likeCount: post.likes.length });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
