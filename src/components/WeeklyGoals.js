import '../css/Progress.css';
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { startOfWeek, isSameDay } from 'date-fns';
import Select from 'react-select';
import activityOptions from '../data/ActivityOptions';

function WeeklyGoals({ currentWeek, activityProgressApiData }) {
  const [durationGoal, setDurationGoal] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState({});
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [weeklyGoalsChartData, setWeeklyGoalsChartData] = useState([]);

  const options = activityOptions.map((option) => ({
    value: option.activity,
    label: option.activity,
  }));

  const calculateWeeklyPieChart = () => {
    let weeklyTotals = {
      weeklyGoal: {},
      progress: {},
    };

    weeklyGoals.forEach((weeklyGoal) => {
      const activityDate = new Date(weeklyGoal.date);
      const weekStart = startOfWeek(activityDate);
      const doesWeekStartMatchCurrentWeek = isSameDay(weekStart, currentWeek);

      if (doesWeekStartMatchCurrentWeek) {
        if (weeklyTotals.weeklyGoal[weeklyGoal.activity] === undefined) {
          weeklyTotals.weeklyGoal[weeklyGoal.activity] = 0;
        }
        weeklyTotals.weeklyGoal[weeklyGoal.activity] += weeklyGoal.duration;
      }
    });

    activityProgressApiData.forEach((activity) => {
      const activityDate = new Date(activity.date);
      const weekStart = startOfWeek(activityDate);
      const doesWeekStartMatchCurrentWeek = isSameDay(weekStart, currentWeek);

      if (doesWeekStartMatchCurrentWeek) {
        if (weeklyTotals.progress[activity.activity] === undefined) {
          weeklyTotals.progress[activity.activity] = 0;
        }
        weeklyTotals.progress[activity.activity] += activity.duration;
      }
    });

    const multiplePieCharts = [];

    for (const activity in weeklyTotals.weeklyGoal) {
      const pieChartTotals = [['Task', 'Value']];
      pieChartTotals.push([`${activity} Goal`, weeklyTotals.weeklyGoal[activity]]);
      if (
        weeklyTotals.progress !== undefined &&
        weeklyTotals.progress[activity] !== undefined
      ) {
        pieChartTotals.push([`${activity} Progress`, weeklyTotals.progress[activity]]);
      }
      const dataForPieCharts = {
        chartTitle: `${activity} Goals`,
        data: pieChartTotals,
      };
      multiplePieCharts.push(dataForPieCharts);
    }
    return multiplePieCharts;
  };

  const handleInput = (e) => {
    setDurationGoal(parseInt(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedActivity.label) {
      alert("Please select an activity");
      return;
    }
  
    const goal = {
      date: new Date().toISOString().split('T')[0],
      activity: selectedActivity.label,
      duration: durationGoal,
    };
  
    const updatedGoals = [...weeklyGoals, goal];
    setWeeklyGoals(updatedGoals);
    localStorage.setItem('weeklyGoals', JSON.stringify(updatedGoals));
    setDurationGoal(0);
    setSelectedActivity({});
  };  

  const handleChange = (selectedOption) => {
    setSelectedActivity(selectedOption);
  };

  const fetchGoalsFromLocalStorage = () => {
    const storedGoals = JSON.parse(localStorage.getItem('weeklyGoals')) || [];
    setWeeklyGoals(storedGoals);
  };

  useEffect(() => {
    fetchGoalsFromLocalStorage();
  }, []);

  useEffect(() => {
    if (weeklyGoals.length > 0) {
      const updatedChartInfo = calculateWeeklyPieChart();
      setWeeklyGoalsChartData(updatedChartInfo);
    }
  }, [weeklyGoals, currentWeek]);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#8271e5',
    }),
  };

  return (
    <div className="container-wrapper">
      <div className="WeeklyGoals">
        <div className="weekly-goals-container">
          <div className="custom-select">
            <p>Select An Activity</p>
            <Select
              options={options}
              onChange={handleChange}
              styles={customStyles}
              value={selectedActivity}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="Duration">Duration</label>
            <input
              id="Duration"
              type="number"
              value={durationGoal}
              onChange={handleInput}
              min="1"
            />
            <br />
            <button type="submit">Save Your Goal</button>
          </form>
        </div>
      </div>

      <div className="weekly-goals-container">
        {weeklyGoalsChartData.map((pieChartData) => (
          <div key={pieChartData.chartTitle}>
            <Chart
              chartType="PieChart"
              data={pieChartData.data}
              options={{
                title: pieChartData.chartTitle,
                legend: 'top',
                chartArea: { width: '65%' },
                pieHole: 0.3,
                is3D: false,
                backgroundColor: '#f5f7fa',
                slices: {
                  0: {
                    color: '#3498db',
                    textStyle: { color: '#333', fontSize: 15, bold: true },
                  },
                  1: {
                    color: '#f1c40f',
                    textStyle: { color: '#333', fontSize: 15, bold: true },
                  },
                },
                tooltip: {
                  showColorCode: true,
                },
                titleTextStyle: { color: '#f68a3c', fontSize: 20, bold: false },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyGoals;
