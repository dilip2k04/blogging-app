import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import './PostList.css';

// Example current user id (replace with real auth state in your app)
const currentUserId = 'user-12345';

export const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/posts/${postId}/like`, { userId: currentUserId });
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, likes: [...(post.likes || []), currentUserId] }
            : post
        )
      );
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message || 'You have already liked this post.');
      } else {
        console.error('Error liking post:', err);
      }
    }
  };

  if (posts.length === 0) {
    return (
      <div className="linkedin-empty-state">
        <img 
          src="https://static.licdn.com/sc/h/3zh7lnslu3eavtccn5k0vqrk5" 
          alt="No posts"
          className="empty-image"
        />
        <h3>No posts yet</h3>
        <p>When you share something, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="linkedin-feed">
      {posts.map((post) => (
        <div key={post._id} className="linkedin-post">
          <div className="post-header">
            <div className="post-author">
              <img 
                src={`https://i.pravatar.cc/150?u=${post.userId}`} 
                alt="Author" 
                className="author-avatar"
              />
              <div className="author-info">
                <h4>{post.userName || `User ${post.userId?.slice(0, 5)}`}</h4>
                <p>name</p>
                <span className="post-time">2d • <span className="visibility">🌎</span></span>
              </div>
            </div>
            <button className="post-options">
              <FaEllipsisH />
            </button>
          </div>

          <div className="post-content">
            <p>{post.description}</p>
            {post.imageUrl && (
              <div className="post-image-container">
                <img 
                  src={post.imageUrl} 
                  alt={post.title || 'Post image'} 
                  className="post-image"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="post-stats">
            <div className="reactions">
              <FaThumbsUp style={{ color: '#0a66c2', marginRight: 6 }} />
              <span className="like-count">{post.likes?.length || 0}</span>
            </div>
            <div className="comments-shares">
              <span>5 comments • 2 reposts</span>
            </div>
          </div>

          <div className="post-actions">
            <button 
              className="action-btn" 
              onClick={() => handleLike(post._id)} 
              disabled={post.likes?.includes(currentUserId)}
              style={{ color: post.likes?.includes(currentUserId) ? '#0a66c2' : 'inherit' }}
              title={post.likes?.includes(currentUserId) ? "You already liked this post" : "Like this post"}
            >
              <FaThumbsUp /> <span>Like</span>
            </button>
            <button className="action-btn">
              <FaComment /> <span>Comment</span>
            </button>
            <button className="action-btn">
              <FiSend /> <span>Repost</span>
            </button>
            <button className="action-btn">
              <FaShare /> <span>Send</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
