import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography } from '@material-tailwind/react';

const CalendarFromStartDate = ({ startDate }) => {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (!startDate) return;

    const start = moment(startDate);
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = start.clone().add(i, 'days');
      weekDays.push({
        date: day.format('YYYY-MM-DD'),
        day: day.format('ddd'),
        value: day.format('D'),
      });
    }

    setDays(weekDays);
    setMonth(start.format('MMMM'));
    setYear(start.format('YYYY'));
  }, [startDate]);

  return (
    <div className="w-full max-w-md p-4 border rounded shadow">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((d) => (
          <div
            key={d.date}
            className="text-center text-sm font-medium p-2 bg-blue-gray-100 rounded"
          >
            <div className="text-blue-gray-800">{d.day}</div>
            <div className="text-black">{d.value}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-2">
        <Typography variant="h6">{month} {year}</Typography>
      </div>
    </div>
  );
};

export default CalendarFromStartDate;
