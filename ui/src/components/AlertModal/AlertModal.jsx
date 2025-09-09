import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 
export default function AlertModal({status,header,message,cancel,confirm}) {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
 
  return (

      <Dialog
        open={status}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>{header}</DialogHeader>
        <DialogBody>
      {message}
        </DialogBody>
        <DialogFooter>
          
          <Button
            variant="text"
            color="red"
            onClick={cancel}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>

          <Button variant="gradient" color="gray" onClick={confirm}>
            <span>Ok</span>
          </Button>
        </DialogFooter>
      </Dialog>
    
  );
}