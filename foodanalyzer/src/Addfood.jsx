import React, { useState, useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { addItem } from '../Store/Foodslice';

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
  
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl') {
      setFormData({ ...formData, imageUrl: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }
    
    // Auth bypass for testing or original logic
    const userId = localStorage.getItem('userId');
    if(!userId){
      alert('please login first');
      return;
    }
    data.append('userId', userId);

    try {
      const rawBase = import.meta.env.VITE_API_URL || "";
      const apiBase = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;
      const res = await fetch(`${apiBase}/foods/addfoods`, {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Upload failed');

      alert('Item added successfully!');
      
      if (dispatch) {
          dispatch(addItem(result)); 
      }

      setFormData({
        name: '', calories: '', protein: '', carbohydrates: '',
        fat: '', fiber: '', sugar: '', saturatedFat: '', unsaturatedFat: '',
        vitamins: '', minerals: '', category: 'other', imageUrl: null,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error adding item');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-6 font-medium">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter text-primary mb-2">Add New Food Item</h1>
              <p className="text-on-surface-variant text-lg max-w-lg">Expand our database by contributing nutritional details of your favorite ingredients or prepared foods.</p>
            </div>
            <div className="hidden md:block">
              <span className="material-symbols-outlined text-primary-fixed-dim text-[5rem] opacity-20 leading-none">nutrition</span>
            </div>
          </div>

          {/* Bento Form Layout */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Basic Info Card */}
            <div className="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.04)] border border-outline-variant/10">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span> Basic Information
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="e.g. Organic Avocados" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"/>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Category</label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none text-on-surface font-semibold">
                      <option value="other">Select a category</option>
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="grains">Grains</option>
                      <option value="proteins">Proteins</option>
                      <option value="dairy">Dairy &amp; Eggs</option>
                      <option value="other">Snacks &amp; Sweets</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Card */}
            <div onClick={handleBrowseClick} className="cursor-pointer md:col-span-4 bg-surface-container p-8 rounded-xl flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant/30 group hover:border-primary/30 transition-colors">
              <input ref={fileInputRef} type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="hidden" />
              <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
              </div>
              <h3 className="font-heading font-bold mb-1">{formData.imageUrl ? formData.imageUrl.name : 'Image Upload'}</h3>
              <p className="text-xs text-on-surface-variant mb-4">{formData.imageUrl ? 'Click to replace' : 'Click to browse'}</p>
              <button type="button" className="bg-surface-container-lowest text-primary text-xs font-bold py-2 px-6 rounded-full border border-outline-variant shadow-sm hover:bg-surface-container-lowest/80">
                {formData.imageUrl ? 'Selected' : 'Browse Files'}
              </button>
            </div>

            {/* Macro Nutrients Card (Bento Section) */}
            <div className="md:col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.04)] border border-outline-variant/10">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">energy_savings_leaf</span> Macronutrients
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Calories (kcal)</label>
                  <input required name="calories" value={formData.calories} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Protein (g)</label>
                  <input required name="protein" value={formData.protein} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Carb (g)</label>
                  <input required name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Fat (g)</label>
                  <input required name="fat" value={formData.fat} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
              </div>
            </div>

            {/* Fats Breakdown (Editorial Aside) */}
            <div className="md:col-span-12 lg:col-span-5 bg-secondary-container/30 p-8 rounded-xl border border-secondary/10">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-on-secondary-container">
                <span className="material-symbols-outlined">science</span> Detailed Fats
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container/70 mb-2">Saturated Fat (g)</label>
                  <input name="saturatedFat" value={formData.saturatedFat} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-secondary-container/70 mb-2">Unsaturated Fat (g)</label>
                  <input name="unsaturatedFat" value={formData.unsaturatedFat} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
              </div>
            </div>

            {/* Fiber & Sugar Section */}
            <div className="md:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.04)] border border-outline-variant/10">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container">grain</span> Carbs Detail
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Fiber (g)</label>
                  <input name="fiber" value={formData.fiber} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary/20 outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Sugar (g)</label>
                  <input name="sugar" value={formData.sugar} onChange={handleChange} type="number" placeholder="0" className="w-full bg-surface-container-low border-none rounded-xl p-4 transition-all focus:ring-2 focus:ring-primary/20 outline-none"/>
                </div>
              </div>
            </div>

            {/* Micronutrients Section */}
            <div className="md:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.04)] border border-outline-variant/10">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">biotech</span> Micronutrients
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Vitamins <span className="lowercase text-[10px] opacity-70">(key:value)</span></label>
                  <input name="vitamins" value={formData.vitamins} onChange={handleChange} type="text" placeholder="e.g. Vitamin C, B12" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Minerals <span className="lowercase text-[10px] opacity-70">(key:value)</span></label>
                  <input name="minerals" value={formData.minerals} onChange={handleChange} type="text" placeholder="e.g. Iron, Zinc" className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"/>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="md:col-span-12 mt-8 flex flex-col md:flex-row items-center justify-between bg-primary p-1.5 rounded-full shadow-lg border border-primary-container">
              <div className="px-8 py-3 text-on-primary/60 text-sm italic hidden md:block font-bold">
                Double check your values for accuracy.
              </div>
              <button type="submit" className="w-full md:w-auto bg-surface-container-lowest text-primary font-heading font-extrabold px-12 py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                Add Food to Database
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Addfood;
