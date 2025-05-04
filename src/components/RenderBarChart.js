// Import necessary modules from React and recharts library
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

// Import the MotivationalWordsCloud component and the CSS file for styling
import MotivationalWordsCloud from './MotivationalWordsCloud';
import '../css/RenderBarChart.css';

// Import the axios library for making HTTP requests
import axios from 'axios';

// Custom tooltip component for displaying information on hover
const CustomTooltip = ({ active, payload }) => {
  // Check if tooltip is active and data is available
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Styling for the tooltip
    const tooltipStyle = {
      background: '#f8f9fa',
      border: '1px solid #ddd',
      padding: '15px',
      fontSize: '16px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      transition: 'opacity 0.3s ease-in-out',
    };

    // Render tooltip content with data
    return (
      <div className="custom-tooltip" style={tooltipStyle}>
        <p style={{ color: 'black' }}>{`Day: ${data.displayDate}`}</p>
        <p style={{ color: '#FFD700' }}>{`Total Sugar: ${data.totalSugar.toFixed(2)}`}</p>
        <p style={{ color: '#32CD32' }}>{`Total Protein: ${data.totalProtein.toFixed(2)}`}</p>
        <p style={{ color: '#FF6347' }}>{`Total Fat: ${data.totalFat.toFixed(2)}`}</p>
        <p style={{ color: '#4169E1' }}>{`Total Carbohydrates: ${data.totalCarbohydrates.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

// Helper function to check if a date is valid
const isValidDate = (dateString) => {
  // First, check if dateString is actually provided
  if (!dateString) return false;
  
  // Try to create a Date object
  const date = new Date(dateString);
  
  // Check if date is valid and within a reasonable range (2000-2030)
  if (isNaN(date.getTime())) return false;
  
  const year = date.getFullYear();
  if (year < 2000 || year > 2030) return false;
  
  // Reject specific invalid dates we've observed
  if (dateString.includes('7777') || dateString.includes('0001')) return false;
  
  return true;
};

// Helper function to format date consistently
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Main component for rendering the line chart
const RenderBarChart = () => {
  // State for storing nutrition data and loading status
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the mock API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API request to get nutrition data
        const response = await axios.get('https://654d199b77200d6ba859fcf7.mockapi.io/nutrition');
        
        // Log the raw data to help with debugging
        console.log('Raw API data:', response.data);
        
        // Filter out entries with invalid dates before setting state
        const validData = response.data.filter(entry => isValidDate(entry.date));
        console.log('Filtered data (valid dates only):', validData);
        
        setNutritionData(validData);
        setLoading(false);
      } catch (error) {
        // Handle errors during API request
        console.error('Error fetching data:', error);
        setError('Failed to fetch nutrition data. Please try again later.');
        setLoading(false);
      }
    };

    // Invoke the fetchData function when the component mounts
    fetchData();
  }, []);

  const extractChartData = () => {
    if (!nutritionData.length) return [];
    
    const dateMap = {};
  
    nutritionData.forEach((entry) => {
      // Skip entries with invalid dates (should be already filtered, but adding as extra precaution)
      if (!isValidDate(entry.date)) return;
      
      const displayDate = formatDate(entry.date);
      
      // Initialize if not exists
      if (!dateMap[displayDate]) {
        dateMap[displayDate] = {
          day: displayDate,
          displayDate,
          sortDate: new Date(entry.date).getTime(), // Use timestamp for sorting
          totalSugar: 0,
          totalProtein: 0,
          totalFat: 0,
          totalCarbohydrates: 0,
        };
      }
  
      // Safe parsing of values with fallbacks to 0
      const sugar = entry.total?.totalSugar ? 
        parseFloat(entry.total.totalSugar) || 0 : 0;
      
      const protein = entry.total?.totalProtein ? 
        parseFloat(entry.total.totalProtein) || 0 : 0;
      
      const fat = entry.total?.totalFat ? 
        parseFloat(entry.total.totalFat) || 0 : 0;
      
      const carbs = entry.total?.totalCarbohydrates ? 
        parseFloat(entry.total.totalCarbohydrates) || 0 : 0;
      
      // Add values to the accumulator
      dateMap[displayDate].totalSugar += sugar;
      dateMap[displayDate].totalProtein += protein;
      dateMap[displayDate].totalFat += fat;
      dateMap[displayDate].totalCarbohydrates += carbs;
    });
  
    // Convert to array and sort by date
    const chartData = Object.values(dateMap);
    chartData.sort((a, b) => a.sortDate - b.sortDate);
    
    // Log the processed chart data for debugging
    console.log('Processed chart data:', chartData);
    
    // Remove the sortDate property as it's no longer needed for display
    return chartData.map(({ sortDate, ...rest }) => rest);
  };

  // Render the main component
  return (
    <div className="line-chart-container">
      {/* Component to display motivational words */}
      <MotivationalWordsCloud />
      <h2 className="chart-title">Nutrition Tracker</h2>
      
      {/* Display error message if there is one */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Display loading message while fetching data */}
      {loading ? (
        <p>Loading...</p>
      ) : nutritionData.length === 0 ? (
        <p>No valid nutrition data available. Please check your data source.</p>
      ) : (
        // Responsive container for the line chart
        <ResponsiveContainer width="90%" height={400}>
          <LineChart data={extractChartData()}>
            {/* X-axis representing days */}
            <XAxis dataKey="day" />
            {/* Y-axis for nutrient values */}
            <YAxis />
            {/* Tooltip for displaying information on hover */}
            <Tooltip content={<CustomTooltip />} />
            {/* Legend with increased size */}
            <Legend wrapperStyle={{ fontSize: '16px' }} />
            {/* Grid lines for better readability */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* Lines representing nutrient values over days */}
            <Line type="monotone" dataKey="totalSugar" stroke="#FFD700" name="Sugars" />
            <Line type="monotone" dataKey="totalProtein" stroke="#32CD32" name="Proteins" />
            <Line type="monotone" dataKey="totalFat" stroke="#FF6347" name="Fats" />
            <Line type="monotone" dataKey="totalCarbohydrates" stroke="#4169E1" name="Carbohydrates" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RenderBarChart;