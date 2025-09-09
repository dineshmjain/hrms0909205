import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-tailwind/react';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../../../components/MultiSelectDropdown/MultiSelectDropdown';

import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { clientBranchListAction } from '../../../redux/Action/ClientBranch/ClientBranchAction';
import { clientDepartmentAction, clientDesignationAction, clientListAction } from '../../../redux/Action/Client/ClientAction';
import { EmployeeClientListAction, EmployeeGetAction } from '../../../redux/Action/Employee/EmployeeAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { DepartmentGetAction } from '../../../redux/Action/Department/DepartmentAction';
import { DesignationGetAction } from '../../../redux/Action/Designation/DesignationAction';

const FilterPanel = ({ type, filtersData, setFiltersData, search, filterType='myOrg', setFilterType, setPage }) => {

  console.log("tyyŷ",filtersData)
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user || {});
  const { subOrgs } = useSelector(state => state.subOrgs || {});
  const { branchList } = useSelector(state => state.branch || {});
  const { clientList = [], clientDepartments = [], clientDesignations = [] } = useSelector(state => state.client || {});
  const { clientBranchList = [] } = useSelector(state => state.clientBranch || {});
  const { departmentList } = useSelector(state => state.department || {});
  const { designationList } = useSelector(state => state.designation || {});
  const { employeeList } = useSelector(state => state.employee || {});

  const [subOrgId, setSubOrgId] = useState('');
  const [clientId, setClientId] = useState();
  const [branchIds, setBranchIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [designationIds, setDesignationIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);

  // Initial Load
  useEffect(() => {
    
if(filterType =="myOrg")
  {
    console.log("FilterPanel mounted with filterType:", filterType);
    setBranchIds([]);
    setFiltersData([]);
  }

    if (filterType === "myOrg" && user?.modules?.["suborganization"]?.r) {
      dispatch(SubOrgListAction()).then(({ payload }) => {
        setPage(1);
        const firstOrg = payload?.data?.[0];
        if (firstOrg) {
          const newOrgId = firstOrg._id;
          setSubOrgId(newOrgId);
          setFiltersData(prev => ({ ...prev, orgIds: [newOrgId] }));
        }
      });
    }

    if (filterType === "clientOrg" && user?.modules?.["client"]?.r) {
      dispatch(clientListAction()).then(({ payload }) => {
        const firstClient = payload?.data?.[0];
        if (firstClient) {
          const newClientId = {
            clientId: firstClient.clientId,
            clientMappedId: firstClient._id,
          };
          setClientId(newClientId);
          setFiltersData(prev => ({ ...prev, clientMappedIds: [newClientId.clientMappedId] }));
        }
      });
    }
  }, [filterType, user]);

  // Org Data
  useEffect(() => {
    if (filterType === 'myOrg') {
      const params = { mapedData: 'branch', orgLevel: true };
      if (user?.modules?.['suborganization']?.r) params.subOrgId = subOrgId;
      dispatch(BranchGetAction(params));
      dispatch(DepartmentGetAction({}));
      dispatch(DesignationGetAction({}));
    }
  }, [filterType, subOrgId]);

  // Client Data
  useEffect(() => {
    if (filterType === 'clientOrg' && clientId?.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId })).then(({ payload }) => {
      
        setFiltersData(prev => ({ ...prev, clientBranchIds: payload?.data?.map(branch => branch._id) || [] }));
      });
    }
  }, [filterType, clientId]);

  useEffect(() => {
    if (filterType === 'clientOrg' && clientId?.clientMappedId) {
      const payload = {
        clientMappedId: clientId.clientMappedId,
        clientBranchIds: branchIds,
      };
      dispatch(clientDepartmentAction(payload));
      dispatch(clientDesignationAction(payload));
    }
  }, [filterType, branchIds, clientId]);

  useEffect(() => {
    if (filterType === 'clientOrg' && clientId?.clientMappedId) {
      dispatch(EmployeeClientListAction(removeEmptyStrings({
        clientMappedId: clientId.clientMappedId,
        clientBranchIds: branchIds,
        departmentIds,
        designationIds,
        category: 'assigned',
      })));
    }
  }, [filterType, branchIds, departmentIds, designationIds, clientId]);

  useEffect(() => {
    if (filterType === 'myOrg' && subOrgId) {
      dispatch(EmployeeGetAction({
        orgIds: [subOrgId],
        branchIds,
        departmentIds,
        designationIds,
        params: ['name'],
      }));
    }
  }, [filterType, subOrgId, branchIds, departmentIds, designationIds]);

  // Update Filters
  useEffect(() => {
    const isMyOrg = filterType === 'myOrg';
    const isClientOrg = filterType === 'clientOrg';

    if (isMyOrg && !subOrgId) return;
    if (isClientOrg && !clientId?.clientMappedId) return;

    const base = {
      branchIds,
      departmentIds,
      designationIds,
      employeeIds,
    };

    const filters = isMyOrg
      ? { ...base, orgIds: [subOrgId] }
      : { ...base, clientBranchIds: branchIds, clientMappedIds: [clientId.clientMappedId] };

    const cleanedFilters = removeEmptyStrings(filters);
    console.log('Updated Filters:', cleanedFilters);
    setFiltersData((prev) => ({ ...prev, ...cleanedFilters }));
    setPage(1);
  }, [subOrgId, clientId?.clientMappedId, branchIds, departmentIds, designationIds, employeeIds]);


  useEffect(() => {
    if (filterType === 'myOrg') {

      
      setFiltersData(removeEmptyStrings({
        orgIds: subOrgId ? [subOrgId] : [],
        branchIds,
        departmentIds,
        designationIds,
        employeeIds
      }));
    }
  
    if (filterType === 'clientOrg') {
      setFiltersData(removeEmptyStrings({
        clientMappedIds: clientId?.clientMappedId ? [clientId.clientMappedId] : [],
        clientBranchIds: branchIds,
        departmentIds,
        designationIds,
        employeeIds
      }));
    }
  }, [filterType]);
  
  return (
    <div>
      <div className="inline-flex rounded-md overflow-hidden shadow my-3 border border-gray-200">
        {['myOrg', 'clientOrg'].map(typeValue => (
          <button
            key={typeValue}
            type="button"
            onClick={() => setFilterType(typeValue)}
            disabled={type === 'edit'}
            className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 
              ${filterType === typeValue ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-gray-100'} 
              ${type === 'edit' && 'cursor-not-allowed opacity-60'}`}
          >
            {typeValue === 'myOrg' ? 'My Organization' : 'Client Organization'}
          </button>
        ))}
      </div>

      <div className='mt-4'>
        {filterType === 'myOrg' ? (
          <OrgFilters
            user={user}
            subOrgs={subOrgs}
            subOrgId={subOrgId}
            setSubOrgId={setSubOrgId}
            branchList={branchList}
            branchIds={branchIds}
            setBranchIds={setBranchIds}
            departmentList={departmentList}
            departmentIds={departmentIds}
            setDepartmentIds={setDepartmentIds}
            designationList={designationList}
            designationIds={designationIds}
            setDesignationIds={setDesignationIds}
            employeeList={employeeList}
            employeeIds={employeeIds}
            setEmployeeIds={setEmployeeIds}
            search={search}
          />
        ) : (
          <ClientFilters
            clientList={clientList}
            clientId={clientId}
            setClientId={setClientId}
            clientBranchList={clientBranchList}
            branchIds={branchIds}
            setBranchIds={setBranchIds}
            clientDepartments={clientDepartments}
            departmentIds={departmentIds}
            setDepartmentIds={setDepartmentIds}
            clientDesignations={clientDesignations}
            designationIds={designationIds}
            setDesignationIds={setDesignationIds}
            employeeList={employeeList}
            employeeIds={employeeIds}
            setEmployeeIds={setEmployeeIds}
            search={search}
          />
        )}
      </div>
    </div>
  );
};

export default FilterPanel;

// Sub-components

const OrgFilters = ({
  user, subOrgs, subOrgId, setSubOrgId, branchList, branchIds, setBranchIds,
  departmentList, departmentIds, setDepartmentIds,
  designationList, designationIds, setDesignationIds,
  employeeList, employeeIds, setEmployeeIds, search
}) => (
  <div className="flex flex-wrap my-2 gap-4">
    {user?.modules?.['suborganization']?.r && (
      <SingleSelectDropdown
        listData={subOrgs}
        feildName="name"
        inputName="Select Organization"
        selectedOptionDependency="_id"
        selectedOption={subOrgId}
        handleClick={sel => setSubOrgId(sel?._id)}
        hideLabel
        showSearch
      />
    )}
    <MultiSelectDropdown data={branchList} selectedData={branchIds} Dependency="_id" FeildName="name" InputName="Branch" setSelectedData={setBranchIds} hideLabel />
    <MultiSelectDropdown data={departmentList} selectedData={departmentIds} Dependency="_id" FeildName="name" InputName="Department" setSelectedData={setDepartmentIds} hideLabel />
    <MultiSelectDropdown data={designationList} selectedData={designationIds} Dependency="_id" FeildName="name" InputName="Designation" setSelectedData={setDesignationIds} hideLabel />
    <MultiSelectDropdown data={employeeList} selectedData={employeeIds} Dependency="_id" FeildName="name" InputName="Employees" setSelectedData={setEmployeeIds} hideLabel type="object" />
    <Button className="bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between" onClick={search}>Search</Button>
  </div>
);

const ClientFilters = ({
  clientList, clientId, setClientId, clientBranchList, branchIds, setBranchIds,
  clientDepartments, departmentIds, setDepartmentIds,
  clientDesignations, designationIds, setDesignationIds,
  employeeList, employeeIds, setEmployeeIds, search
}) => (
  <div className="flex flex-wrap my-2 gap-4">
    <SingleSelectDropdown
      listData={clientList}
      feildName="name"
      inputName="Select Client"
      selectedOptionDependency="clientId"
      selectedOption={clientId?.clientId}
      handleClick={sel => setClientId({ clientId: sel?.clientId, clientMappedId: sel?._id })}
      hideLabel
      showSearch
    />
    <MultiSelectDropdown data={clientBranchList} selectedData={branchIds} Dependency="_id" FeildName="name" InputName="Branches" setSelectedData={setBranchIds} hideLabel />
    <MultiSelectDropdown data={clientDepartments} selectedData={departmentIds} Dependency="_id" FeildName="name" InputName="Departments" setSelectedData={setDepartmentIds} hideLabel />
    <MultiSelectDropdown data={clientDesignations} selectedData={designationIds} Dependency="_id" FeildName="name" InputName="Designations" setSelectedData={setDesignationIds} hideLabel />
    <MultiSelectDropdown data={employeeList} selectedData={employeeIds} Dependency="_id" FeildName="name" InputName="Employees" setSelectedData={setEmployeeIds} hideLabel type="object" />
    <Button className="bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between" onClick={search}>Search</Button>
  </div>
);
