import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './Searchbar';
import FoodDetails from './FoodDetails';
import Navbar from './Navbar';
import Footer from './Footer';
function Layoutfood (){
    const [searchTerm, setSearchTerm] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError(null);
    setFoodData(null);
    
    try {
      const response = await fetch(`http://localhost:7000/foods/search?name=${term}`);
      if (!response.ok) {
        throw new Error('Food not found');
      }
      const data = await response.json();
      setFoodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <div className="app">
      <Navbar />
      <main className="container">
        <h1 className='container2'>Food Nutrition Analyzer</h1>
        <p className="subtitle">Search for any food to get detailed nutritional information</p>
        
        <SearchBar onSearch={handleSearch} />
        
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {foodData && <div className='container2'><FoodDetails food={foodData} /></div>}
        
        {!searchTerm && !loading && !foodData && (
          <div className="initial-state">
            <h2>Popular Foods</h2>
            <div className="food-suggestions">
            <div className="food-suggestion" onClick={() => handleSearch('Apple')}>
                <span>apple</span>
              </div>
              <div className="food-suggestion" onClick={() => handleSearch('Chicken Breast')}>
                <span>Chicken</span>
              </div>
              <div className="food-suggestion" onClick={() => handleSearch('broccoli')}>
                <span>Broccoli</span>
              </div>
              <div className="food-suggestion" onClick={() => handleSearch('salmon')}>
                <span>Salmon</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    <div>
      <Footer/>
    </div>
    </>
    
    
  );
}

export default Layoutfood;