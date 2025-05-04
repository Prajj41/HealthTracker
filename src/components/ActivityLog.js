import React, { useState, useEffect } from 'react';

function ActivityLog() {
  const activityOptions = [
    { activity: 'Walking', intensity: 'Low' },
    { activity: 'Running', intensity: 'High' },
    { activity: 'Cycling', intensity: 'Medium' },
    { activity: 'Swimming', intensity: 'High' },
    { activity: 'Yoga', intensity: 'Low' },
    { activity: 'Hiking', intensity: 'Medium' },
    { activity: 'Jump Rope', intensity: 'High' },
    { activity: 'Dancing', intensity: 'Medium' },
    { activity: 'Weight Training', intensity: 'High' },
    { activity: 'Pilates', intensity: 'Low' },
    { activity: 'Rowing', intensity: 'High' },
    { activity: 'Elliptical Trainer', intensity: 'Medium' },
    { activity: 'Zumba', intensity: 'High' },
    { activity: 'Skating', intensity: 'Medium' },
    { activity: 'Martial Arts', intensity: 'High' },
    { activity: 'Tai Chi', intensity: 'Low' },
    { activity: 'Stair Climbing', intensity: 'High' },
    { activity: 'Stretching', intensity: 'Low' },
  ];

  const calculateCalories = (intensity, duration) => {
    const rates = { Low: 3, Medium: 5, High: 8 };
    return duration * (rates[intensity] || 0);
  };

  const generateSampleActivities = () => {
    const sample = [];
    for (let i = 0; i < 15; i++) {
      const randomOption = activityOptions[Math.floor(Math.random() * activityOptions.length)];
      const duration = Math.floor(Math.random() * 60) + 10;
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];
      const caloriesBurned = calculateCalories(randomOption.intensity, duration);

      sample.push({
        date: formattedDate,
        type: randomOption.activity,
        intensity: randomOption.intensity,
        duration,
        caloriesBurned,
      });
    }
    return sample;
  };

  const [activities, setActivities] = useState(() => {
    const storedActivities = localStorage.getItem('activities');
    if (storedActivities) {
      try {
        const parsed = JSON.parse(storedActivities);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    } else {
      const sample = generateSampleActivities();
      localStorage.setItem('activities', JSON.stringify(sample));
      return sample;
    }
  });

  const [formInput, setFormInput] = useState({
    date: '',
    type: '',
    intensity: '',
    duration: '',
    caloriesBurned: 0,
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityTypeChange = (activity) => {
    setFormInput((prev) => ({
      ...prev,
      type: activity.activity,
      intensity: activity.intensity,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { date, type, intensity, duration } = formInput;

    // Validate form fields
    if (!date || !type || !intensity || !duration) {
      alert('Please fill all fields.');
      return;
    }

    const caloriesBurned = calculateCalories(intensity, Number(duration));
    const newActivity = { date, type, intensity, duration: Number(duration), caloriesBurned };

    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));

    // Reset form
    setFormInput({
      date: '',
      type: '',
      intensity: '',
      duration: '',
      caloriesBurned: 0,
    });
  };

  const handleRemove = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '1.5rem',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', sans-serif",
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      padding: '0.75rem',
      background: '#0077ff',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: '0.3s',
    },
    heading: {
      marginTop: '2rem',
      marginBottom: '1rem',
      fontSize: '1.5rem',
      color: '#333',
    },
    list: {
      listStyle: 'none',
      padding: '0',
    },
    listItem: {
      background: '#f5f5f5',
      padding: '0.75rem',
      marginBottom: '0.5rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badge: (intensity) => {
      const colors = {
        Low: '#34c759',
        Medium: '#ff9500',
        High: '#ff3b30',
      };
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '6px',
        background: colors[intensity] || '#ccc',
        color: '#fff',
        fontSize: '0.75rem',
        marginLeft: '8px',
      };
    },
    removeButton: {
      background: '#ff3b30',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '2px 6px',
      cursor: 'pointer',
      marginLeft: '10px',
      fontSize: '0.75rem',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="date"
          name="date"
          value={formInput.date}
          onChange={handleFormChange}
          style={styles.input}
          required
        />

        <select
          value={formInput.type}
          onChange={(e) => {
            const selected = activityOptions.find((act) => act.activity === e.target.value);
            if (selected) handleActivityTypeChange(selected);
          }}
          style={styles.input}
          required
        >
          <option value="">Select activity</option>
          {activityOptions.map((option) => (
            <option key={option.activity} value={option.activity}>
              {option.activity}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="duration"
          value={formInput.duration}
          onChange={handleFormChange}
          placeholder="Duration (min)"
          min="1"
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Add Activity
        </button>
      </form>

      <h3 style={styles.heading}>Activities Recorded</h3>
      <ul style={styles.list}>
        {activities.map((act, idx) => (
          <li key={idx} style={styles.listItem}>
            <div>
              <strong>{act.date}</strong> — {act.type}
              <span style={styles.badge(act.intensity)}>{act.intensity}</span> for {act.duration} mins —{' '}
              <strong>{act.caloriesBurned} cal</strong>
            </div>
            <button onClick={() => handleRemove(idx)} style={styles.removeButton}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog;
