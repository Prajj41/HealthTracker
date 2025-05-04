import '../css/Activity.css';
import { useState, useEffect } from 'react';
import ActivityLog from './ActivityLog';
import activityService from '../services/activityService';
import ActivityDateFilter from './ActivityDateFilter';
import getStandardizedDate from '../utils/getStandardizedDate';

function ActivityDashboard({ userInfo }) {
  // State to track Selected Date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State to track activities logged
  const [activities, setActivities] = useState([]);

  // To initialize Activity Log to display today's activity
  useEffect(() => {
    activityService.getActivities().then((data) => {
      setActivities(Array.isArray(data) ? data : []);
    });
  }, []);

  // To filter activities based on the selected date
  const filteredActivities = activities.filter(
    (activity) => activity.date === getStandardizedDate(selectedDate)
  );

  // To handle day click on the DayPicker
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="activity-dashboard">
      <h2>Activity Log</h2>
      <div className="activity-log-container">
        <div className="activity-content">
          <ActivityDateFilter
            selectedDate={selectedDate}
            onDayClick={handleDayClick}
          />
          <ActivityLog
            filteredActivities={filteredActivities}
            setActivities={setActivities}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default ActivityDashboard;
