// src/components/SalarySettings.jsx
import React from "react";
import { Typography, Card, Checkbox } from "@material-tailwind/react";

const SalarySettings = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="mb-4 text-center">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Salary Settings
        </Typography>
        <Typography
          variant="paragraph"
          className="text-gray-600 mx-auto max-w-2xl"
        >
          Configure salary components, allowances, and deductions for your
          organization.
        </Typography>
      </div>

      {/* Earnings */}
      <Card className="p-6 shadow-md">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
          Earnings
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox label="Basic Pay (Normal)" />
          <Checkbox label="House Rent Allowance (Normal)" />
          <Checkbox label="Dearness Allowance (Normal)" />
          <Checkbox label="Medical Allowance (Normal)" />
          <Checkbox label="Conveyance Allowance (Normal)" />
          <Checkbox label="Special Allowance (Normal)" />
          <Checkbox label="Bonus (Normal)" />
        </div>
      </Card>

      {/* Deductions */}
      <Card className="p-6 shadow-md">
        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
          Deductions
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox label="Unpaid Leave Deduction (Normal)" />
          <Checkbox label="Loan/Advance Recovery (Normal)" />
        </div>
      </Card>
    </div>
  );
};

export default SalarySettings;
