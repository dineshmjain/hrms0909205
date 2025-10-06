import React from "react";
import { Card, Typography, Input, Switch } from "@material-tailwind/react";
import { toTitleCase } from "../../../constants/reusableFun";
import { useDispatch } from "react-redux";
import { SalaryComponentToggleAction, SalaryComponentUpdateAction } from "../../../redux/Action/Salary/SalaryAction";

const StatutoryPercentageTable = ({ components, setLocalComponents }) => {
  const dispatch = useDispatch();
  const percentageStatutory = components.filter(
    (c) =>
      c.isStatutory &&
      (c.name.toLowerCase().includes("provident fund") ||
        c.name.toLowerCase().includes("state insurance"))
  );

  const handleChange = (id, field, subfield, value) => {
    const component = components.find((c) => c._id === id);
    const updated = { ...component.statutoryDetails };
    const parsed = parseFloat(value);

    if (subfield) {
      updated.contribution = {
        ...updated.contribution,
        [subfield]: isNaN(parsed) ? null : parsed,
      };
    } else {
      updated[field] = isNaN(parsed) ? null : parsed;
    }

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
        Statutory (Percentage-based)
      </Typography>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-gray-600">Component</th>
            <th className="p-2 text-gray-600">Employee %</th>
            <th className="p-2 text-gray-600">Employer %</th>
            <th className="p-2 text-gray-600">Limit (₹)</th>
            <th className="p-2 text-gray-600 w-20">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {percentageStatutory.map((c) => (
            <tr key={c._id} className="border-b">
              <td className="p-2">{toTitleCase(c.name)}</td>
              <td className="p-2 w-20">
                <Input
                  type="number"
                  value={c.statutoryDetails?.contribution?.employee ? c.statutoryDetails.contribution.employee * 100 : ""}
                  onChange={(e) =>
                    handleChange(c._id, "contribution", "employee", e.target.value / 100)
                  }
                  onBlur={() => handleBlur(c._id)}
                  disabled={!c.isActive}
                />
              </td>
              <td className="p-2 w-20">
                <Input
                  type="number"
                  value={c.statutoryDetails?.contribution?.employer ? c.statutoryDetails.contribution.employer * 100 : ""}
                  onChange={(e) =>
                    handleChange(c._id, "contribution", "employer", e.target.value / 100)
                  }
                  onBlur={() => handleBlur(c._id)}
                  disabled={!c.isActive}
                />
              </td>
              <td className="p-2 w-28">
                <Input
                  type="number"
                  value={c.statutoryDetails?.limit ?? ""}
                  onChange={(e) => handleChange(c._id, "limit", null, e.target.value)}
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

export default StatutoryPercentageTable;
