import React from "react";
import { Typography, Input } from "@material-tailwind/react";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Address from "../../components/Address/Address"; // import Address component
const BranchSettings = ({
  formData,
  handleInputChange,
  branchList,
  setFinalData,
  setFormValidity,
  state,
}) => {
  return (
    <div className="flex w-full flex-col">
      <Typography className="text-primary font-semibold text-[18px] capitalize  ">
        Branch Settings
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2 ">
          <Address
            defaultAddressType="Branch Address"
            state={state}
            onChange={(data) =>
              setFinalData((prev) => ({
                ...prev,
                ...data,
              }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({
                ...prev,
                address: isValid,
              }))
            }
          />
        </div>
         <Typography className="text-primary font-medium text-[14px] capitalize ">
          Branch Timings
        </Typography>
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Start Time */}
          <div>
              <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Start Time
            </Typography>
            <Input
              type="time"
              value={formData.startTime || ""}
              className="bg-white text-gray-900 rounded-md"
              onChange={(e) => handleInputChange("startTime", e.target.value)}
            />
          </div>

          {/* End Time */}
          <div>
              <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              End Time
            </Typography>
            <Input
              type="time"
              value={formData.endTime || ""}
              className="bg-white text-gray-900 rounded-md"
              onChange={(e) => handleInputChange("endTime", e.target.value)}
            />
          </div>

          {/* Max In */}
          <div>
                <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Max In
            </Typography>
            <Input
              type="time"
              value={formData.maxIn || ""}
              className="bg-white text-gray-900 rounded-md"
              onChange={(e) => handleInputChange("maxIn", e.target.value)}
            />
          </div>

          {/* Min Out */}
          <div>
                <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Min Out
            </Typography>
            <Input
              type="time"
              value={formData.minOut || ""}
              className="bg-white text-gray-900 rounded-md"
              onChange={(e) => handleInputChange("minOut", e.target.value)}
            />
          </div>
        </div>
        {/* Week Off */}
        <div className="col-span-1 md:col-span-2">
        <Typography className="text-primary mb-4 font-medium text-[14px] capitalize ">
            Week Off
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <label
                key={day}
                className={`cursor-pointer p-3 border rounded-md text-center ${
                  formData.weekOff?.includes(day)
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.weekOff?.includes(day) || false}
                  onChange={(e) => {
                    let updatedWeekOff = [...(formData.weekOff || [])];
                    if (e.target.checked) {
                      updatedWeekOff.push(day);
                    } else {
                      updatedWeekOff = updatedWeekOff.filter((d) => d !== day);
                    }
                    handleInputChange("weekOff", updatedWeekOff);
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchSettings;
