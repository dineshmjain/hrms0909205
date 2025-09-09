import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import { clientListAction } from "../../redux/Action/Client/ClientAction";

const OrganizationFilter = ({
  selectedClient,
  setSelectedClient,
  setFilterType,
  selectedFilterType,
  type,
}) => {
  const dispatch = useDispatch();
  const { clientList } = useSelector((state) => state?.client);

  const [hasLoadedClientList, setHasLoadedClientList] = useState(false);

  const handleChange = (name, value) => {
    setSelectedClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   if (selectedFilterType === "clientOrg" ) {
  //     console .log("temp 1")
  //     dispatch(clientListAction({})).then(({ payload }) => {

  //     handleChange("clientId", payload?.data[0]?.clientId);
  //     handleChange("clientMappedId",  payload?.data[0]?._id);
  //     handleChange("clientName", payload?.data[0]?.name);
  //     });
  //   }

  // }, [dispatch]);
  useEffect(() => {
    if (selectedFilterType == "clientOrg" ) {
      dispatch(clientListAction({})).then(({ payload }) => {
      handleChange("clientId", payload?.data[0]?.clientId);
      handleChange("clientMappedId",  payload?.data[0]?._id);
      handleChange("clientName", payload?.data[0]?.name);
      });
    }

   
  }, [dispatch,selectedFilterType]);

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
          className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
            selectedFilterType === "myOrg"
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
          className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
            selectedFilterType === "clientOrg"
              ? "flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-white px-2 py-2 text-[12px]"
              : "bg-white text-gray-900 hover:bg-gray-100"
          } ${type === "edit" && "cursor-not-allowed opacity-60"}`}
        >
          Client Organization
        </button>
      </div>

      {selectedFilterType === "clientOrg" && (
        <div className="mt-4 max-w-md w-[250px]">
          <SingleSelectDropdown
            listData={clientList}
            selectedOptionDependency="clientId"
            feildName="name"
            inputName="Client"
            handleClick={(data) => {
              handleChange("clientId", data?.clientId);
              handleChange("clientMappedId", data?._id);
              handleChange("clientName", data?.name);
              handleChange("clientBranch", []);
            }}
            hideLabel={type !== "edit"}
            disabled={type === "edit"}
            selectedOption={selectedClient?.clientId}
          />
        </div>
      )}
    </>
  );
};

export default OrganizationFilter;
