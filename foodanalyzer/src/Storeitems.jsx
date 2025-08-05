import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import FoodDetails from "./FoodDetails";
import Navbar from "./Navbar";
import Footer from "./Footer";

const StoreItems = () => {
  const [foods, setFoods] = useState([]);
  const [expandId, setExpandId] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://foodanaylzer.onrender.com/foods/userfoods/${userId}`);
        console.log("Store items fetched:", response.data);
        setFoods(response.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const toggleExpand = (id) => {
    setExpandId((prev) => (prev === id ? null : id));
  };

  return (
    <>
    <Navbar/>
     <div className="store-container">
      <h2 className="store-title">Stored Food</h2>

      {foods.length === 0 ? (
        <p className="no-food">No stored food found.</p>
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <div
              key={food._id || Math.random()}
              onClick={() => toggleExpand(food._id)}
              className="food-card"
            >
              <div className="food-header">
                <img
                  src={`http://localhost:7000${food.imageUrl}`}
                  alt={food.name || "Food"}
                  className="food-image2"
                />
                <div className="food-info2">
                  <h3>{food.name || "Unnamed"}</h3>
                  <p>{expandId === food._id ? "Click to hide" : "Click to view details"}</p>
                </div>
              </div>

              {expandId === food._id && (
                <div className="food-details2">
        <p><strong>Calories:</strong> {food.calories || "N/A"} kcal</p>
        <p><strong>Protein:</strong> {food.protein || "N/A"} g</p>
        <p><strong>Carbs:</strong> {food.carbohydrates || "N/A"} g</p>
        <p><strong>Fats:</strong> {food.fat || "N/A"} g</p>
        <p><strong>saturatedFat:</strong>{food.saturatedFat || "N/A"}g</p>
         <p><strong>unsaturatedFat:</strong>{food.unsaturatedFat || "N/A"}g</p>
         
          
           

        {/* Dynamically render foodDetails */}
        {food.foodDetails && Object.entries(food.foodDetails).map(([key, value]) => (
          <FoodDetails key={key} label={key} value={value} />
        ))}
      </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="footer2">
    <Footer/>
    </div>
    
    </>
   
  );
};

export default StoreItems;
