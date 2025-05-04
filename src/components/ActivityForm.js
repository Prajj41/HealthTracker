function ActivityForm({
  activityInput,
  onFormChange,
  onFormSubmit,
  activityOptions,
  selectedActivity,
  onActivityTypeChange,
}) {
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    if (type === 'number') {
      processedValue = value !== '' ? Math.round(value) : '';
    }

    onFormChange(name, processedValue);
  };

  const handleActivityChange = (e) => {
    const selectedValue = e.target.value;
    const selected = activityOptions.find(
      (option) => option.activity === selectedValue
    );
    onActivityTypeChange(selected || { activity: '', intensity: '' });
  };

  return (
    <form className="activity-form" onSubmit={onFormSubmit}>
      <fieldset>
        <legend>Activity Log</legend>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={activityInput.date}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Activity:
          <select
            name="type"
            value={selectedActivity.activity || ''}
            onChange={handleActivityChange}
            required
          >
            <option value="">Select an activity</option>
            {activityOptions.map((option) => (
              <option key={option.activity} value={option.activity}>
                {option.activity}
              </option>
            ))}
          </select>
        </label>

        <label>Intensity: {selectedActivity.intensity || 'N/A'}</label>

        <label>
          Duration (minutes):
          <input
            type="number"
            name="duration"
            min="1"
            value={activityInput.duration}
            onChange={handleInputChange}
            required
          />
        </label>

        <p className="calories-burned">
          Calories burned will be automatically calculated once you submit.
        </p>

        <button className="submit-button" type="submit">
          Submit
        </button>
      </fieldset>
    </form>
  );
}

export default ActivityForm;
