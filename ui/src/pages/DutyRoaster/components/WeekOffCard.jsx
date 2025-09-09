import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import { IoMdSwap } from "react-icons/io";
import { IconButton } from "@material-tailwind/react";
import moment from "moment";

function WeekOffCard({ emp, dateStr, shiftByDates, manageSwap }) {
  return (
    <div className="flex flex-col px-3 py-2 rounded-lg w-full h-full shadow-sm border-l-4 border-gray-500 bg-gray-100 text-left">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-black font-semibold text-sm">WEEK OFF</div>

        {dateStr >= moment().format("YYYY-MM-DD") && (
          <TooltipMaterial content="Swap Shifts">
            <IconButton
              onClick={(e) => manageSwap(e, emp, dateStr, shiftByDates.references)}
              className="!bg-transparent hover:!bg-transparent !shadow-none !w-6 !h-6 !p-0"
            >
              <IoMdSwap className="text-gray-800 text-sm" />
            </IconButton>
          </TooltipMaterial>
        )}
      </div>

      {/* Subtext */}
      <div className="text-black text-xs mt-1">
        Employee's Weekly Holiday
      </div>
    </div>
  );
}

export default WeekOffCard;
