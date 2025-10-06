import React from "react";
import { Typography, Card, Button, Switch } from "@material-tailwind/react";
import { toTitleCase } from "../../../constants/reusableFun";
import { useDispatch } from "react-redux";
import { SalaryComponentToggleAction } from "../../../redux/Action/Salary/SalaryAction";

const SalaryComponentsTable = ({ loading, components, setLocalComponents, setOpen }) => {
  const dispatch = useDispatch();
  const normalComponents = components.filter((c) => !c.isStatutory);

  const handleToggle = (i) => {
    const component = normalComponents[i];
    setLocalComponents([
      ...components.map((c) =>
        c._id === component._id ? { ...c, isActive: !c.isActive } : c
      ),
    ]);
    dispatch(
      SalaryComponentToggleAction({
        componentIds: [component._id],
        isActive: !component.isActive,
      })
    );
  };

  return (
    <Card className="p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h6" className="font-semibold text-gray-800">
            Salary Components
          </Typography>
          <Typography variant="small" className="text-gray-600">
            Manage earnings & deductions
          </Typography>
        </div>
        <Button size="sm" color="blue" onClick={() => setOpen(true)}>
          + Add
        </Button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-gray-600">Component</th>
            <th className="p-2 text-gray-600">Type</th>
            <th className="p-2 text-gray-600 w-24">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3}>Loading...</td>
            </tr>
          ) : (
            normalComponents.map((c, i) => (
              <tr key={c._id || i} className="border-b">
                <td className="p-2">{toTitleCase(c.name)}</td>
                <td className="p-2">{toTitleCase(c.category)}</td>
                <td className="p-2">
                  <Switch
                    checked={c.isActive}
                    onChange={() => handleToggle(i)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default SalaryComponentsTable;
