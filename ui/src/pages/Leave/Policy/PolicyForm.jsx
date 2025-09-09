import React from "react";
import { Typography, Input } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import { PiInfoBold } from "react-icons/pi";
import SubCardHeader from "../../../components/header/SubCardHeader";

const PolicyForm = ({
  form,
  errors,
  handleChange,
  handleDropdownChange,
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
            Name
          </Typography>
          <Input
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            size="md"
            labelProps={{ className: "hidden" }}
            placeholder="Enter Leave Name"
            value={form.leaveName}
            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            name="leaveName"
            onChange={(e) => {
              handleChange(e)
              setErrors((prev) => ({ ...prev, leaveName: null }))
            }}
            error={!!errors.leaveName}
          />
          {errors.leaveName && (
            <Typography color="red" className="text-xs mt-1">
              {errors.leaveName}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Repeat Cycle
          </Typography>
          <SingleSelectDropdown
            disabled={isEditAvaliable}
            feildName="label"
            listData={typeList}
            inputName="Type"
            selectedOption={form?.type?.label}
            hideLabel={true}
            handleClick={handleDropdownChange("type")}
          />
          {errors.type && (
            <Typography color="red" className="text-xs mt-1">
              {errors.type}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            No Of Days
          </Typography>
          <Input
            size="md"
            type="number"
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            labelProps={{ className: "hidden" }}
            placeholder="No Of Days"
            value={form.days}
            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            name="days"
            onChange={(e) => {
              handleChange(e);
              setErrors((prev) => ({ ...prev, days: null }));
               }}
              onKeyDown = {(e) => {
                  if (e.key === 'e' ||e.key === 'E' ||e.key === '+' ||e.key === '-') {
                       e.preventDefault();
                 }
               }}
          error={!!errors.days}
          />
          {errors.days && (
            <Typography color="red" className="text-xs mt-1">
              {errors.days}
            </Typography>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {form.type && (form.type.value === "monthly" || form.type.value === "yearly") && (
          <div>
            <Typography variant="small" className="mb-2 flex items-center gap-1 font-medium">
              Credited Day
              <TooltipMaterial content={"Leave will be credited to employee on the specific date of every month"}>
                <PiInfoBold className="w-5 h-5" />
              </TooltipMaterial>
            </Typography>
            <SingleSelectDropdown
              disabled={isEditAvaliable}
              style={{
                backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
              }}
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
        )}
        {form.type && form.type.value === "yearly" && (
          <div>
            <Typography variant="small" className="mb-2 flex items-center gap-1 font-medium">
              Credited Month
              <TooltipMaterial content={"Leave will be credited to employee on the specific month of every year"}>
                <PiInfoBold className="w-5 h-5" />
              </TooltipMaterial>
            </Typography>
            <SingleSelectDropdown
              disabled={isEditAvaliable}
              style={{
                backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
              }}
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
      </div>
    </div>

    {/* Eligibility Section */}
    <div className="flex flex-col gap-2 p-2 mb-2">
      <SubCardHeader headerLabel="Eligibility" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Gender
          </Typography>
          <SingleSelectDropdown
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            feildName="label"
            listData={genders}
            inputName="Select Gender"
            selectedOption={form?.gender?.label}
            hideLabel={true}
            handleClick={handleDropdownChange("gender")}
          />
          {errors.gender && (
            <Typography color="red" className="text-xs mt-1">
              {errors.gender}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Eligible (No Of Days)
          </Typography>
          <Input
            size="md"
            type="number"
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            labelProps={{ className: "hidden" }}
            placeholder="No Of Days"
            value={form.eligibleNoOfDays}
            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            name="eligibleNoOfDays"
            onChange={(e) => {
              handleChange(e);
              setErrors((prev) => ({ ...prev, eligibleNoOfDays: null }));
            }}
              onKeyDown = {(e) => {
                  if (e.key === 'e' ||e.key === 'E' ||e.key === '+' ||e.key === '-') {
                       e.preventDefault();
                 }
               }}
            error={!!errors.eligibleNoOfDays}
          />
          {errors.eligibleNoOfDays && (
            <Typography color="red" className="text-xs mt-1">
              {errors.eligibleNoOfDays}
            </Typography>
          )}
        </div>
      </div>
    </div>

    {/* Payment & Approval Section */}
    <div className="flex flex-col gap-2 p-2">
      <SubCardHeader headerLabel="Payment & Approval" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Approval Type
          </Typography>
          <SingleSelectDropdown
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            feildName="label"
            listData={appTypes}
            inputName="Approval Type"
            selectedOption={form?.appType.label}
            hideLabel={true}
            handleClick={handleDropdownChange("appType")}
          />
          {errors.appType && (
            <Typography color="red" className="text-xs mt-1">
              {errors.appType}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Paid Type
          </Typography>
          <SingleSelectDropdown
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            feildName="label"
            listData={paidTypes}
            inputName="Paid Type"
            selectedOption={form?.paidType?.label}
            hideLabel={true}
            handleClick={handleDropdownChange("paidType")}
          />
          {errors.paidType && (
            <Typography color="red" className="text-xs mt-1">
              {errors.paidType}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Apply Before Days
          </Typography>
          <Input
            size="md"
            type="number"
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            labelProps={{ className: "hidden" }}
            placeholder="Apply Before Days"
            value={form.applyBeforeDays}
            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            name="applyBeforeDays"
            onChange={(e) => {
              handleChange(e);
              setErrors((prev) => ({ ...prev, applyBeforeDays: null }));
            }}
              onKeyDown = {(e) => {
                  if (e.key === 'e' ||e.key === 'E' ||e.key === '+' ||e.key === '-') {
                       e.preventDefault();
                 }
               }}
            error={!!errors.applyBeforeDays}
          />
          {errors.applyBeforeDays && (
            <Typography color="red" className="text-xs mt-1">
              {errors.applyBeforeDays}
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="small" className="mb-2 font-medium">
            Apply After Days
          </Typography>
          <Input
            size="md"
            type="number"
            disabled={isEditAvaliable}
            style={{
              backgroundColor: isEditAvaliable ? "white" : "white" // light gray when disabled
            }}
            labelProps={{ className: "hidden" }}
            placeholder="Apply After Days"
            value={form.applyAfterDays}
            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            name="applyAfterDays"
            onChange={(e) => {
              handleChange(e);
              setErrors((prev) => ({ ...prev, applyAfterDays: null }));
            }}
              onKeyDown = {(e) => {
                 if (e.key === 'e' ||e.key === 'E' ||e.key === '+' ||e.key === '-') {
                       e.preventDefault();
                 }
               }}
            error={!!errors.applyAfterDays}
          />
          {errors.applyAfterDays && (
            <Typography color="red" className="text-xs mt-1">
              {errors.applyAfterDays}
            </Typography>
          )}
        </div>
      </div>
    </div>
  </form>
);

export default PolicyForm;