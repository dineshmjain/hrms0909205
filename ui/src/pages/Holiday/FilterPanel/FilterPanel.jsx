import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown/MultiSelectDropdown";
import YearMonthFilter from "../../../components/YearMonthFilter/YearMonthFilter";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { clientListAction } from "../../../redux/Action/Client/ClientAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import { useCheckEnabledModule } from '../../../hooks/useCheckEnabledModule.js'

const FilterPanel = ({
  type,
  filtersData,
  setFiltersData,
  filterType = "myOrg",
  setFilterType,
  setPage,
}) => {
  const dispatch = useDispatch();
  const checkModule = useCheckEnabledModule();
  
  const { user } = useSelector((state) => state.user || {});
  const { subOrgs } = useSelector((state) => state.subOrgs || {});
  const { branchList } = useSelector((state) => state.branch || {});
  const { clientList = [] } = useSelector((state) => state.client || {});
  const { clientBranchList = [] } = useSelector(
    (state) => state.clientBranch || {}
  );

  const [subOrgId, setSubOrgId] = useState("");
  const [clientId, setClientId] = useState();
  const [orgBranchIds, setOrgBranchIds] = useState([]);
  const [clientBranchIds, setClientBranchIds] = useState([]);
  const [year, setYear] = useState(undefined);
  const [month, setMonth] = useState(undefined);
  const [status, setStatus] = useState();

  useEffect(() => {
    if (filterType === "myOrg" && user?.modules?.["suborganization"]?.r) {
      dispatch(SubOrgListAction());
    }

    if (filterType === "clientOrg" && user?.modules?.["client"]?.r) {
      dispatch(clientListAction());
    }
  }, [filterType, user]);

  useEffect(() => {
    if (filterType === "myOrg") {
      const params = { mapedData: "branch", orgLevel: true };
      if (user?.modules?.["suborganization"]?.r) params.subOrgId = subOrgId;
      dispatch(BranchGetAction(params));
    }
  }, [filterType, subOrgId]);

  useEffect(() => {
    if (filterType === "clientOrg" && clientId?.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }))
    }
  }, [filterType, clientId]);

  const clearFilters = () => {
    setSubOrgId("");
    setClientId(undefined);
    setOrgBranchIds([]);
    setClientBranchIds([]);
    setYear("");
    setMonth("");
    setStatus("");
    setFiltersData({});
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="inline-flex rounded-md overflow-hidden shadow border border-gray-200">
        {["myOrg", "clientOrg"].map((typeValue) => (
          <button
            key={typeValue}
            type="button"
            onClick={() => setFilterType(typeValue)}
            disabled={type === "edit"}
            className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
              filterType === typeValue
                ? "bg-primary text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
            } ${type === "edit" && "cursor-not-allowed opacity-60"}`}
          >
            {typeValue === "myOrg" ? "My Organization" : "Client Organization"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        {filterType === "myOrg" ? (
          <>
            {checkModule('suborganization') && 
            (<SingleSelectDropdown
              listData={subOrgs}
              feildName="name"
              inputName="Select Organization"
              selectedOptionDependency="_id"
              selectedOption={subOrgId}
              handleClick={(sel) => setSubOrgId(sel?._id)}
              hideLabel
              showSearch
            />)}
            <MultiSelectDropdown
              data={branchList}
              selectedData={orgBranchIds}
              Dependency="_id"
              FeildName="name"
              InputName="Select Branches"
              setSelectedData={setOrgBranchIds}
              hideLabel
            />
          </>
        ) : (
          <>
            <SingleSelectDropdown
              listData={clientList}
              feildName="name"
              inputName="Select Client"
              selectedOptionDependency="clientId"
              selectedOption={clientId?.clientId}
              handleClick={(sel) =>
                setClientId({
                  clientId: sel?.clientId,
                  clientMappedId: sel?._id,
                })
              }
              hideLabel
              showSearch
            />
            <MultiSelectDropdown
              data={clientBranchList}
              selectedData={clientBranchIds}
              Dependency="_id"
              FeildName="name"
              InputName="Branches"
              setSelectedData={setClientBranchIds}
              hideLabel
            />
          </>
        )}

        {/* Year Month Status */}
        <YearMonthFilter
          selectedFilters={{ year, month }}
          setSelectedFilters={(value) => {
            const newFilters =
              typeof value === "function" ? value({ year, month }) : value;
              console.log('YEAR AND MONTH', newFilters);
              setYear(newFilters.year);
              setMonth(newFilters.month);
          }}
          allowFutureMonths
        />

        <div className="w-40">
          <SingleSelectDropdown
            selectedOption={status}
            inputName="Status"
            listData={[
              { id: "true", name: "Active" },
              { id: "false", name: "Inactive" },
            ]}
            selectedOptionDependency="id"
            feildName="name"
            handleClick={(selected) => setStatus(selected?.id)}
            hideLabel
          />
        </div>

        {/* Search and Clear Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              const base = {
                year,
                month,
                isActive:
                  status === "true"
                    ? true
                    : status === "false"
                    ? false
                    : undefined,
                ...(filterType === "myOrg" && { branchIds: orgBranchIds }),
                ...(filterType === "clientOrg" && { clientBranchIds }),
              };

              const filters =
                filterType === "myOrg"
                  ? { ...base, ...(subOrgId ? { orgIds: [subOrgId] } : {})}
                  : {
                      ...base,
                      clientMappedIds: [clientId?.clientMappedId],
                    };

              const cleaned = removeEmptyStrings(filters);
              setFiltersData(cleaned);
              setPage(1);
            }}
            className="px-3 py-3 bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between"
          >
            Search <PiMagnifyingGlassBold className="w-4 h-4" />
          </Button>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 bg-popLight text-popfont-medium px-3 py-2 rounded-md text-sm hover:bg-popMedium"
          >
            Clear <PiXBold className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
