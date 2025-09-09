import { use, useState } from "react";
import { useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

const PendingActionCard = () => {
  const nav = useNavigate();
  const { user } = useSelector((state) => state?.user);
  const [pengingTask, setPendingTask] = useState(0);


  useEffect(() => {
    if (user?.pending) {
      let count = 0;
      Object.entries(user?.pending).forEach(([item, value]) => {
        if (value === true) {
          count += 1;
        }
      });

      setPendingTask(count);
    }
  }, [user?.pending]);
  return (
    <div className="w-fit flex flex-col gap-2 p-4 maxsm:gap-4 maxlg:w-full items-start justify-between bg-white rounded-md shadow-lg ">
      <div className="flex justify-between font-medium maxmd:flex-wrap w-full">
        <span className="font-semibold">Pending Task </span>
      </div>
      <span className="text-gray-800 font-medium">
        You have {pengingTask} Pending Task!
      </span>
      <div className="flex justify-between  maxmd:flex-col gap-2 w-full ">
        <div className="flex gap-2 justify-end items-end text-sm   max-sm:w-full">
          <button
            className="bg-green-500 hover:bg-green-600 group maxsm:w-full maxsm:text-sm align-middle justify-center text-white rounded-md p-2 h-fit flex gap-2 items-center"
            onClick={() => setShowModal(1)}
            disabled={pengingTask === 0}
          >
            Complete Pending Task
            <MdOutlineKeyboardArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingActionCard;
