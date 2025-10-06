import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaXmark } from "react-icons/fa6";
import { Typography } from "@material-tailwind/react";
import { toTitleCase } from "../../../../constants/reusableFun";
import { SalaryTemplatePreviewAction } from "../../../../redux/Action/Salary/SalaryAction";
import { resetPreviewState } from "../../../../redux/reducer/SalaryReducer";


const PreviewTemplateSidebar = ({ open, onClose, selectedTemplate }) => {
  const dispatch = useDispatch();
  const [ctc, setCtc] = useState("");

  const { loading, result, error } = useSelector((s) => s.salary.preview);

  const handleCalculate = () => {
    if (!ctc || isNaN(ctc) || !selectedTemplate?._id) return;

    dispatch(
      SalaryTemplatePreviewAction({
        ctc: parseFloat(ctc),
        templateId: selectedTemplate._id,
      })
    );
  };

  // Reset preview when closing
  const handleClose = () => {
    setCtc("");
    dispatch(resetPreviewState());
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setCtc("");
      dispatch(resetPreviewState());
    }
  }, [open, dispatch]);

  return (
    <div
      className={`fixed sidebar z-30 rounded-lg w-[30vw] shadow-2xl transition-all ease-in-out duration-[.3s] top-[48px] 
        ${open ? `right-[-10px] visible` : `right-[-3000px]`} bg-white overflow-y-scroll scrolls`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Typography className="text-lg font-semibold text-gray-800">
          Preview Template
        </Typography>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaXmark className="text-xl" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* CTC Input */}
        <div>
          <label className="text-sm font-medium text-gray-700">Enter CTC</label>
          <input
            type="number"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
            placeholder="Enter CTC amount"
            className="mt-1 w-full border rounded-md p-2 text-sm"
          />
        </div>

        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primaryLight hover:text-primary disabled:opacity-50"
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Earnings
              </h3>
              <div className="space-y-1">
                {result.earnings.map((e, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{toTitleCase(e.name)}</span>
                    <span>₹{e.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-semibold mt-2 border-t pt-2">
                <span>Total Earnings</span>
                <span>₹{result.totalEarnings.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Deductions
              </h3>
              <div className="space-y-1">
                {result.deductions.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{toTitleCase(d.name)}</span>
                    <span>₹{d.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm font-semibold mt-2 border-t pt-2">
                <span>Total Deductions</span>
                <span>₹{result.totalDeductions.toFixed(2)}</span>
              </div>
            </div>
{/* 
            <div className="flex justify-between text-md font-bold border-t pt-2">
              <span>Gross</span>
              <span>₹{result.gross.toFixed(2)}</span>
            </div> */}

            <div className="flex justify-between text-md font-bold border-t pt-2">
              <span>Net Salary</span>
              <span>₹{result.netSalary.toFixed(2)}</span>
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-2">Error: {error}</p>
        )}
      </div>
    </div>
  );
};

export default PreviewTemplateSidebar;
