import React, { useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer'


const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for contacting us!');
    // Here you can send the form data to your backend or an email service
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
    <Navbar/>
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">Have questions or suggestions? We’d love to hear from you.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
          />
        </label>
        <label>
          Message:
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            required
            onChange={handleChange}
          ></textarea>
        </label>
        <button type="submit">Send Message</button>
      </form>
    </div>
    <Footer/>
    </>
    
  );
};

export default Contact;
