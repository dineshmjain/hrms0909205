import React from "react";
import { IoPersonAdd, IoPersonRemove } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import Chips from "../Chips/Chips";

const SingleLine = ({ handleClick, emp, idx, type, serchValue = "", css }) => {
  let color = {
    dept: "bg-pink-600",
    designation: "bg-green-600",
    emp: "bg-orange-800",
  };

  const getFullName = (emp) => {
    switch (emp?.type) {
      case "emp":
        return Object?.values(emp?.name)?.join(" ");
      case "dept":
        return emp?.name;
      case "designation":
        return emp?.name;
      default:
        return Object?.values(emp?.name)?.join(" ");
    }
  };

  let fullName = getFullName(emp);

  return (
    fullName?.toLowerCase()?.includes(serchValue?.toLowerCase()) && (
      <AnimatePresence key={idx}>
        <motion.div
          key={idx}
          initial={{ scale: "0%", opacity: 0 }} // Starts off-screen to the right
          animate={{ scale: "100%", opacity: 1 }} // Slides in to its position
          exit={{ x: "0%", opacity: 0 }} // Slides back out to the right
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div
            className={`flex gap-2 items-center w-full group cursor-pointer ${
              type == "remove" ? "hover:bg-red-200 " : "hover:bg-blue-200 "
            } bg-gray-300 px-2 p-1 rounded-md text-sm font-medium `}
            key={idx}
            onClick={handleClick}
          >
            {emp?.type == "dept" || emp?.type == "designation" ? (
              <div
                className={`"min-w-8 min-h-8 flex items-center justify-center hover:z-10 aspect-square overflow-hidden rounded-full border-2  border-gray-100 font-semibold text-xs ${
                  color?.[emp?.type]
                } text-white cursor-pointer`}
              >
                {emp?.imgPath ? (
                  <img
                    src={emp?.imgPath}
                    className="object-cover	h-8 w-8 aspect-square"
                  />
                ) : (
                  (emp?.name[0] + emp?.name[1])?.toUpperCase()
                )}
              </div>
            ) : (
              <div
                // Add a key prop to avoid React warnings
                className="min-w-8 min-h-8 flex items-center justify-center hover:z-10 aspect-square overflow-hidden rounded-full border-2  border-gray-100 font-semibold text-xs bg-orange-800 text-white cursor-pointer"
              >
                {emp?.imgPath ? (
                  <img
                    src={emp?.imgPath}
                    className="object-cover	h-8 w-8 aspect-square"
                  />
                ) : (
                  (
                    emp?.name?.firstName[0] +
                    (emp?.name?.lastName?.[0] || emp?.name?.firstName[1])
                  )?.toUpperCase()
                )}
              </div>
            )}
            <span className="text-nowrap text-gray-800 flex-1">{fullName}</span>
            {emp?.department?.departmentName && (
              <TooltipMaterial
                content={emp?.department?.departmentName || ""}
                className="w-fit truncate "
              >
                <div className="truncate  w-fit">
                  <Chips
                    color={"#dbeafe"}
                    text={emp?.department?.departmentName}
                    css="text-xs   truncate"
                  ></Chips>
                </div>
              </TooltipMaterial>
            )}
            {emp?.designation?.designationName && (
              <TooltipMaterial
                content={emp?.designation?.designationName || ""}
                className="w-fit truncate "
              >
                <div className="truncate ">
                  <Chips
                    color={"#dbeafe"}
                    text={emp?.designation?.designationName}
                    css="text-xs text-nowrap truncate"
                  ></Chips>
                </div>
              </TooltipMaterial>
            )}
            {type && (
              <div className="float-right flex-1 flex items-end justify-end">
                <TooltipMaterial
                  content={type == "add" ? "Assign" : "Un-assgin"}
                >
                  <span
                    className={`w-4 h-4 ${
                      type == "remove" ? "text-red-600 " : "text-blue-600 "
                    }  ml-auto`}
                  >
                    {type == "add" ? (
                      <IoPersonAdd className="w-4 h-4" />
                    ) : (
                      <IoPersonRemove className="w-4 h-4" />
                    )}
                  </span>
                </TooltipMaterial>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
};

export default SingleLine;
