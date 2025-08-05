import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './Searchbar';
import FoodDetails from './FoodDetails';
import Navbar from './Navbar';
import Footer from './Footer';
import blueberry from './foodimage/blueberry.jpeg';
import Avocado from './foodimage/avocado.jpeg';
import Sweet from './foodimage/sweet.png';
import chicken from './foodimage/chicken.png';
import egg from './foodimage/egg.png';
import spinach from './foodimage/spinach.png';
import greek from './foodimage/greek.png';
import garlic from './foodimage/garlic.png';
import leafy from './foodimage/leafy.png';
import nuts from './foodimage/nuts.png';
import salmon from './foodimage/salmon.jpg';
import vegies from './foodimage/vegies.png';
import tomatoes from './foodimage/tomatoes.png';
import carrots from './foodimage/carrots.png';
import quantinia from './foodimage/quantinia.png'


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
      const response = await fetch(`https://foodanaylzer.onrender.com/foods/search?name=${term}`);
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
               {/* New Popular Healthy Foods Section */}
         <section className="healthy-foods-section">
  <h2 className="section-title">Popular Healthy Foods</h2>
  <div className="healthy-foods-grid">
    
    <div className="healthy-food-card" onClick={() => handleSearch('Avocado')}>
      <img className="food-image2" src={Avocado} alt="Avocado" width="100" />
      <h3>Avocado</h3>
      <p className="food-benefits">Rich in healthy monounsaturated fats, fiber, and potassium. Great for heart health and nutrient absorption.</p>
      <div className="food-nutrition-highlight">High in Healthy Fats & Fiber</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Quinoa')}>
      <img className="food-image2" src={quantinia} alt="Quinoa" width="100" />
      <h3>Quinoa</h3>
      <p className="food-benefits">Complete protein containing all essential amino acids. Gluten-free and rich in minerals.</p>
      <div className="food-nutrition-highlight">Complete Protein Source</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Blueberries')}>
      <img className="food-image2" src={blueberry} alt="Blueberries" width="100" />
      <h3>Blueberries</h3>
      <p className="food-benefits">Packed with antioxidants, vitamin C, and fiber. Supports brain health and immune function.</p>
      <div className="food-nutrition-highlight">Antioxidant Powerhouse</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Sweet Potato')}>
      <img className="food-image2" src={Sweet} alt="Sweet Potato" width="100" />
      <h3>Sweet Potato</h3>
      <p className="food-benefits">High in beta-carotene, vitamin A, and complex carbohydrates. Supports eye health and immunity.</p>
      <div className="food-nutrition-highlight">Rich in Vitamin A</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Greek Yogurt')}>
      <img className="food-image2" src={greek} alt="Greek Yogurt" width="100" />
      <h3>Greek Yogurt</h3>
      <p className="food-benefits">High protein content with probiotics for digestive health. Lower in sugar than regular yogurt.</p>
      <div className="food-nutrition-highlight">Protein & Probiotics</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Spinach')}>
      <img className="food-image2" src={spinach} alt="Spinach" width="100" />
      <h3>Spinach</h3>
      <p className="food-benefits">Loaded with iron, folate, and vitamins K, A, and C. Supports bone health and energy levels.</p>
      <div className="food-nutrition-highlight">Iron & Folate Rich</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Eggs')}>
      <img className="food-image2" src={egg} alt="Eggs" width="100" />
      <h3>Eggs</h3>
      <p className="food-benefits">Excellent source of high-quality animal protein, healthy fats, and essential nutrients like B12 and choline. Often paired with dairy for enhanced nutrition.</p>
      <div className="food-nutrition-highlight">Complete Protein + Brain Nutrients</div>
    </div>

    <div className="healthy-food-card" onClick={() => handleSearch('Chicken Yogurt')}>
      <img className="food-image2" src={chicken} alt="Chicken with Yogurt" width="100" />
      <h3>Chicken with Yogurt</h3>
      <p className="food-benefits">Lean source of protein from chicken, combined with probiotic-rich yogurt to support muscle repair and gut health.</p>
      <div className="food-nutrition-highlight">Lean Protein + Probiotics</div>
    </div>

  </div>
</section>



          {/* Slogan Section */}
          <section className="slogan-section">
            <h1 className="main-slogan">NutriScan</h1>
            <p className="sub-slogan">"Nourish Your Body, Fuel Your Life"</p>
            <p className="sub-slogan2">add or check your favorite food to check its nutrition value in nutriscan</p>
            {/* <div className="slogan-features">
              <div className="slogan-feature">
                <span className="feature-icon">🔍</span>
                <span>Analyze</span>
              </div>
              <div className="slogan-feature">
                <span className="feature-icon">📊</span>
                <span>Track</span>
              </div>
              <div className="slogan-feature">
                <span className="feature-icon">💪</span>
                <span>Optimize</span>
              </div>
              <div className="slogan-feature">
                <span className="feature-icon">🌱</span>
                <span>Thrive</span>
              </div>
            </div> */}
          </section>

          {/* Expert Suggestions Section */}
              <section className="expert-suggestions-section">
            <h2 className="section-title">Foods That Help Fight Diseases</h2>
            <div className="expert-suggestions-grid">
              <div className="expert-card">
                <img className="food-image2" src={blueberry} alt="Blueberries" width="100" />
                <div className="expert-name">Blueberries</div>
                <div className="expert-title">For Brain Health & Memory</div>
                <p className="expert-suggestion">
                  Rich in anthocyanins and antioxidants that help prevent cognitive decline, improve memory, and reduce risk of Alzheimer's disease. Studies show regular consumption can enhance brain function.
                </p>
              </div>
              
              <div className="expert-card">
                <img className="food-image2" src={salmon} alt="Spinach" width="100" />
                <div className="expert-name">Fatty Fish (Salmon)</div>
                <div className="expert-title">For Heart Disease Prevention</div>
                <p className="expert-suggestion">
                  Omega-3 fatty acids help reduce inflammation, lower blood pressure, and decrease risk of heart disease. EPA and DHA support cardiovascular health and reduce triglyceride levels.
                </p>
              </div>
              
              <div className="expert-card">
               <img className="food-image2" src={vegies} alt="Spinach" width="100" />
                <div className="expert-name">Cruciferous Vegetables</div>
                <div className="expert-title">For Cancer Prevention</div>
                <p className="expert-suggestion">
                  Broccoli, cauliflower, and kale contain sulforaphane and other compounds that help detoxify carcinogens and may reduce risk of various cancers, especially colorectal and lung cancer.
                </p>
              </div>
              
              <div className="expert-card">
                <img className="food-image2" src={leafy} alt="Spinach" width="100" />
                <div className="expert-name">Leafy Greens</div>
                <div className="expert-title">For Diabetes Management</div>
                <p className="expert-suggestion">
                  Spinach, kale, and other greens are low in calories but high in nutrients and fiber. They help regulate blood sugar levels and improve insulin sensitivity in type 2 diabetes.
                </p>
              </div>
              
              <div className="expert-card">
                <img className="food-image2" src={nuts} alt="Spinach" width="100" />
                <div className="expert-name">Nuts & Seeds</div>
                <div className="expert-title">For Cholesterol Control</div>
                <p className="expert-suggestion">
                  Almonds, walnuts, and flaxseeds contain healthy fats, fiber, and plant sterols that help lower LDL (bad) cholesterol and reduce risk of cardiovascular disease.
                </p>
              </div>
              
              <div className="expert-card">
                <img className="food-image2" src={tomatoes} alt="Spinach" width="100" />
                <div className="expert-name">Tomatoes</div>
                <div className="expert-title">For Prostate Health</div>
                <p className="expert-suggestion">
                  Rich in lycopene, a powerful antioxidant that may help reduce risk of prostate cancer. Cooked tomatoes provide higher bioavailability of lycopene than raw tomatoes.
                </p>
              </div>

              <div className="expert-card">
         <img className="food-image2" src={garlic} alt="Spinach" width="100" />
        <div className="expert-name">Garlic</div>
     <div className="expert-title">For Immune Support</div>
  <p className="expert-suggestion">
    Contains allicin and sulfur compounds that enhance immune response, reduce inflammation, and help combat bacterial and viral infections. Regular intake may shorten cold duration.
  </p>
</div>

<div className="expert-card">
  <img className="food-image2" src={carrots} alt="Spinach" width="100" />
  <div className="expert-name">Carrots</div>
  <div className="expert-title">For Eye Health</div>
  <p className="expert-suggestion">
    High in beta-carotene, which converts to vitamin A in the body and supports vision, especially night vision. Also helps reduce risk of age-related macular degeneration.
  </p>
</div>

            </div>
          </section>

          
      </main>
    </div>
    <div>
      <Footer/>
    </div>
    </>
    
    
  );
}

export default Layoutfood;
