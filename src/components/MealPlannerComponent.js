import React, { useState, useEffect } from 'react';
import '../css/MealPlannerComponent.css';

const MealPlannerComponent = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch 3 random meals from TheMealDB
  const fetchRandomMeals = async () => {
    try {
      setLoading(true);
      const mealPromises = Array.from({ length: 3 }, () =>
        fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
      );

      const results = await Promise.all(mealPromises);
      const randomMeals = results.map((result) => result.meals[0]);
      setMeals(randomMeals);
    } catch (error) {
      setError('Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMeals();

    const interval = setInterval(() => {
      fetchRandomMeals(); // Refresh meals every 30 seconds
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="meal-planner">
      <h2 className="title">Random Meal Suggestions</h2>
      <ul className="meal-list">
        {meals.map((meal) => (
          <li key={meal.idMeal} className="meal-item">
            <h3>{meal.strMeal}</h3>
            <p><strong>Category:</strong> {meal.strCategory}</p>
            <p><strong>Area:</strong> {meal.strArea}</p>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="meal-image"
            />
            <a
              href={meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`}
              target="_blank"
              rel="noopener noreferrer"
              className="view-recipe-link"
            >
              View Recipe
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlannerComponent;
