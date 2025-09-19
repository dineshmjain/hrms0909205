import { IconButton } from "@material-tailwind/react";
import { IoMdSwap } from "react-icons/io";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import moment from "moment";

function ShiftCard({ 
    emp, 
    dateStr, 
    shiftRef, 
    clientRef, 
    clientBranch, 
    subOrg, 
    subOrgBranch, 
    shiftByDates, 
    manageSwap, 
    startTime, 
    endTime }) {

  return (
    <div
      className={`
        relative w-full text-left rounded-lg shadow-sm px-4 py-3
        text-[11px] sm:text-xs font-medium
        transition-all duration-200 ease-in-out
        hover:shadow-md
      `}
      style={{
        backgroundColor: shiftRef.bgColor
          ? shiftRef.bgColor + "5A"
          : "#f9fafb", // lighter shade of bg
        color: "#111827",
      }}
    >
      {/* Left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
        style={{ backgroundColor: shiftRef.bgColor || "#e5e7eb" }}
      />

      {/* Action: Swap button */}
      {dateStr >= moment().format("YYYY-MM-DD") && (
        <div className="absolute right-2 top-2">
          <TooltipMaterial content="Swap Shifts">
            <IconButton
              onClick={(e) =>
                manageSwap(e, emp, dateStr, shiftByDates.references, shiftRef)
              }
              size="sm"
              variant="text"
              className="!bg-transparent hover:!bg-transparent !shadow-none !w-6 !h-6 !p-0"
            >
              <IoMdSwap className="text-black text-sm" />
            </IconButton>
          </TooltipMaterial>
        </div>
      )}

      {/* Header: Shift Name & Time */}
      <div className="flex justify-between items-center font-semibold text-[12px] sm:text-sm flex-wrap">
        <span className="truncate max-w-[65%] sm:max-w-full">
          {shiftRef.name}
        </span>
        <span className="text-[10px] sm:text-[11px] font-normal text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {startTime || "--:--"} – {endTime || "--:--"}
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px my-2"
        style={{ backgroundColor: (shiftRef.textColor || "#ccc") + "33" }}
      />

      {/* Shift Details */}
      <div className="text-gray-700 dark:text-gray-300 text-[11px] sm:text-[12px] space-y-0.5 leading-snug">
        {[clientRef?.name, clientBranch?.name, subOrg?.name, subOrgBranch?.name]
          .filter(Boolean)
          .map((item, idx) => (
            <div key={idx} className="truncate">
              {item}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ShiftCard;
