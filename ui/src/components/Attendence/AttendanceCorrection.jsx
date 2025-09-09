import React, { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Input } from "@material-tailwind/react";
import moment from "moment";

const AttendanceCorrection = ({ logData, onClose }) => {
  const [formData, setFormData] = useState(logData);
  
  const handleChange = (e) => {
    let { name, value } = e?.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (logData) {
      setFormData(logData);
    }
  }, [logData]);
  return (
    <Modal
      size={"sm"}
      open={logData ?? false}
      heading={"Attendance correction"}
      onClose={onClose}
    >
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="flex flex-col gap-2 w-[250px] maxsm:w-full text-sm">
          <span className="font-medium">Punch Type:</span>
          <div
            className={`flex gap-2 bg-gray-200 rounded-md p-1  justify-evenly`}
          >
            <input
              type="radio"
              name="type"
              id="OneTime"
              className={`bg-gray-200 mr-2 hidden `}
              value={`checkIn`}
              checked={formData?.type == "checkIn"}
              onChange={(e) => handleChange(e)}
            />
            <label
              htmlFor="OneTime"
              className={`w-[50%] text-center cursor-pointer p-1 ${
                formData?.type == "checkIn" && `bg-blue-800 text-blue-50`
              } rounded-md `}
            >
              Check In
            </label>
            <input
              type="radio"
              name="type"
              id="Daily"
              className="bg-gray-400 mr-2 hidden"
              value={`checkOut`}
              checked={formData?.type == "checkOut"}
              onChange={(e) => handleChange(e)}
            />
            <label
              htmlFor="Daily"
              className={`w-[50%] text-center cursor-pointer p-1 transition-all duration-300 ease-in ${
                formData?.type == "checkOut" && `bg-orange-800 text-orange-50`
              } rounded-md `}
            >
              Check Out
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-[250px] maxsm:w-full text-sm">
          <span className="font-medium">Date and Time:</span>
          <div className="w-full flex gap-2 bg-gray-200 px-2 h-9 rounded-md">

            <input
              type="time"
              className="bg-transparent w-full"
              value={moment(formData?.transactionDate)?.format("HH:mm")}
              onChange={(e) => {}}
            
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceCorrection;
