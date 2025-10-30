
import React, { useState, useEffect } from "react";
import { Typography, Checkbox, Card } from "@material-tailwind/react";
import { Clock, CalendarClock, CheckCircle } from "lucide-react";

const ShiftOvertimeSelector = ({ value, onChange, disableToggle, existingShifts, existingOT }) => {
  const [shiftChecked, setShiftChecked] = useState(false);
  const [otChecked, setOtChecked] = useState(false);

  // Initialize from prop value
  useEffect(() => {
    if (value) {
      if (value === "Shifts") {
        setShiftChecked(true);
        setOtChecked(false);
      } else if (value === "Overtime") {
        setShiftChecked(false);
        setOtChecked(true);
      } else if (value === "Both") {
        setShiftChecked(true);
        setOtChecked(true);
      }
    } else {
      setShiftChecked(false);
      setOtChecked(false);
    }
  }, [value]);

  const handleShiftChange = (checked) => {
    setShiftChecked(checked);

    if (checked && otChecked) {
      onChange && onChange("Both");
    } else if (checked && !otChecked) {
      onChange && onChange("Shifts");
    } else if (!checked && otChecked) {
      onChange && onChange("Overtime");
    } else {
      onChange && onChange("");
    }
  };

  const handleOtChange = (checked) => {
    setOtChecked(checked);

    if (shiftChecked && checked) {
      onChange && onChange("Both");
    } else if (!shiftChecked && checked) {
      onChange && onChange("Overtime");
    } else if (shiftChecked && !checked) {
      onChange && onChange("Shifts");
    } else {
      onChange && onChange("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h5" className="font-bold text-gray-800">
        Shift & Overtime Configuration
      </Typography>

      <Typography className="text-gray-600 mb-2">
        Select whether your organization uses Shifts, Overtime, or both. Based
        on your selection, you'll configure the relevant settings.
      </Typography>

      {/* Info Messages */}
      {/* {existingShifts && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <Typography className="text-sm font-semibold text-blue-800 mb-1">
              Shifts Already Configured
            </Typography>
            <Typography className="text-sm text-blue-700">
              Your organization already has shifts set up. You can view and manage them below, or select "Overtime" or "Both" to configure additional settings.
            </Typography>
          </div>
        </div>
      )}

      {existingOT && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <Typography className="text-sm font-semibold text-green-800 mb-1">
              Overtime Policies Already Configured
            </Typography>
            <Typography className="text-sm text-green-700">
              Your organization already has overtime policies set up. You can view and manage them below.
            </Typography>
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shift Card */}
        <Card
          className={`p-6 border-2 transition-all cursor-pointer ${
            shiftChecked
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => handleShiftChange(!shiftChecked)}
        >
          <div className="flex items-start gap-4">
            <Checkbox
              checked={shiftChecked}
              onChange={(e) => handleShiftChange(e.target.checked)}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Shifts
                  {existingShifts && (
                    <span className="ml-2 text-xs font-normal text-blue-600">(Configured)</span>
                  )}
                </Typography>
              </div>
              <Typography className="text-sm text-gray-600">
                Configure multiple work shifts for your organization with
                different timings and schedules.
              </Typography>
            </div>
          </div>
        </Card>

        {/* Overtime Card */}
        <Card
          className={`p-6 border-2 transition-all cursor-pointer ${
            otChecked
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => handleOtChange(!otChecked)}
        >
          <div className="flex items-start gap-4">
            <Checkbox
              checked={otChecked}
              onChange={(e) => handleOtChange(e.target.checked)}
              className="mt-1"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-6 h-6 text-blue-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Overtime
                  {existingOT && (
                    <span className="ml-2 text-xs font-normal text-green-600">(Configured)</span>
                  )}
                </Typography>
              </div>
              <Typography className="text-sm text-gray-600">
                Set up overtime policies, rates, and rules for employees working
                beyond regular hours.
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Selection Summary */}
      {(shiftChecked || otChecked) && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Typography className="text-sm font-medium text-blue-800">
            {shiftChecked &&
              otChecked &&
              "✓ You'll configure both Shifts and Overtime settings"}
            {shiftChecked && !otChecked && "✓ You'll configure Shift settings"}
            {!shiftChecked &&
              otChecked &&
              "✓ You'll configure Overtime settings"}
          </Typography>
        </div>
      )}

      {!shiftChecked && !otChecked && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Typography className="text-sm text-gray-600">
            No selection made. You can skip this step and proceed to Employee Upload.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ShiftOvertimeSelector;
