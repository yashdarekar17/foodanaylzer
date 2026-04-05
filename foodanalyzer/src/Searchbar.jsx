import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="w-full max-w-2xl relative group mx-auto" onSubmit={handleSubmit}>
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-focus-within:bg-primary/10 transition-all"></div>
      <div className="relative flex items-center bg-surface-container-lowest p-2 rounded-full border border-outline-variant/10 shadow-xl shadow-on-surface/5">
        <span className="material-symbols-outlined px-6 text-outline">search</span>
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-4 bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-outline-variant outline-none" 
          placeholder="e.g. '2 plates paneer butter masala' or 'jalebi'"
        />
        <button type="submit" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-[1.02] active:scale-95 transition-all outline-none">
          Analyze
        </button>
      </div>
    </form>
  );
}

export default SearchBar;