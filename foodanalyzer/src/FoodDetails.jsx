import './App.css';

function FoodDetails({ food }) {
  return (
    <div className="food-details">
      <h2>{food.name}</h2>
      <div className="food-header">
        <div className="food-image">
          {food.imageUrl ? (
           <img
           src={`https://foodanaylzer.onrender.com${food.imageUrl}`} // don't add another `/uploads`
           alt={food.name}
           style={{ width: '300px', height: '300px', objectFit: 'cover' }}
         />
         
          ) : (
            <div className="placeholder-image">No image available</div>
          )}
        </div>
        <div className="main-nutrition">
          <div className="nutrition-item highlight">
            <span>Calories</span>
            <span className="value">{food.calories} kcal</span>
          </div>
          <div className="nutrition-item">
            <span>Protein</span>
            <span className="value">{food.protein}g</span>
          </div>
          <div className="nutrition-item">
            <span>Carbs</span>
            <span className="value">{food.carbohydrates}g</span>
          </div>
          <div className="nutrition-item">
            <span>Fat</span>
            <span className="value">{food.fat}g</span>
          </div>
        </div>
      </div>

      <div className="nutrition-details">
        <h3>Detailed Nutrition Facts</h3>
        <div className="nutrition-grid">
          <div className="nutrition-category">
            <h4>Carbohydrates</h4>
            <div className="nutrition-subitem">
              <span>Fiber</span>
              <span>{food.fiber}g</span>
            </div>
            <div className="nutrition-subitem">
              <span>Sugar</span>
              <span>{food.sugar}g</span>
            </div>
          </div>

          <div className="nutrition-category">
            <h4>Fats</h4>
            <div className="nutrition-subitem">
              <span>Saturated</span>
              <span>{food.saturatedFat}g</span>
            </div>
            <div className="nutrition-subitem">
              <span>Unsaturated</span>
              <span>{food.unsaturatedFat}g</span>
            </div>
          </div>

          <div className="nutrition-category">
            <h4>Vitamins</h4>
            {food.vitamins && Object.entries(food.vitamins).map(([key, value]) => (
              <div className="nutrition-subitem" key={key}>
                <span>{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          <div className="nutrition-category">
            <h4>Minerals</h4>
            {food.minerals && Object.entries(food.minerals).map(([key, value]) => (
              <div className="nutrition-subitem" key={key}>
                <span>{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
