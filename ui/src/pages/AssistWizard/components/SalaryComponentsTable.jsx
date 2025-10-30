import React from "react";
import { Typography, Card, Button, Switch } from "@material-tailwind/react";
import { toTitleCase } from "../../../constants/reusableFun";
import { useDispatch } from "react-redux";
import { SalaryComponentToggleAction } from "../../../redux/Action/Salary/SalaryAction";

const SalaryComponentsTable = ({ loading, components, setLocalComponents, setOpen }) => {
  const dispatch = useDispatch();
  const normalComponents = components.filter((c) => !c.isStatutory);

  const earnings = normalComponents.filter(
    (c) => c.category?.toLowerCase() === "earning"
  );
  const deductions = normalComponents.filter(
    (c) => c.category?.toLowerCase() === "deduction"
  );

  const handleToggle = (id) => {
    setLocalComponents([
      ...components.map((c) =>
        c._id === id ? { ...c, isActive: !c.isActive } : c
      ),
    ]);
    const toggled = components.find((c) => c._id === id);
    dispatch(
      SalaryComponentToggleAction({
        componentIds: [id],
        isActive: !toggled.isActive,
      })
    );
  };

  const renderTable = (title, list) => (
    <Card className="p-4 shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Typography variant="h6" className="font-semibold text-gray-800">
            {title}
          </Typography>
          <Typography variant="small" className="text-gray-600">
            Manage {title.toLowerCase()} components
          </Typography>
        </div>
        {title === "Earnings" && (
          <Button size="sm" color="blue" onClick={() => setOpen(true)}>
            + Add
          </Button>
        )}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-gray-600">Component</th>
            <th className="p-2 text-gray-600 w-24">Enabled</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2} className="p-2 text-center">
                Loading...
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-2 text-center text-gray-500">
                No components found
              </td>
            </tr>
          ) : (
            list.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-2">{toTitleCase(c.name)}</td>
                <td className="p-2">
                  <Switch checked={c.isActive} onChange={() => handleToggle(c._id)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );

  return (
    <div>
      {renderTable("Earnings", earnings)}
      {renderTable("Deductions", deductions)}
    </div>
  );
};

export default SalaryComponentsTable;
