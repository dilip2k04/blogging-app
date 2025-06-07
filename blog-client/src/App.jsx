import { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import { fetchPosts, createPost } from './api/posts';
import { AuthForm } from './components/AuthForm';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import { SideNav } from './components/SideNav';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      alert(err.message);
      setPosts([]);
    }
  };

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await createPost(postData);
      await loadPosts();
      setActivePage('home');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setActivePage('home');
  };

  const renderPage = () => {
    if (activePage === 'home') {
      return (
        <>
          <div className="post-header">
            <h2>All Posts</h2>
            <button onClick={() => setActivePage('create')} className="add-post-btn">
              + Add Post
            </button>
          </div>
          <PostList posts={posts} />
        </>
      );
    } else if (activePage === 'my-posts') {
      const userPosts = posts.filter((post) => post.userId === user?.uid);
      return (
        <>
          <h2>My Posts</h2>
          <PostList posts={userPosts} />
        </>
      );
    } else if (activePage === 'create') {
      return <PostForm userId={user.uid} onCreatePost={handleCreatePost} />;
    }
  };

  if (authLoading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="auth-container">
        <AuthForm onSubmit={handleLogin} isLoading={isLoading} />
        <AuthForm onSubmit={handleRegister} isRegister isLoading={isLoading} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <SideNav
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;
