import React from 'react';
import './App.css';

const Footer = () => {
  return (
    <footer className="nutriscan-footer">
      <div className="footer-top">
        <p>Questions? Call 000-800-919-1694</p>
      </div>

      <div className="footer-columns">
        <div className="footer-column">
          <a href="/">FAQ</a>
          <a href="/">Nutrition Guide</a>
          <a href="/">Privacy</a>
          <a href="/">Speed Test</a>
        </div>
        <div className="footer-column">
          <a href="/">Help Centre</a>
          <a href="/">Careers</a>
          <a href="/">Diet Plans</a>
          <a href="/">Terms of Use</a>
        </div>
        <div className="footer-column">
          <a href="/">My Account</a>
          <a href="/">Popular Foods</a>
          <a href="/">Corporate Info</a>
          <a href="/">Only on NutriScan</a>
        </div>
        <div className="footer-column">
          <a href="/">Media Centre</a>
          <a href="/">User Benefits</a>
          <a href="/">Contact Us</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NutriScan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
