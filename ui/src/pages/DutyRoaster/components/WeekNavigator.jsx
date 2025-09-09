import { useState, useRef, useEffect } from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

const WeekNavigator = ({ fromDate, toDate, setWeekOffset }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  // close picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Date Picker Popover */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute top-14 left-1/2 transform -translate-x-1/2 z-30 
                     bg-white shadow-xl rounded-lg p-3 border border-gray-200 
                     transition-all duration-200 animate-fade-in"
        >
          <DatePicker
            selected={fromDate.toDate()}
            onChange={(date) => {
              const diff = moment(date)
                .startOf("isoWeek")
                .diff(moment().startOf("isoWeek"), "weeks");
              setWeekOffset(diff);
              setShowPicker(false);
            }}
            inline
            calendarStartDay={1}
          />
        </div>
      )}

      {/* Week Navigation */}
      <div className="flex justify-center items-center gap-4 mb-2 relative">
        <IconButton
          size="sm"
          variant="filled"
          className="bg-primary"
          onClick={() => setWeekOffset((o) => o - 1)}
        >
          <PiCaretLeftBold className="text-white" />
        </IconButton>

        <div
          onClick={() => setShowPicker((p) => !p)}
          className="cursor-pointer relative px-3 py-1 border border-gray-300 
                     rounded hover:bg-gray-50 bg-white shadow-sm"
        >
          <Typography variant="small" color="gray">
            {fromDate.format("MMM D, YYYY")} – {toDate.format("MMM D, YYYY")}
          </Typography>
        </div>

        <IconButton
          size="sm"
          variant="filled"
          className="bg-primary"
          onClick={() => setWeekOffset((o) => o + 1)}
        >
          <PiCaretRightBold className="text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default WeekNavigator;
