import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule.js";

// ✅ Formik Config Export
export const BasicPriceConfig = (shiftList = []) => {
  const baseValues = {
    role: "",
    effectiveFrom: "",
  };

  const periods = ["daily", "monthly", "yearly"];
  const cityTypes = ["In City", "Outer City"];

  // Dynamically add fields
  periods.forEach((period) => {
    cityTypes.forEach((city) => {
      shiftList.forEach((shift) => {
        const fieldName = `${period}${city.replace(" ", "")}${shift?.name}`;
        baseValues[fieldName] = "";
      });
    });
  });

  return {
    initialValues: baseValues,
    validationSchema: Yup.object({
      role: Yup.string().required("Role is required"),
      effectiveFrom: Yup.date().required("Effective From Date is required"),
    }),
  };
};

// ✅ UI Component
const BasicInformation = ({ isEditAvaliable = false }) => {
  const dispatch = useDispatch();
  const checkModule = useCheckEnabledModule();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();

  const { roleList = [] } = useSelector((state) => state.role || {});
  const shiftList = [
    { id: 1, name: "Day" },
    { id: 2, name: "Night" },
  ];

  useEffect(() => {
    if (state) {
      setFieldValue("role", state?.role || "");
      setFieldValue("effectiveFrom", state?.effectiveFrom?.slice(0, 10) || "");
      Object.keys(values).forEach((key) => {
        if (state?.[key]) setFieldValue(key, state[key]);
      });
    }
  }, [state]);

  const periods = ["daily", "monthly", "yearly"];
  const cityTypes = ["In City", "Outer City"];

  return (
    <div className="w-full p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white ">
        {/* <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Pricing Configuration
        </h1>
        <p className="text-gray-600 text-sm">
          Set up pricing for different roles, shifts, and locations
        </p> */}

        {/* Role & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormikInput
            name="role"
            size="md"
            label="Role *"
            inputType={isEditAvaliable ? "edit" : "dropdown"}
            listData={roleList}
            selectedOption={values?.role}
            handleClick={(sel) => setFieldValue("role", sel?._id)}
            selectedOptionDependency="_id"
            feildName="name"
            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <FormikInput
            name="effectiveFrom"
            size="md"
            label="Price Effective From *"
            type="date"
            inputType={isEditAvaliable ? "edit" : "input"}
            editValue={values?.effectiveFrom}
            className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        {periods.map((period, index) => (
          <div
            key={period}
            className={`bg-white rounded-xl shadow border-t-4 flex flex-col ${
              index === 0
                ? "border-blue-500"
                : index === 1
                ? "border-green-500"
                : "border-purple-500"
            }`}
          >
            {/* Card Header */}
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {period} Pricing
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Set prices for {period} shifts
              </p>
            </div>

            {/* Input Table */}
            <div className="flex-grow p-4">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Shift
                      </th>
                      {cityTypes.map((city) => (
                        <th
                          key={city}
                          className="p-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {city}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shiftList.map((shift, rowIndex) => (
                      <tr
                        key={shift?.id || shift?.name}
                        className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        {/* Shift Name */}
                        <td className="p-2 font-medium text-gray-700 text-sm">
                          {shift?.name}
                        </td>

                        {/* City Price Inputs */}
                        {cityTypes.map((city) => {
                          const fieldName = `${period}${city.replace(
                            " ",
                            ""
                          )}${shift?.name}`;
                          return (
                            <td key={city} className="p-2 text-center">
                              <div className="relative flex justify-center">
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                  $
                                </span>
                                <FormikInput
                                  key={fieldName}
                                  name={fieldName}
                                  size="sm"
                                  type="number"
                                  placeholder="0.00"
                                  inputType={isEditAvaliable ? "edit" : "input"}
                                  editValue={values?.[fieldName]}
                                  min="0"
                                  step="0.01"
                                  inputClassName="pl-5 pr-2 py-1 text-xs border border-gray-300 rounded-md 
                                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                                    w-20 text-right"
                                />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Pricing Section - Cards */}
    

      {/* Global Actions */}
      {/* <div className="bg-white rounded-xl shadow p-6 flex justify-end space-x-4 border">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save All Changes
        </button>
      </div> */}
    </div>
  );
};

export default BasicInformation;
