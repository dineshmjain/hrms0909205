import React from "react";
import {
  Dialog,
  Card,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";

const AddComponentDialog = ({
  open,
  setOpen,
  newComponent,
  setNewComponent,
  handleAdd,
}) => {
  return (
    <Dialog open={open} handler={() => setOpen(!open)}>
      <Card className="p-6 w-full max-w-md mx-auto">
        <Typography variant="h6" className="mb-4 font-semibold">
          Add New Component
        </Typography>
        <div className="flex flex-col gap-4">
          <Input
            label="Component Name"
            value={newComponent.name}
            onChange={(e) =>
              setNewComponent({ ...newComponent, name: e.target.value })
            }
          />
          <Select
            label="Type"
            value={newComponent.type}
            onChange={(val) => setNewComponent({ ...newComponent, type: val })}
          >
            <Option value="Earnings">Earnings</Option>
            <Option value="Deductions">Deductions</Option>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleAdd}>
            Save
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default AddComponentDialog;
