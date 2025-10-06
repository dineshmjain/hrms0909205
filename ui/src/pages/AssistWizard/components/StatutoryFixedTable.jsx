import React from "react";
import { Card, Typography, Input, Switch } from "@material-tailwind/react";
import { toTitleCase } from "../../../constants/reusableFun";
import { useDispatch } from "react-redux";
import {
  SalaryComponentToggleAction,
  SalaryComponentUpdateAction,
} from "../../../redux/Action/Salary/SalaryAction";

const StatutoryFixedTable = ({ components, setLocalComponents }) => {
  const dispatch = useDispatch();

  const fixedStatutory = components.filter(
    (c) =>
      c.isStatutory &&
      (c.name.toLowerCase().includes("professional tax") ||
        c.name.toLowerCase().includes("labour welfare fund"))
  );

  const handleChange = (id, value) => {
    const component = components.find((c) => c._id === id);
    const updated = { ...component.statutoryDetails, amount: parseFloat(value) || null };

    setLocalComponents(
      components.map((c) =>
        c._id === id ? { ...c, statutoryDetails: updated } : c
      )
    );
  };

  const handleBlur = (id) => {
    const comp = components.find((c) => c._id === id);
    dispatch(
      SalaryComponentUpdateAction({
        componentId: id,
        statutoryDetails: comp.statutoryDetails,
      })
    );
  };

  const toggle = (id) => {
    setLocalComponents(
      components.map((c) =>
        c._id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
    const comp = components.find((c) => c._id === id);
    dispatch(
      SalaryComponentToggleAction({
        componentIds: [id],
        isActive: !comp.isActive,
      })
    );
  };

  return (
    <Card className="p-4 shadow-md">
      <Typography variant="h6" className="mb-2 font-semibold text-gray-800">
        Statutory (Fixed-value)
      </Typography>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-gray-600">Component</th>
            <th className="p-2 text-gray-600">Amount (₹)</th>
            <th className="p-2 text-gray-600 w-20">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {fixedStatutory.map((c) => (
            <tr key={c._id} className="border-b">
              <td className="p-2">{toTitleCase(c.name)}</td>
              <td className="p-2 w-28">
                <Input
                  type="number"
                  value={c.statutoryDetails?.amount ?? ""}
                  onChange={(e) => handleChange(c._id, e.target.value)}
                  onBlur={() => handleBlur(c._id)}
                  disabled={!c.isActive}
                />
              </td>
              <td className="p-2">
                <Switch checked={c.isActive} onChange={() => toggle(c._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default StatutoryFixedTable;
