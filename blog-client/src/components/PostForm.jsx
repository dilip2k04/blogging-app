// components/PostForm.jsx
import { useState } from 'react';
import { uploadImage } from '../api/imageUpload';

export const PostForm = ({ userId, onCreatePost }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const imageUrl = await uploadImage(img);
      await onCreatePost({
        userId,
        title,
        description: desc,
        imageUrl
      });
      setTitle('');
      setDesc('');
      setImg(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create Post</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => setImg(e.target.files[0])}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};