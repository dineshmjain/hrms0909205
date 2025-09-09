import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
const AttendanceAccordion = ({ data, onClose }) => {
  if (!data) return null;

  const dateDisplay = data[0]?.transactionDate
    ? new Date(data[0].transactionDate).toLocaleDateString("en-GB")
    : "Unknown Date";

  return (
    <div className="border rounded bg-white shadow p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          Details for{" "}
          {new Date(data.transactionDate).toLocaleDateString("en-GB")}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600">
          Close
        </button>
      </div>

      <p>
        <strong>Shift Name:</strong> {data.shiftName}
      </p>
      <p>
        <strong>Shift Time:</strong> {data.startTime} - {data.endTime}
      </p>
      <p>
        <strong>Status:</strong> {data.approvalStatus}
      </p>
      <p>
        <strong>Working Hours:</strong> {data.workingHours}
      </p>
      <p>
        <strong>Break Minutes:</strong> {data.breakMinutes}
      </p>

      <div className="mt-4">
        <h4 className="font-semibold mb-1">Transactions:</h4>
        {data.transactions?.map((txn) => (
          <div key={txn._id} className="mt-2 border-t pt-2">
            <p>
              <strong>Type:</strong> {txn.type}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(txn.transactionDate).toLocaleTimeString()}
            </p>
            <p>
              <strong>Location:</strong> {txn.geoLocation?.address}
            </p>
            <img
              src={txn.imagePath}
              alt="Transaction"
              className="h-24 rounded border mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceAccordion;
