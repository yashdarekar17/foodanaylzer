import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

const StoreItems = () => {
  const [foods, setFoods] = useState([]);
  const [expandId, setExpandId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/foods/userfoods/${userId}`);
        setFoods(response.data);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const toggleExpand = (id) => {
    setExpandId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-surface min-h-screen font-body text-on-surface flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-8 max-w-[95vw] mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed/30 rounded-full mb-6 relative">
             <span className="absolute inset-0 bg-primary/10 rounded-full blur-md -z-10"></span>
             <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
             <span className="text-xs font-bold tracking-widest uppercase text-on-primary-fixed-variant">History Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold tracking-tight mb-4">Your Stored <span className="text-primary italic">Foods</span></h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Review the nutritional insights of all the foods you've previously kept track of.</p>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
           </div>
        ) : foods.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-[3rem] p-16 text-center border border-outline-variant/30 shadow-sm max-w-3xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-outline mb-6">kitchen</span>
            <h2 className="text-3xl font-heading font-bold mb-4">No foods stored yet</h2>
            <p className="text-on-surface-variant text-lg">Your pantry is empty! Head over to the scanner to start analyzing and saving your meals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {foods.map((food) => (
              <motion.div
                key={food._id || Math.random()}
                layout
                onClick={() => toggleExpand(food._id)}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 cursor-pointer flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-surface-container">
                  {food.imageUrl ? (
                    <img
                      src={`${axios.defaults.baseURL}${food.imageUrl}`}
                      alt={food.name || "Food"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-outline">
                       <span className="material-symbols-outlined text-4xl">restaurant</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-3xl font-heading font-bold text-white mb-1 drop-shadow-md">{food.name || "Unnamed"}</h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                     <span className="material-symbols-outlined text-sm text-primary">local_fire_department</span>
                     <span className="text-xs font-bold text-on-surface">{food.calories || 0} kcal</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-on-surface-variant font-bold text-sm hover:text-primary transition-colors">
                     {expandId === food._id ? "Hide Details" : "View Full Details"}
                     <span className={`material-symbols-outlined transition-transform duration-300 ${expandId === food._id ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>

                  <AnimatePresence>
                    {expandId === food._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-outline-variant/30"
                      >
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-surface-container p-4 rounded-2xl flex flex-col items-center">
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Protein</span>
                              <span className="text-xl font-heading font-bold">{food.protein || 0}g</span>
                           </div>
                           <div className="bg-surface-container p-4 rounded-2xl flex flex-col items-center">
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Carbs</span>
                              <span className="text-xl font-heading font-bold">{food.carbohydrates || 0}g</span>
                           </div>
                           <div className="bg-surface-container p-4 rounded-2xl flex flex-col items-center">
                              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Fats</span>
                              <span className="text-xl font-heading font-bold">{food.fat || 0}g</span>
                           </div>
                           <div className="bg-primary/10 p-4 rounded-2xl flex flex-col items-center">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Saturated</span>
                              <span className="text-xl font-heading font-bold text-primary-fixed-dim">{food.saturatedFat || 0}g</span>
                           </div>
                        </div>

                        {food.foodDetails && Object.keys(food.foodDetails).length > 0 && (
                          <div className="space-y-3">
                             <p className="font-bold text-sm text-on-surface-variant">Micronutrients</p>
                             {Object.entries(food.foodDetails).map(([key, value]) => (
                               <div key={key} className="flex justify-between items-center py-2 border-b border-surface-container-high last:border-0">
                                 <span className="capitalize text-sm font-medium">{key}</span>
                                 <span className="font-bold text-sm">{value}</span>
                               </div>
                             ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StoreItems;
