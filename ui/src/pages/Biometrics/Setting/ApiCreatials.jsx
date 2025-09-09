import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import Header from "../../../components/header/Header";

const ApiCreatials = () => {
  const [appKey, setAppKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleSave = () => {
    console.log("App Key:", appKey);
    console.log("Secret Key:", secretKey);
    // Save logic (API, local storage, etc.)
    setOpen(false);
  };

  return (
    <div >
         <Card className="w-full max-w-lg self-start">
        <CardHeader floated={false} shadow={false} className="px-6 py-4 flex justify-between items-center">
          <Typography variant="h5" color="blue-gray">
            API Credentials
          </Typography>
          <Button size="sm" onClick={handleOpen}>
            Edit
          </Button>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="font-medium">
              App Key
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              {appKey ? "•••••••••••••••" : "Not set"}
            </Typography>
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="font-medium">
              Secret Key
            </Typography>
            <Typography variant="paragraph" className="text-gray-600">
              {secretKey ? "•••••••••••••••" : "Not set"}
            </Typography>
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Edit API Credentials</DialogHeader>
        <DialogBody divider className="flex flex-col gap-6">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
              App Key
            </Typography>
            <Input
              type="text"
              placeholder="Enter your App Key"
              value={appKey}
              onChange={(e) => setAppKey(e.target.value)}
              crossOrigin={undefined}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
              Secret Key
            </Typography>
            <Input
              type="password"
              placeholder="Enter your Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              crossOrigin={undefined}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="text" color="red" onClick={handleOpen}>
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ApiCreatials;
