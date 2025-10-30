import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";

const OrganizationFilter = ({
  setFilterType,
  selectedFilterType,
  type,
}) => {
  const dispatch = useDispatch();
  const { clientList } = useSelector((state) => state?.client);
  const { branchList } = useSelector((state) => state.branch || {});
  const { clientBranchList = [] } = useSelector((state) => state.clientBranch || {});
  const [hasLoadedClientList, setHasLoadedClientList] = useState(false);


  const handleOrgTypeChange = (value) => {
    if (type !== "edit") {
      setFilterType(value);
    }
  };

  return (
    <>
      <div className="inline-flex rounded-md overflow-hidden shadow my-3 border border-gray-200 mb-4">
        <button
          type="button"
          value="myOrg"
          onClick={() => handleOrgTypeChange("myOrg")}
          disabled={type === "edit"}
          className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${selectedFilterType === "myOrg"
            ? "flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-white px-2 py-2 hover:shadow-none text-[12px]"
            : "bg-white text-gray-900 hover:bg-gray-100"
            } ${type === "edit" && "cursor-not-allowed opacity-60"}`}
        >
          My Organization
        </button>
        <button
          type="button"
          value="clientOrg"
          onClick={() => handleOrgTypeChange("clientOrg")}
          disabled={type === "edit"}
          className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${selectedFilterType === "clientOrg"
            ? "flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-white px-2 py-2 text-[12px]"
            : "bg-white text-gray-900 hover:bg-gray-100"
            } ${type === "edit" && "cursor-not-allowed opacity-60"}`}
        >
          Client Organization
        </button>
      </div>

      {/* {selectedFilterType === "myOrg" && (
        <div className="mt-4 max-w-md w-[250px]">
          <MultiSelectDropdown
            data={branchList}
            selectedData={selectedBranch}
            setSelectedData={setSelectedBranch}
            Dependency="_id"
            FeildName="name"
            InputName="branches"
            selectType="multiple"
            enableSearch={true}
            hideLabel={true}
          />
        </div>
      )}

      {selectedFilterType === "clientOrg" && (
        <>
          <div className="flex gap-4">
            <div className="mt-4 max-w-md w-[250px]">
              <SingleSelectDropdown
              listData={clientList}
              selectedOptionDependency="_id"
              feildName="name"
              inputName="Client"
              handleClick={(data) => {
              console.log(data,"data in the log")
                handleChange("clientId", data?.clientId);
                handleChange("clientMappedId", data?._id);
                handleChange("clientName", data?.name);
                if (setSelectedClientBranch) setSelectedClientBranch([]);
                handleChange("clientBranch", []);
                if (data?._id) {
                  dispatch(clientBranchListAction({ clientMappedId: data?._id }));
                }
              }}
              hideLabel={type !== "edit"}
              disabled={type === "edit"}
              selectedOption={selectedClient?._id} // Ensure this is the ID of the selected client
            />
            </div>
            <div className="mt-4 max-w-md w-[250px]">
              {/* <MultiSelectDropdown
                data={clientBranchList}
                selectedData={selectedClientBranch}
                setSelectedData={setSelectedClientBranch}
                Dependency="_id"
                FeildName="name" // Ensure this is set to "name"
                InputName="Client Branches"
                selectType="multiple"
                enableSearch={true}
                hideLabel={true}
              /> 
            </div>
          </div>
        </>
      )} */}
    </>
  );
};

export default OrganizationFilter;
