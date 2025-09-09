import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoCloseSharp } from "react-icons/io5";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";

// check below for example
const TaskModal = ({
  customCss,
  onClose,
  heading,
  children,
  contentParentCss,
  bringToFront,
  route = [],
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("keydown", handleEscape);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [children]);
  return createPortal(
    <div
      className={`fixed  ${
        bringToFront ? `z-50 ` : `z-50 `
      } w-[100%] top-0 font-poppins left-0 bg-[#00000093] h-[100vh] backdrop-blur-[1px]	 flex items-center justify-center flex-col gap-2 `}
    >
      <AnimatePresence>
        <motion.div
          key={heading}
          initial={{ scale: 0, opacity: 0 }} // Starts hidden and scaled down
          animate={{ scale: 1, opacity: 1 }} // Scales up and fades in when visible
          exit={{ scale: 0, opacity: 0 }} // Scales down and fades out when hidden
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div
            className={`flex flex-col bg-gray-100   w-[500px] max-h-[90vh] maxsm:max-w-[300px]  rounded-md ${customCss} `}
          >
            <div className="flex justify-between w-full gap-4  px-4 p-2 items-center border-b-[2px] border-gray-300 pb-2">
              <div className="flex gap-1 maxsm:hidden">
                {route?.map((routeData, rIdx) => {
                  return (
                    <div
                      className=" flex items-center text-gray-700 font-medium"
                      key={rIdx}
                    >
                      <TooltipMaterial content={routeData?.name}>
                        <span
                          className="max-w-[10ch] text-sm truncate cursor-pointer hover:bg-gray-300 p-1 rounded-md"
                          onClick={() => routeData?.link()}
                        >
                          {routeData?.name}
                        </span>
                      </TooltipMaterial>
                      {rIdx == route?.length - 1 || <span>/</span>}
                    </div>
                  );
                })}
              </div>
              <div className="hidden maxsm:flex"></div>
              <span className="font-bold text-lg capitalize">{heading}</span>
              <div className="p-1 rounded-md hover:bg-gray-300 flex items-center justify-center">
                <IoCloseSharp
                  className="w-6 h-6 cursor-pointer"
                  onClick={onClose}
                />
              </div>
            </div>

            <div
              className={`flex-1 flex flex-col gap-2  px-4 p-2 maxsm:max-w-[300px] scrolls overflow-scroll  ${contentParentCss}`}
            >
              {children}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default TaskModal;
