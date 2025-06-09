import React from 'react';
import './App.css';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
    return (
        <>
        <Navbar/>
        <div className="about-container">
        <h1 className="about-title">About NutriScan</h1>
  
        <p className="about-description">
          NutriScan is a smart and user-friendly food nutrition analyzer that helps users make healthier dietary choices
          by providing accurate and comprehensive nutritional information for various foods. Whether you're a fitness enthusiast,
          a health-conscious individual, or simply curious about what you eat — NutriScan has got you covered.
        </p>
  
        <div className="about-content">
          <Section
            title="🌟 Our Purpose"
            content={`In today's fast-paced world, understanding the nutritional content of the food we consume is more important than ever.
            NutriScan was built to bridge the gap between food and informed decision-making. With our analyzer, you can easily identify
            calories, macronutrients, micronutrients, and other essential health metrics from a wide range of food items.`}
          />
  
          <Section
            title="💡 Features at a Glance"
            items={[
              '🔍 Search for any food item and get detailed nutritional insights instantly.',
              '📸 Upload custom food data with image support and manual nutrition entry.',
              '📊 View breakdowns of calories, proteins, carbohydrates, fats, vitamins, and minerals.',
              '📈 Track common/popular foods and explore healthier alternatives.',
              '🔐 All your data is secure — no unnecessary sign-ups or tracking.'
            ]}
          />
  
          <Section
            title="👩‍💻 Who Is It For?"
            items={[
              '• Health-conscious individuals who want to monitor their intake.',
              '• Fitness enthusiasts and athletes following macro-based diets.',
              '• Dietitians, nutritionists, and health professionals.',
              '• Students and researchers studying food science and nutrition.',
              '• Anyone who wants to eat smart, live well, and stay informed.'
            ]}
          />
  
          <Section
            title="🚀 Our Journey & Vision"
            content={`NutriScan began as a passion project to make nutritional analysis simple and accessible to everyone.
            As we grow, we aim to integrate machine learning for personalized recommendations, meal planning, and
            real-time scanning using mobile devices. Our vision is to become a go-to tool for every food decision you make.`}
          />
  
          <Section
            title="🤝 Connect With Us"
            content={`We value feedback, collaboration, and innovation. If you have suggestions, want to contribute, or simply wish to connect — don’t hesitate to reach out through our Contact page.`}
          />
        </div>
      </div>
      <Footer/>
        </>
      
    );
  };
  
  const Section = ({ title, content, items }) => (
    <div className="about-section">
      <h2>{title}</h2>
      {content && <p>{content}</p>}
      {items && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
  
  export default About;