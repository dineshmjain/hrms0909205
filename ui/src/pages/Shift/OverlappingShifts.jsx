import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { Checkbox } from "@material-tailwind/react";

export function OverlappingShifts({
  open,
  setOpen,
  shifts,
  selectedShift,
  assignShift,
  clearInfoAndCloseSidebar,
}) {
  const handleOpen = () => setOpen(!open);
  const handleClose = () => clearInfoAndCloseSidebar();

  const groupedShifts = shifts.reduce((acc, shift) => {
    const empId = shift.employee._id || shift.employee.id;
    if (!acc[empId]) {
      acc[empId] = {
        employee: shift.employee,
        entries: [],
      };
    }
    acc[empId].entries.push(shift);
    return acc;
  }, {});

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader>Overlapping Shifts Detected</DialogHeader>
      <DialogBody>
        The new Shift timings are overlapping with the following pre-assigned
        shifts. Proceeding will override the previous shifts with the new one.
        <br />
        <br />

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Employee
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Date & Current Shifts
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  New Shift
                </th>
                 <th className="border border-gray-300 px-4 py-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(groupedShifts).map((group) => (
                <tr key={group.employee._id}>
                  <td className="border border-gray-300 px-4 py-2 font-bold align-top">
                    {group.employee.name.firstName}{" "}
                    {group.employee.name.lastName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 align-top">
                    <ul className="list-disc pl-5 space-y-1">
                      {group.entries.map((shift) => (
                        <li key={shift._id}>
                          {format(new Date(shift.date), "EEE, dd/MM/yy")} —{" "}
                          {shift.currentShift.startTime} -{" "}
                          {shift.currentShift.endTime}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center align-top">
                    {selectedShift.startTime} - {selectedShift.endTime}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center align-top">
                    <Checkbox defaultChecked />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleClose}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={assignShift}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
