import React, { useState, useEffect } from "react";
import { Typography, Card, Switch } from "@material-tailwind/react";
import { Clock, CalendarClock, Layers } from "lucide-react";

const options = [
  {
    id: "shifts",
    label: "Shifts",
    value: "Shifts",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "overtime",
    label: "Overtime",
    value: "Overtime",
    icon: <CalendarClock className="w-5 h-5" />,
  },
  {
    id: "both",
    label: "Both",
    value: "Both",
    icon: <Layers className="w-5 h-5" />,
  },
];

const ShiftOvertimeSelector = ({ value, onChange, disableToggle }) => {
  const [selected, setSelected] = useState(value || "");
  const [enabled, setEnabled] = useState(!!value);

  // Sync props value
  useEffect(() => {
    setSelected(value || "");
    setEnabled(!!value);
  }, [value]);

  const handleToggle = () => {
    if (!disableToggle) {
      const newEnabled = !enabled;
      setEnabled(newEnabled);
      if (!newEnabled) {
        setSelected("");
        onChange && onChange("");
      }
    }
  };

  const handleSelect = (val) => {
    setSelected(val);
    onChange && onChange(val);
  };

  return (
    <div className="md:col-span-3 flex flex-col gap-4">
      {/* Toggle */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="shift-overtime-toggle"
          className="text-gray-800 font-medium mr-10"
        >
          Does your organization use Shifts/Overtime/Both?
        </label>
        <Switch
          id="shift-overtime-toggle"
          checked={enabled}
          onChange={handleToggle}
          disabled={disableToggle}
        />
      </div>

      {/* Conditional selection UI */}
      {enabled && (
        <>
          <Typography variant="h6" className="font-semibold text-gray-800">
            Please select <span className="text-blue-600">Shifts</span>,{" "}
            <span className="text-blue-600">Overtime</span>, or{" "}
            <span className="text-blue-600">Both</span>
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((opt) => (
              <Card
                key={opt.id}
                shadow={selected === opt.value}
                className={`flex items-center gap-3 p-4 border cursor-pointer rounded-xl transition
                  ${
                    selected === opt.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }
                `}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.icon}
                <Typography
                  className={`font-medium ${
                    selected === opt.value ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </Typography>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShiftOvertimeSelector;
