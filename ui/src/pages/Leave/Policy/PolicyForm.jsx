// import React from "react";
// import { Typography, Input, Checkbox } from "@material-tailwind/react";
// import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
// import SubCardHeader from "../../../components/header/SubCardHeader";

// const PolicyForm = ({
//   form,
//   errors,
//   handleChange,
//   handleDropdownChange,
//   leavePolicyOptions,
//   branchOptions,
//   monthDay,
//   YearlyMonth,
//   setErrors,
//   onSubmit,
//   isEditAvaliable,
//   isEdit = false,
// }) => {
//   // Calculate monthly count for display
//   const getMonthlyDisplay = () => {
//     if (!form.yearlyCount || !form.isMonthly) return "";
//     const monthly = form.yearlyCount / 12;
//     return Number.isInteger(monthly) ? monthly : monthly.toFixed(2);
//   };

//   return (
//     <form onSubmit={onSubmit} className="p-4">
//       <div className="flex flex-col gap-2 p-2 mb-2">
//         <SubCardHeader headerLabel="Basic Information" />
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Branch Selection */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Branch <span className="text-red-500">*</span>
//             </Typography>
//             <SingleSelectDropdown
//               feildName="label"
//               listData={branchOptions}
//               inputName="Select Branch"
//               selectedOption={form.branch?.label}
//               hideLabel={true}
//               handleClick={handleDropdownChange("branch")}
//             />
//             {errors.branchId && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.branchId}
//               </Typography>
//             )}
//           </div>

//           {/* Leave Policy Name */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Leave Policy Name <span className="text-red-500">*</span>
//             </Typography>
//             <SingleSelectDropdown
//               disabled={isEditAvaliable}
//               feildName="label"
//               listData={leavePolicyOptions}
//               inputName="Leave Policy"
//               selectedOption={form?.leavePolicy?.label}
//               hideLabel={true}
//               handleClick={handleDropdownChange("leavePolicy")}
//             />
//             {errors.leavePolicy && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.leavePolicy}
//               </Typography>
//             )}
//           </div>

//           {/* Yearly Leave Count */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Yearly Leave Count <span className="text-red-500">*</span>
//             </Typography>
//             <Input
//               size="md"
//               type="number"
//               name="yearlyCount"
//               placeholder="Enter yearly count"
//               value={form.yearlyCount}
//               onChange={handleChange}
//               className="bg-white text-gray-900 border border-gray-400 
//                 !border-t-gray-400 focus:!border-gray-900 
//                 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
//               min={0}
//             />
//             {errors.yearlyCount && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.yearlyCount}
//               </Typography>
//             )}
//           </div>

//           {/* Monthly Distribution Checkbox */}
//           <div className="flex items-center gap-2 mt-6">
//             <Checkbox
//               checked={form.isMonthly}
//               onChange={(e) =>
//                 handleChange({
//                   target: {
//                     name: "isMonthly",
//                     type: "checkbox",
//                     checked: e.target.checked,
//                   },
//                 })
//               }
//               className="h-5 w-5"
//             />
//             <Typography variant="small" className="text-gray-700 font-medium">
//               Monthly Distribution
//             </Typography>
//           </div>

//           {/* Monthly Count Display */}
//           {form.isMonthly && (
//             <div>
//               <Typography variant="small" className="mb-2 font-medium">
//                 Monthly Count
//               </Typography>
//               <div className="relative">
//                 <Input
//                   size="md"
//                   type="text"
//                   name="monthlyCount"
//                   placeholder="Auto-calculated"
//                   value={getMonthlyDisplay()}
//                   disabled
//                   className="bg-gray-100 text-gray-700 border border-gray-400 
//                     !border-t-gray-400 rounded-md cursor-not-allowed"
//                 />
//                 <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                   <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-semibold">
//                     {form.yearlyCount ? `${form.yearlyCount}/12` : ""}
//                   </span>
//                 </div>
//               </div>
//               <Typography
//                 variant="small"
//                 className="text-gray-500 text-xs mt-1"
//               >
//                 Automatically calculated from yearly count
//               </Typography>
//             </div>
//           )}

//           {/* Credited Day */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Credited Day <span className="text-red-500">*</span>
//             </Typography>
//             <SingleSelectDropdown
//               feildName="label"
//               listData={monthDay}
//               inputName="Select Day"
//               selectedOption={form?.creditedDay?.label}
//               hideLabel={true}
//               handleClick={handleDropdownChange("creditedDay")}
//             />
//             {errors.creditedDay && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.creditedDay}
//               </Typography>
//             )}
//           </div>

//           {/* Credited Month - Only for Yearly */}
//           {!form.isMonthly && (
//             <div>
//               <Typography variant="small" className="mb-2 font-medium">
//                 Credited Month <span className="text-red-500">*</span>
//               </Typography>
//               <SingleSelectDropdown
//                 feildName="label"
//                 listData={YearlyMonth}
//                 inputName="Select Month"
//                 selectedOption={form?.creditedMonth?.label}
//                 hideLabel={true}
//                 handleClick={handleDropdownChange("creditedMonth")}
//               />
//               {errors.creditedMonth && (
//                 <Typography color="red" className="text-xs mt-1">
//                   {errors.creditedMonth}
//                 </Typography>
//               )}
//             </div>
//           )}

//           {/* Leave Handling - Only Carry Forward and Convert to Salary */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Leave Handling <span className="text-red-500">*</span>
//             </Typography>
//             <SingleSelectDropdown
//               feildName="label"
//               listData={[
//                 { label: "Carry Forward", value: "carry" },
//                 { label: "Convert to Salary", value: "salary" },
//               ]}
//               inputName="Leave Handling"
//               selectedOption={form?.leaveHandling?.label}
//               hideLabel={true}
//               handleClick={handleDropdownChange("leaveHandling")}
//             />
//             {errors.leaveHandling && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.leaveHandling}
//               </Typography>
//             )}
//           </div>

//           {/* Handling Type - Always show since we removed "None" option */}
//           <div>
//             <Typography variant="small" className="mb-2 font-medium">
//               Handling Type <span className="text-red-500">*</span>
//             </Typography>
//             <SingleSelectDropdown
//               feildName="label"
//               listData={[
//                 { label: "Monthly", value: "monthly" },
//                 { label: "Yearly", value: "yearly" },
//               ]}
//               inputName="Handling Type"
//               selectedOption={form?.handlingType?.label}
//               hideLabel={true}
//               handleClick={handleDropdownChange("handlingType")}
//             />
//             {errors.handlingType && (
//               <Typography color="red" className="text-xs mt-1">
//                 {errors.handlingType}
//               </Typography>
//             )}
//           </div>

//           {/* Salary Conversion Fields - Only show if "Convert to Salary" */}
//           {form.leaveHandling?.value === "salary" && (
//             <>
//               <div>
//                 <Typography variant="small" className="mb-2 font-medium">
//                   Max Allowed Leave <span className="text-red-500">*</span>
//                 </Typography>
//                 <Input
//                   size="md"
//                   type="number"
//                   name="maxAllowedLeave"
//                   placeholder="Enter max allowed"
//                   value={form.maxAllowedLeave}
//                   onChange={handleChange}
//                   className="bg-white text-gray-900 border border-gray-400 
//                     !border-t-gray-400 focus:!border-gray-900 
//                     focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
//                   min={0}
//                 />
//                 {errors.maxAllowedLeave && (
//                   <Typography color="red" className="text-xs mt-1">
//                     {errors.maxAllowedLeave}
//                   </Typography>
//                 )}
//               </div>

//               <div>
//                 <Typography variant="small" className="mb-2 font-medium">
//                   Salary Basis <span className="text-red-500">*</span>
//                 </Typography>
//                 <SingleSelectDropdown
//                   feildName="label"
//                   listData={[
//                     { label: "Basic", value: "basic" },
//                     { label: "Gross", value: "gross" },
//                   ]}
//                   inputName="Salary Basis"
//                   selectedOption={form?.salaryBasis?.label}
//                   hideLabel={true}
//                   handleClick={handleDropdownChange("salaryBasis")}
//                 />
//                 {errors.salaryBasis && (
//                   <Typography color="red" className="text-xs mt-1">
//                     {errors.salaryBasis}
//                   </Typography>
//                 )}
//               </div>

//               <div>
//                 <Typography variant="small" className="mb-2 font-medium">
//                   % of Salary per Leave <span className="text-red-500">*</span>
//                 </Typography>
//                 <Input
//                   size="md"
//                   type="number"
//                   name="salaryPercent"
//                   placeholder="Enter percentage"
//                   value={form.salaryPercent}
//                   onChange={handleChange}
//                   className="bg-white text-gray-900 border border-gray-400 
//                     !border-t-gray-400 focus:!border-gray-900 
//                     focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
//                   min={0}
//                   max={100}
//                 />
//                 {errors.salaryPercent && (
//                   <Typography color="red" className="text-xs mt-1">
//                     {errors.salaryPercent}
//                   </Typography>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Distribution Summary Box */}
//         {form.yearlyCount && (
//           <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <Typography
//               variant="small"
//               className="font-semibold text-blue-900 mb-2"
//             >
//               Leave Distribution Summary
//             </Typography>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600">Cycle Type:</span>
//                 <span className="font-semibold text-gray-900">
//                   {form.isMonthly ? "Monthly" : "Yearly"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600">Yearly Total:</span>
//                 <span className="font-semibold text-blue-600">
//                   {form.yearlyCount} leaves/year
//                 </span>
//               </div>
//               {form.isMonthly && (
//                 <div className="flex items-center gap-2">
//                   <span className="text-gray-600">Monthly Allocation:</span>
//                   <span className="font-semibold text-green-600">
//                     {getMonthlyDisplay()} leaves/month
//                   </span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600">Leave Handling:</span>
//                 <span className="font-semibold text-purple-600">
//                   {form.leaveHandling?.label || "Not set"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-gray-600">Handling Cycle:</span>
//                 <span className="font-semibold text-orange-600">
//                   {form.handlingType?.label || "Not set"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </form>
//   );
// };

// export default PolicyForm;
import React from "react";
import { Typography, Input, Checkbox } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import SubCardHeader from "../../../components/header/SubCardHeader";

const PolicyForm = ({
  form,
  errors,
  handleChange,
  handleDropdownChange,
  leavePolicyOptions,
  branchOptions,
  monthDay,
  YearlyMonth,
  setErrors,
  onSubmit,
  isEditAvaliable,
  isEdit = false,
}) => {
  // Calculate monthly count for display
  const getMonthlyDisplay = () => {
    if (!form.yearlyCount || !form.isMonthly) return "";
    
    // If monthlyCount is already set (from edit), use it
    if (form.monthlyCount) {
      return form.monthlyCount;
    }
    
    // Otherwise calculate it
    const monthly = parseFloat(form.yearlyCount) / 12;
    return Number.isInteger(monthly) ? monthly : monthly.toFixed(2);
  };

  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="flex flex-col gap-2 p-2 mb-2">
        <SubCardHeader headerLabel="Basic Information" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Branch Selection */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Branch <span className="text-red-500">*</span>
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={branchOptions}
              inputName="Select Branch"
              selectedOption={form.branch?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("branch")}
            />
            {errors.branchId && (
              <Typography color="red" className="text-xs mt-1">
                {errors.branchId}
              </Typography>
            )}
          </div>

          {/* Leave Policy Name */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Leave Policy Name <span className="text-red-500">*</span>
            </Typography>
            <SingleSelectDropdown
              disabled={isEditAvaliable}
              feildName="label"
              listData={leavePolicyOptions}
              inputName="Leave Policy"
              selectedOption={form?.leavePolicy?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("leavePolicy")}
            />
            {errors.leavePolicy && (
              <Typography color="red" className="text-xs mt-1">
                {errors.leavePolicy}
              </Typography>
            )}
          </div>

          {/* Yearly Leave Count */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Yearly Leave Count <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="md"
              type="number"
              name="yearlyCount"
              placeholder="Enter yearly count"
              value={form.yearlyCount}
              onChange={handleChange}
              className="bg-white text-gray-900 border border-gray-400 
                !border-t-gray-400 focus:!border-gray-900 
                focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
              min={0}
            />
            {errors.yearlyCount && (
              <Typography color="red" className="text-xs mt-1">
                {errors.yearlyCount}
              </Typography>
            )}
          </div>

          {/* Monthly Distribution Checkbox */}
          <div className="flex items-center gap-2 mt-6">
            <Checkbox
              checked={form.isMonthly}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "isMonthly",
                    type: "checkbox",
                    checked: e.target.checked,
                  },
                })
              }
              className="h-5 w-5"
            />
            <Typography variant="small" className="text-gray-700 font-medium">
              Monthly Distribution
            </Typography>
          </div>

          {/* Monthly Count Display */}
          {form.isMonthly && (
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Monthly Count
              </Typography>
              <div className="relative">
                <Input
                  size="md"
                  type="text"
                  name="monthlyCount"
                  placeholder="Auto-calculated"
                  value={getMonthlyDisplay()}
                  disabled
                  className="bg-gray-100 text-gray-700 border border-gray-400 
                    !border-t-gray-400 rounded-md cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-semibold">
                    {form.yearlyCount ? `${form.yearlyCount}/12` : ""}
                  </span>
                </div>
              </div>
              <Typography variant="small" className="text-gray-500 text-xs mt-1">
                Automatically calculated from yearly count
              </Typography>
            </div>
          )}

          {/* Credited Day */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Credited Day <span className="text-red-500">*</span>
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={monthDay}
              inputName="Select Day"
              selectedOption={form?.creditedDay?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("creditedDay")}
            />
            {errors.creditedDay && (
              <Typography color="red" className="text-xs mt-1">
                {errors.creditedDay}
              </Typography>
            )}
          </div>

          {/* Credited Month - Only for Yearly */}
          {!form.isMonthly && (
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Credited Month <span className="text-red-500">*</span>
              </Typography>
              <SingleSelectDropdown
                feildName="label"
                listData={YearlyMonth}
                inputName="Select Month"
                selectedOption={form?.creditedMonth?.label}
                hideLabel={true}
                handleClick={handleDropdownChange("creditedMonth")}
              />
              {errors.creditedMonth && (
                <Typography color="red" className="text-xs mt-1">
                  {errors.creditedMonth}
                </Typography>
              )}
            </div>
          )}

          {/* Leave Handling - Only Carry Forward and Convert to Salary */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Leave Handling <span className="text-red-500">*</span>
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={[
                { label: "Carry Forward", value: "carry" },
                { label: "Convert to Salary", value: "salary" },
              ]}
              inputName="Leave Handling"
              selectedOption={form?.leaveHandling?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("leaveHandling")}
            />
            {errors.leaveHandling && (
              <Typography color="red" className="text-xs mt-1">
                {errors.leaveHandling}
              </Typography>
            )}
          </div>

          {/* Handling Type - Always show since we removed "None" option */}
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Handling Type <span className="text-red-500">*</span>
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              inputName="Handling Type"
              selectedOption={form?.handlingType?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("handlingType")}
            />
            {errors.handlingType && (
              <Typography color="red" className="text-xs mt-1">
                {errors.handlingType}
              </Typography>
            )}
          </div>

          {/* Salary Conversion Fields - Only show if "Convert to Salary" */}
          {form.leaveHandling?.value === "salary" && (
            <>
              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Max Allowed Leave <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="md"
                  type="number"
                  name="maxAllowedLeave"
                  placeholder="Enter max allowed"
                  value={form.maxAllowedLeave}
                  onChange={handleChange}
                  className="bg-white text-gray-900 border border-gray-400 
                    !border-t-gray-400 focus:!border-gray-900 
                    focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
                  min={0}
                />
                {errors.maxAllowedLeave && (
                  <Typography color="red" className="text-xs mt-1">
                    {errors.maxAllowedLeave}
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  Salary Basis <span className="text-red-500">*</span>
                </Typography>
                <SingleSelectDropdown
                  feildName="label"
                  listData={[
                    { label: "Basic", value: "basic" },
                    { label: "Gross", value: "gross" },
                  ]}
                  inputName="Salary Basis"
                  selectedOption={form?.salaryBasis?.label}
                  hideLabel={true}
                  handleClick={handleDropdownChange("salaryBasis")}
                />
                {errors.salaryBasis && (
                  <Typography color="red" className="text-xs mt-1">
                    {errors.salaryBasis}
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-medium">
                  % of Salary per Leave <span className="text-red-500">*</span>
                </Typography>
                <Input
                  size="md"
                  type="number"
                  name="salaryPercent"
                  placeholder="Enter percentage"
                  value={form.salaryPercent}
                  onChange={handleChange}
                  className="bg-white text-gray-900 border border-gray-400 
                    !border-t-gray-400 focus:!border-gray-900 
                    focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md"
                  min={0}
                  max={100}
                />
                {errors.salaryPercent && (
                  <Typography color="red" className="text-xs mt-1">
                    {errors.salaryPercent}
                  </Typography>
                )}
              </div>
            </>
          )}
        </div>

        {/* Distribution Summary Box */}
        {form.yearlyCount && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Typography variant="small" className="font-semibold text-blue-900 mb-2">
             Leave Distribution Summary
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Cycle Type:</span>
                <span className="font-semibold text-gray-900">
                  {form.isMonthly ? "Monthly" : "Yearly"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Yearly Total:</span>
                <span className="font-semibold text-blue-600">
                  {form.yearlyCount} leaves/year
                </span>
              </div>
              {form.isMonthly && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Monthly Allocation:</span>
                  <span className="font-semibold text-green-600">
                    {getMonthlyDisplay()} leaves/month
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Leave Handling:</span>
                <span className="font-semibold text-purple-600">
                  {form.leaveHandling?.label || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Handling Cycle:</span>
                <span className="font-semibold text-orange-600">
                  {form.handlingType?.label || "Not set"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default PolicyForm;