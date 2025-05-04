import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import '../css/Activity.css';

function ActivityDateFilter({ selectedDate, onDayClick }) {
  let footerText = 'Click on a date to see activities logged for that day.';
  let date;
  if (selectedDate) {
    date = format(selectedDate, 'PPPP');
    footerText = '';
  } else {
    date = format(new Date(), 'PPPP');
  }

  return (
    <div className="DateFilter">
      <div className="selected-date">{date}</div>
      <DayPicker
        showOutsideDays
        fixedWeeks
        mode="single"
        selected={selectedDate}
        onSelect={(date) => onDayClick(date)}
        className="activity-calendar"
      />
      {footerText && <p className="pick">{footerText}</p>}
    </div>
  );
}

export default ActivityDateFilter;
