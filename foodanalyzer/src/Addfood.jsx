import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './App.css';

const Addfood = () => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    fiber: '',
    sugar: '',
    saturatedFat: '',
    unsaturatedFat: '',
    vitamins: '',
    minerals: '',
    category: 'other',
    imageUrl: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl') {
      setFormData({ ...formData, imageUrl: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch('http://localhost:7000/foods/addfoods', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Upload failed');

      alert('Food added successfully!');
      console.log(result);

      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbohydrates: '',
        fat: '',
        fiber: '',
        sugar: '',
        saturatedFat: '',
        unsaturatedFat: '',
        vitamins: '',
        minerals: '',
        category: 'other',
        imageUrl: null,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error adding food');
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-page">
        <h1 className="title">Add New Food Item</h1>
        <form className="food-form" onSubmit={handleSubmit}>
          {[
            'name', 'calories', 'protein', 'carbohydrates',
            'fat', 'fiber', 'sugar', 'saturatedFat', 'unsaturatedFat'
          ].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type={field === 'name' ? 'text' : 'number'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required={['name', 'calories', 'protein', 'carbohydrates', 'fat'].includes(field)}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Vitamins (key:value):</label>
            <input
              type="text"
              name="vitamins"
              value={formData.vitamins}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Minerals (key:value):</label>
            <input
              type="text"
              name="minerals"
              value={formData.minerals}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="grains">Grains</option>
              <option value="proteins">Proteins</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image Upload:</label>
            <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Addfood;
