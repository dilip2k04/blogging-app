import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import axios from 'axios';

// Your full Firebase configuration object with all fields
const firebaseConfig = {
  apiKey: "AIzaSyAyDMirIjQpqxBiVLX2Nl_H6chw-430WIg",
  authDomain: "blog-6c564.firebaseapp.com",
  projectId: "blog-6c564",
  storageBucket: "blog-6c564.firebasestorage.app",
  messagingSenderId: "673419280848",
  appId: "1:673419280848:web:94ca94884797946c1479d5",
  measurementId: "G-39MZ92T0V2"
};

// Initialize Firebase app & analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(cred => setUser(cred.user))
      .catch(err => alert(err.message));
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(cred => setUser(cred.user))
      .catch(err => alert(err.message));
  };

  const uploadImage = async () => {
    const form = new FormData();
    form.append('file', img);
    form.append('upload_preset', 'unsigned_preset'); // Replace with your Cloudinary preset

    const res = await axios.post(`https://api.cloudinary.com/v1_1/detauqezy/image/upload`, form); // Replace with your Cloudinary cloud name
    return res.data.secure_url;
  };

  const createPost = async () => {
    const url = await uploadImage();
    await axios.post('http://localhost:5000/posts', {
      userId: user.uid,
      title,
      description: desc,
      imageUrl: url,
    });
    fetchPosts();
  };

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/posts');
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      {!user ? (
        <div className="auth">
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Create Post</h2>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="file" onChange={e => setImg(e.target.files[0])} />
          <button onClick={createPost}>Post</button>
        </div>
      )}

      <h2>Posts</h2>
      {posts.map((post, i) => (
        <div key={i} className="post">
          <h3>{post.title}</h3>
          <img src={post.imageUrl} alt="Uploaded" width="200" />
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
};

createRoot(document.getElementById('root')).render(<App />);
