// api/posts.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/posts';

export const fetchPosts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch posts");
  }
};

export const createPost = async (postData) => {
  try {
    await axios.post(API_URL, postData);
  } catch (err) {
    throw new Error("Failed to create post");
  }
};