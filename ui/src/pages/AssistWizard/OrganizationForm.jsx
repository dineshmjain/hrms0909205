
import React from "react";
import { Typography, Input } from "@material-tailwind/react";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Address from "../../components/Address/Address";

const OrganizationForm = ({
  formData,
  handleInputChange,
  listData,
  typeOfIndustryList,
  setFinalData,
  setFormValidity,
}) => {
  return (
    <div className="flex w-full flex-col p-2">
      {/* Dynamic main heading */}
      <Typography  className="text-primary mb-4 font-semibold text-[18px] capitalize  ">
        {formData.structure === "branch"
          ? "Enter Branch Details"
          : formData.structure === "organization"
          ? "Enter Organization Details"
          : "Enter Group Details"}
      </Typography>

      {/* Grid container for inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Group Name (only for group structure) */}
        {formData.structure === "group" && (
          <div className="col-span-1 md:col-span-2">
            <Typography variant="small" className="mb-2 font-medium">
              Group Name
            </Typography>
            <Input
              size="md"
              labelProps={{ className: "hidden" }}
              placeholder="e.g., MWB Technologies"
              value={formData.groupName}
              className="bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
              onChange={(e) => handleInputChange("groupName", e.target.value)}
            />
          </div>
        )}

        {/* Organization / Branch Name */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="small" className="mb-2 font-medium">
            {formData.structure === "branch"
              ? "Branch Name"
              : "Organization Name"}
          </Typography>
          <Input
            size="md"
            labelProps={{ className: "hidden" }}
            placeholder={
              formData.structure === "branch"
                ? "e.g., Mumbai Branch"
                : "e.g., MWB Technologies"
            }
            value={formData.orgName}
            className="bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
            onChange={(e) => handleInputChange("orgName", e.target.value)}
          />
        </div>

        {/* Business Type */}
        <div className="col-span-1 md:col-span-2">
          <Typography variant="small" className="mb-2 font-medium">
            Business Type
          </Typography>
          <SingleSelectDropdown
            feildName="name"
            listData={typeOfIndustryList}
            inputName="Business Type"
            selectedOptionDependency="_id"
            selectedOption={formData?.orgTypeId}
            hideLabel={true}
            handleClick={(value) => {
              if (!value || !value._id) {
                alert("Please select a valid industry");
                return;
              }
              handleInputChange("orgTypeId", value._id); // store only the _id
            }}
          />
        </div>
      </div>

      {/* Address always required, label based on structure */}
      {/* {["branch", "organization", "group"].includes(formData.structure) && (
        <div className="mt-6">
          <Address
            defaultAddressType={
              formData.structure === "branch"
                ? "Branch Address"
                : formData.structure === "organization"
                ? "Organization Address"
                : "Group Address"
            }
            onChange={
              (data) => setFinalData((prev) => ({ ...prev, ...data })) //  spread instead of wrapping
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, address: isValid }))
            }
          />
        </div>
      )} */}
    </div>
  );
};

export default OrganizationForm;
