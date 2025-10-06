import React from "react";
import { Card, Typography, Switch } from "@material-tailwind/react";

const TdsToggleCard = ({ tdsEnabled, setTdsEnabled }) => {
  return (
    <Card className="p-4 shadow-md">
      <Typography variant="h6" className="mb-2 font-semibold text-gray-800">
        TDS (Tax Deducted at Source)
      </Typography>
      <div className="flex items-center justify-between">
        <Typography variant="small" className="text-gray-700">
          Enable TDS (calculated automatically as per slabs)
        </Typography>
        <Switch
          checked={tdsEnabled}
          onChange={() => setTdsEnabled(!tdsEnabled)}
        />
      </div>
    </Card>
  );
};

export default TdsToggleCard;
