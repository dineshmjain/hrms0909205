import React from "react";
import { Typography, Input, Checkbox } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import { PiInfoBold } from "react-icons/pi";
import SubCardHeader from "../../../components/header/SubCardHeader";


const PolicyForm = ({
  form,
  errors,
  handleChange,
  handleDropdownChange,
  leavePolicyOptions,
  branchOptions,
  typeList,
  monthDay,
  YearlyMonth,
  genders,
  appTypes,
  paidTypes,
  setErrors,
  onSubmit,
  isEditAvaliable,
  isEdit = false,
}) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="flex flex-col gap-2 p-2 mb-2">
      <SubCardHeader headerLabel="Basic Information" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
     
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Branch
          </Typography>
          <SingleSelectDropdown
            feildName="label"
            listData={branchOptions} // fetched from Redux or API
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
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Name
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
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Yearly Leave Count
          </Typography>
          <Input
            size="md"
            type="number"
            name="yearlyCount"
            placeholder="Yearly Count"
            value={form.yearlyCount}
            onChange={handleChange}
            className="bg-white text-gray-900 border border-gray-400 
          !border-t-gray-400 focus:!border-gray-900 
          focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
          />
          {errors.yearlyCount && (
            <Typography color="red" className="text-xs mt-1">
              {errors.yearlyCount}
            </Typography>
          )}
        </div>
        {/* Monthly Distribution */}
        <div className="flex items-center gap-2 mt-6">
          <Checkbox
            checked={form.isMonthly}
            onChange={(e) =>
              handleChange({
                target: { name: "isMonthly", value: e.target.checked },
              })
            }
            className="h-5 w-5"
          />
          <Typography variant="small" className="text-gray-700">
            Monthly Distribution
          </Typography>
        </div>
        {/* Monthly Count */}
        {form.isMonthly && (
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Monthly Count
            </Typography>
            <Input
              size="md"
              type="number"
              name="monthlyCount"
              placeholder="Monthly Count"
              value={form.monthlyCount}
              onChange={handleChange}
              className="bg-white text-gray-900 border border-gray-400 
            !border-t-gray-400 focus:!border-gray-900 
            focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            />
          </div>
        )}
        {/* Credited Day */}
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Credited Day
          </Typography>
          <SingleSelectDropdown
            feildName="label"
            listData={monthDay}
            inputName="Select Day"
            selectedOption={form?.creditedDay?.label}
            hideLabel={true}
            handleClick={handleDropdownChange("creditedDay")}
          />
        </div>
        {/* Credited Month */}
        {!form.isMonthly && (
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Credited Month
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={YearlyMonth}
              inputName="Select Month"
              selectedOption={form?.creditedMonth?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("creditedMonth")}
            />
          </div>
        )}
        {/* Leave Handling */}
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Leave Handling
          </Typography>
          <SingleSelectDropdown
            feildName="label"
            listData={[
              { label: "Carry Forward", value: "carry" },
              { label: "Convert to Salary", value: "salary" },
              { label: "None", value: "none" },
            ]}
            inputName="Leave Handling"
            selectedOption={form?.leaveHandling?.label}
            hideLabel={true}
            handleClick={handleDropdownChange("leaveHandling")}
          />
        </div>
        {/* Handling Type */}
        {(form.leaveHandling?.value === "carry" ||
          form.leaveHandling?.value === "salary") && (
          <div>
            <Typography variant="small" className="mb-2 font-medium">
              Handling Type
            </Typography>
            <SingleSelectDropdown
              feildName="label"
              listData={[
                { label: "Yearly", value: "yearly" },
                { label: "Monthly", value: "monthly" },
              ]}
              inputName="Handling Type"
              selectedOption={form?.handlingType?.label}
              hideLabel={true}
              handleClick={handleDropdownChange("handlingType")}
            />
          </div>
        )}
        {/* Max Allowed Leave & Salary Basis */}
        {form.leaveHandling?.value === "salary" && (
          <>
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Max Allowed Leave
              </Typography>
              <Input
                size="md"
                type="number"
                name="maxAllowedLeave"
                placeholder="Max Allowed"
                value={form.maxAllowedLeave}
                onChange={handleChange}
                className="bg-white text-gray-900 border border-gray-400 
              !border-t-gray-400 focus:!border-gray-900 
              focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Salary Basis
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
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                % of Salary per Leave
              </Typography>
              <Input
                size="md"
                type="number"
                name="salaryPercent"
                placeholder="Percent"
                value={form.salaryPercent}
                onChange={handleChange}
                className="bg-white text-gray-900 border border-gray-400 
              !border-t-gray-400 focus:!border-gray-900 
              focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
              />
            </div>
          </>
        )}
      </div>
    </div>
  </form>
);

export default PolicyForm;
