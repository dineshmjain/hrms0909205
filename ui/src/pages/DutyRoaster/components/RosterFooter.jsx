import { LuSkipBack, LuSkipForward } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-hot-toast";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";

const RosterFooter = ({
  page,
  setPage,
  totalPages,
  totalRecord,
  start,
  end,
  limit,
  setLimit,
  inputPageValue,
  setInputPageValue,
  loading,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-md shadow-hrms maxsm:flex-col">
      {/* Showing Count */}
      <div className="text-sm text-gray-700">
        {loading
          ? "Loading Data..."
          : `Showing ${start} – ${end} of ${totalRecord}`}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* First Page */}
        <TooltipMaterial content="First Page">
          <button
            disabled={page === 1}
            className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black
                     disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                     disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
            onClick={() => {
              setPage(1);
              setInputPageValue(1);
            }}
          >
            <LuSkipBack className="w-4 h-4" />
          </button>
        </TooltipMaterial>

        {/* Previous Page */}
        <TooltipMaterial content="Previous Page">
          <button
            disabled={page === 1}
            className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black
                     disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                     disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
                setInputPageValue(page - 1);
              }
            }}
          >
            <IoIosArrowBack className="w-4 h-4" />
          </button>
        </TooltipMaterial>

        {/* Page Number Input */}
        <TooltipMaterial content="Page No">
          <input
            type="number"
            className="w-16 h-8 text-center rounded-md bg-popLight px-2 shadow-hrms hover:shadow-md"
            min={1}
            max={totalPages}
            value={inputPageValue}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setInputPageValue(isNaN(val) ? 1 : val);
            }}
            onBlur={() => {
              if (inputPageValue >= 1 && inputPageValue <= totalPages) {
                setPage(inputPageValue); // ✅ Only fetch when valid
              } else {
                toast.error(
                  `Page number must be between 1 and ${totalPages}`
                );
                setInputPageValue(page); // Reset to current page
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.target.blur(); // ✅ Trigger validation
            }}
          />
        </TooltipMaterial>

        {/* Next Page */}
        <TooltipMaterial content="Next Page">
          <button
            disabled={page >= totalPages}
            className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black
                     disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                     disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
                setInputPageValue(page + 1);
              }
            }}
          >
            <IoIosArrowForward className="w-4 h-4" />
          </button>
        </TooltipMaterial>

        {/* Last Page */}
        <TooltipMaterial content="Last Page">
          <button
            disabled={page >= totalPages}
            className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black
                     disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                     disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
            onClick={() => {
              setPage(totalPages);
              setInputPageValue(totalPages);
            }}
          >
            <LuSkipForward className="w-4 h-4" />
          </button>
        </TooltipMaterial>

        {/* Rows per page */}
        <TooltipMaterial content="Rows per page">
          <select
            name="NumberOfRows"
            className="h-8 px-2 rounded-md bg-popLight"
            value={limit}
            onChange={(e) => {
              const newLimit = parseInt(e.target.value, 10);
              setLimit(newLimit);
              setPage(1); // Reset to first page
              setInputPageValue(1);
            }}
          >
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </TooltipMaterial>
      </div>
    </div>
  );
};

export default RosterFooter;
