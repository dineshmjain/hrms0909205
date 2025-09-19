import { useEffect, useState } from "react";
import { Dialog, DialogBody, Typography, Button } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import DatePicker from "./DatePicker";
import { format } from "date-fns";

const SwapFilterDialog = ({
  openFilter,
  setOpenFilter,
  filterType,
  setFilterType,
  checkModules,
  orgs,
  branches,
  departments,
  designations,
  clients,
  employeeList,
  orgId,
  branchId,
  departmentId,
  designationId,
  clientId,
  clientMappedId,
  clientBranchId,
  employeeId,
  setOrgId,
  setBranchId,
  setDepartmentId,
  setDesignationId,
  setClientId,
  setClientMappedId,
  setClientBranchId,
  setEmployeeId,
  setShiftBEmpDetails,
  callRequiredFields,
  shiftBDate,
  setShiftBDate,
  shiftBId,
  setShiftBId,
  shiftsForTheDay
}) => {

  return (
    <Dialog open={openFilter} handler={() => setOpenFilter(!openFilter)} size="md">
      <DialogBody className="bg-gray-50">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Typography className="font-semibold text-gray-700">
              Select Employee
            </Typography>
            <Button
              onClick={() => setOpenFilter(!openFilter)}
              className="bg-primary hover:bg-primaryLighter"
            >
              Save
            </Button>
          </div>

            {/* Toggle */}
            <div className="flex justify-between">
            <div className="inline-flex w-fit overflow-hidden shadow rounded-lg border border-gray-200">
                {["myOrg", "clientOrg"].map((typeValue) => (
                <button
                    key={typeValue}
                    type="button"
                    onClick={() => setFilterType(typeValue)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-150 
                    ${filterType === typeValue
                        ? "bg-primary text-white"
                        : "bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                >
                    {typeValue === "myOrg" ? "My Organization" : "Client Organization"}
                </button>
                ))}
            </div>
            <div>
                <DatePicker date={shiftBDate} setDate={setShiftBDate} />
            </div>
            </div>

          {/* Filters */}
          <div className="flex flex-col gap-6">
            <div>
                <Typography variant="h6" className="text-gray-800 mb-3">
                Employee Filters
                </Typography>
                <div className="flex flex-wrap gap-3">
                {filterType === "myOrg" ? (
                    <>
                    {checkModules("suborganization", "r") && (
                        <SingleSelectDropdown
                        listData={orgs}
                        selectedOptionDependency="_id"
                        inputName="Organization"
                        selectedOption={orgId}
                        handleClick={(d) => setOrgId(d?._id)}
                        hideLabel
                        />
                    )}
                    <SingleSelectDropdown
                        listData={branches}
                        selectedOptionDependency="_id"
                        inputName="Branch"
                        selectedOption={branchId}
                        handleClick={(d) => setBranchId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={departments}
                        selectedOptionDependency="_id"
                        inputName="Department"
                        selectedOption={departmentId}
                        handleClick={(d) => setDepartmentId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={designations}
                        selectedOptionDependency="_id"
                        inputName="Designation"
                        selectedOption={designationId}
                        handleClick={(d) => setDesignationId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={employeeList}
                        selectedOptionDependency="_id"
                        inputName="Employee"
                        selectedOption={employeeId}
                        handleClick={(d) => {
                        setEmployeeId(d?._id);
                        setShiftBEmpDetails(d);
                        }}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={shiftsForTheDay}
                        selectedOptionDependency="_id"
                        inputName="Shift To Swap"
                        selectedOption={shiftBId}
                        handleClick={(d) => {
                        setShiftBId(d?._id);
                        }}
                        hideLabel
                    />
                    </>
                ) : (
                    <>
                    <SingleSelectDropdown
                        listData={clients}
                        selectedOptionDependency="clientId"
                        inputName="Client"
                        selectedOption={clientId}
                        handleClick={(d) => {
                        setClientId(d?.clientId);
                        setClientMappedId(d?._id);
                        }}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={branches}
                        selectedOptionDependency="_id"
                        inputName="Branch"
                        selectedOption={clientBranchId}
                        handleClick={(d) => setClientBranchId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={departments}
                        selectedOptionDependency="_id"
                        inputName="Department"
                        selectedOption={departmentId}
                        handleClick={(d) => setDepartmentId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={designations}
                        selectedOptionDependency="_id"
                        inputName="Designation"
                        selectedOption={designationId}
                        handleClick={(d) => setDesignationId(d?._id)}
                        hideLabel
                    />
                    <SingleSelectDropdown
                        listData={employeeList}
                        selectedOptionDependency="_id"
                        inputName="Employee"
                        selectedOption={employeeId}
                        handleClick={(d) => {
                        setEmployeeId(d?._id);
                        setShiftBEmpDetails(d);
                        }}
                        hideLabel
                    />
                    </>
                )}
                </div>
            </div>
          </div>

        </div>
      </DialogBody>
    </Dialog>
  );
};

export default SwapFilterDialog;
