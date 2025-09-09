import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoCloseSharp } from "react-icons/io5";

// check below for example
const SideDrawer = ({
  customCss,
  onClose,
  heading,
  children,
  contentParentCss,
  bringToFront,
  isOpen,
}) => {
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      event.target.closest(".prevent-sidebar-close") === null // Ensure elements with this class don't trigger closing
    ) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Add event listener when the component mounts

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
  return createPortal(
    !isOpen ? (
      <></>
    ) : (
      <AnimatePresence>
        <div
          className={`fixed  z-50 w-[100%] h-[100dvh] top-[0px] font-poppins left-0 bg-[#00000047]  backdrop-blur-[0.5px] transition-smooth	  gap-2 `}
        >
          <motion.div
            key={heading}
            initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
            animate={{ x: 0, z: 40, opacity: 1 }} // Slides in to its position
            exit={{ x: "100%", opacity: 0 }} // Slides back out to the right
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 right-0 h-full w-[400px] maxsm:w-full  bg-gray-50 rounded-l-md maxsm:rounded-none ${customCss}`} // Fixed to right edge
          >
            <div
              className="flex flex-col p-4 maxsm:p-2 h-full gap-4  "
              ref={sidebarRef}
            >
              <div className="flex justify-between w-full gap-4 items-center ">
                <span></span>
                <span className="font-bold text-lg">{heading}</span>
                <IoCloseSharp
                  className="w-6 h-6 cursor-pointer"
                  onClick={onClose}
                />
              </div>
              <div
                className={`flex-1 flex flex-wrap gap-2 maxsm:w-full scrolls overflow-scroll  ${contentParentCss}`}
              >
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    ),
    document.body
  );
};

export default SideDrawer;
