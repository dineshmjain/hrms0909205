import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Input,
  Spinner,
  Card,
} from "@material-tailwind/react";
import { FaXmark } from "react-icons/fa6";
import { toTitleCase } from "../../../../constants/reusableFun";
import {
  SalaryTemplatePreviewAction,
} from "../../../../redux/Action/Salary/SalaryAction";
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

  const renderTableSection = (title, items, totalLabel, totalObj) => {
    if (!Array.isArray(items) || !items.length) return null;

    const filtered = items.filter((i) => i.monthly > 0);
    if (!filtered.length) return null;

    return (
      <div className="mb-6">
        <Typography variant="h6" color="blue-gray" className="mb-2">
          {title}
        </Typography>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-blue-gray-800">
              <th className="text-left py-2">Particulars</th>
              <th className="text-right py-2">Monthly (₹)</th>
              <th className="text-right py-2">Yearly (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} className="border-b border-blue-gray-100">
                <td className="py-2 text-blue-gray-900">
                  {toTitleCase(item.name)}
                </td>
                <td className="py-2 text-right">
                  {item.monthly.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="py-2 text-right">
                  {item.yearly.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold border-t">
              <td className="py-2">{totalLabel}</td>
              <td className="py-2 text-right">
                {totalObj?.monthly?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="py-2 text-right">
                {totalObj?.yearly?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement="right"
      size={700}
      className="p-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <Typography variant="h5" color="blue-gray">
          Salary Template Preview
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleClose}>
          <FaXmark className="h-5 w-5" />
        </IconButton>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium mb-1"
          >
            Enter CTC
          </Typography>
          <Input
            type="number"
            label="CTC Amount"
            value={ctc}
            onChange={(e) => setCtc(e.target.value)}
          />
        </div>

        <Button
          color="blue"
          onClick={handleCalculate}
          disabled={loading}
          className="w-fit"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Calculating...
            </div>
          ) : (
            "Calculate"
          )}
        </Button>

        {/* Results */}
        {result && (
          <Card className="p-4 mt-4">
            {renderTableSection(
              "Earnings",
              result.earnings,
              "Gross Salary",
              result.totalEarnings
            )}

            {renderTableSection(
              "Deductions",
              result.deductions,
              "Total Deductions",
              result.totalDeductions
            )}

            {renderTableSection(
              "Employer Contributions",
              result.employerContribs,
              "Total Employer Contribution",
              result.totalEmployerContrib
            )}

            {/* Summary Section */}
            <table className="w-full border-collapse text-sm mt-6">
              <tbody>
                <tr className="border-t font-semibold">
                  <td className="py-2">Net Salary (Take-Home)</td>
                  <td className="py-2 text-right">
                    {result.netSalary?.monthly?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 text-right">
                    {result.netSalary?.yearly?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="border-t font-bold">
                  <td className="py-2">Total Cost to Company (CTC)</td>
                  <td className="py-2 text-right">
                    {result.totalCTCValue?.monthly?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 text-right">
                    {result.totalCTCValue?.yearly?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        )}

        {error && (
          <Typography variant="small" color="red" className="mt-2">
            Error: {error}
          </Typography>
        )}
      </div>
    </Drawer>
  );
};

export default PreviewTemplateSidebar;
