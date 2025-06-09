import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPreviewUrl(res.data.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {previewUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={previewUrl} alt="Uploaded Preview" width="300px" />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
