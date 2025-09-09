import { TabPanel } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import SingleLine from "../../DetailsListItems/SingleLine";

const DesignationSidebar = ({
  assignedData,
  setAssignedData,
  handleSubTaskChange,
  selectedList,
}) => {
  const designationList = useSelector((state) => state?.designation?.designation);
  const [selectedIds, setSelectedIds] = useState([]);
  const [serch, setSerch] = useState("");
  useEffect(() => {
      if (selectedList) {
        setSelectedIds((prev) => {
          let temp = selectedList?.map((selected) => {
            return selected?._id;
          });
          return [...temp];
        });
      }
    }, [selectedList]);
  return (
    <TabPanel
      className="flex flex-col gap-2 w-full font-maprope"
      key={"Designation"}
      value={"Designation"}
    >
      <div className="w-full bg-gray-300 px-2 p-1 rounded-md flex items-center gp-2">
        <input
          type="text"
          className="w-full bg-gray-300 outline-none px-1 placeholder-gray-700 text-gray-900 "
          placeholder="Serch by Name"
          value={serch}
          onChange={(e) => setSerch(e.target.value)}
        />
        <IoSearch className="w-6 h-6" />
      </div>
      {selectedList?.map((sdesig, sidx) => {
        return (
          sdesig?.type == "designation" && (
            <SingleLine
              type="remove"
              key={sidx}
              idx={sidx}
              emp={{ ...sdesig, type: "designation" }}
              serchValue={serch}
              handleClick={() => {
                let temp = [...selectedList];
                temp?.splice(sidx, 1);
                let e = {
                  target: {
                    name: "assignedTo",
                    value: [...temp],
                  },
                };
                handleSubTaskChange(e, assignedData?.idx, assignedData?.subIdx);
              }}
            />
          )
        );
      })}
      <span className="w-full border border-gray-400"></span>
      {designationList?.map((desig, didx) => {
        return  !selectedIds?.includes(desig?._id) && (
          <AnimatePresence key={didx}>
            <motion.div
              key={didx}
              initial={{ scale: "0%", opacity: 0 }} // Starts off-screen to the right
              animate={{ scale: "100%", opacity: 1 }} // Slides in to its position
              exit={{ x: "100%", opacity: 0 }} // Slides back out to the right
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SingleLine
                type="add"
                idx={didx}
                emp={{ ...desig, type: "designation" }}
                serchValue={serch}
                handleClick={() => {
                  let e = {
                    target: {
                      name: "assignedTo",
                      value: [...selectedList, { ...desig, type: "designation" }],
                    },
                  };
                  handleSubTaskChange(
                    e,
                    assignedData?.idx,
                    assignedData?.subIdx
                  );
                }}
              />
            </motion.div>
          </AnimatePresence>
        );
      })}
    </TabPanel>
  );
};

export default DesignationSidebar;
