import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoCloseSharp } from "react-icons/io5";

export function Modal({
  size,
  handleOpen,
  children,
  heading,
  onClose,
  contentCss,
  open = true,
}) {
  //   const [size, setSize] = React.useState(null);

  return (
    <>
      <Dialog
        open={open}
        className="font-inter "
        size={size || "md"}
        handler={handleOpen}
      >
        <div className="flex justify-between p-2 text-gray-900 border-b-2 border-gray-300">
          <div className=""></div>
          <span className="font-semibold text-md ">{heading}</span>
          <div
            className="text-black cursor-pointer p-1 hover:bg-gray-200 rounded-md"
            onClick={onClose}
          >
            <IoCloseSharp className="w-5 h-5" />
          </div>
        </div>
        <DialogBody
          className={`font-inter text-gray-900 flex flex-col items-start justify-start w-full ${(contentCss =
            "w-full")}`}
        >
          {children}
        </DialogBody>
      </Dialog>
    </>
  );
}
