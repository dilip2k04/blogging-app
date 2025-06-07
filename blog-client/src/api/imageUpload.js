// api/imageUpload.js
import axios from 'axios';

export const uploadImage = async (imageFile) => {
  const form = new FormData();
  form.append('file', imageFile);
  form.append('upload_preset', 'unsigned_preset');

  try {
    const res = await axios.post('https://api.cloudinary.com/v1_1/detauqezy/image/upload', form);
    return res.data.secure_url;
  } catch (err) {
    throw new Error("Failed to upload image");
  }
};