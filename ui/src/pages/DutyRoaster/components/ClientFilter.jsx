import React, { useEffect, useState } from 'react';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../../../components/MultiSelectDropdown/MultiSelectDropdown';
import { EmployeeClientListAction } from '../../../redux/Action/Employee/EmployeeAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { clientDepartmentAction, clientDesignationAction, clientListAction } from '../../../redux/Action/Client/ClientAction';
import { clientBranchListAction } from '../../../redux/Action/ClientBranch/ClientBranchAction';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-tailwind/react';

const ClientFilter = ({ filterType, setFiltersData, selectedFilters, search, setPage, setLimit }) => {
  const dispatch = useDispatch();

  const { clientList = [], clientDepartments = [], clientDesignations = [] } = useSelector(state => state.client || {});
  const { clientBranchList = [] } = useSelector(state => state.clientBranch || {});
  const { employeeList } = useSelector(state => state.employee || {});
  const { user } = useSelector(state => state.user || {});

  const [clientId, setClientId] = useState();
  const [branchIds, setBranchIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [designationIds, setDesignationIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);

  const isClientOrg = filterType === 'clientOrg' && user?.modules?.['client']?.r;

  // Set clientMappedId in filters when client changes
  useEffect(() => {
    if (clientId?.clientMappedId) {
      setFiltersData(prev => ({ ...prev, clientMappedIds: [clientId.clientMappedId] }));
    }
  }, [clientId, setFiltersData]);

  // Set branchIds in filters when branches change
  useEffect(() => {
    setFiltersData(prev => ({ ...prev, clientBranchIds: branchIds }));
  }, [ branchIds && setFiltersData]);

  // Trigger initial fetch on filter type or clientMappedId change
  useEffect(() => {
    if (isClientOrg && clientId?.clientMappedId) {
      setPage(1);
      setLimit(10);
      search(selectedFilters);
    }
  }, [isClientOrg, clientId?.clientMappedId]);

  // Fetch clients on mount if filterType is clientOrg
  useEffect(() => {
    if (isClientOrg) {
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
  }, [isClientOrg, dispatch, setFiltersData]);

  // Fetch client branches when client changes
  useEffect(() => {
    if (isClientOrg && clientId?.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }))
        .then(({ payload }) => {
          const branches = payload?.data || [];
          if (branches.length > 0) {
            const firstBranchId = branches[0]._id;
            setBranchIds([firstBranchId]);
            setFiltersData(prev => ({ ...prev, clientBranchIds: [firstBranchId] }));
          }
        });
    }
  }, [isClientOrg, clientId, dispatch, setFiltersData]);

  // Fetch departments & designations when client/branch changes
  useEffect(() => {
    if (isClientOrg && clientId?.clientMappedId && branchIds.length > 0) {
      const payload = {
        clientMappedId: clientId.clientMappedId,
        clientBranchIds: branchIds,
      };
      dispatch(clientDepartmentAction(payload));
      dispatch(clientDesignationAction(payload));
    }
  }, [isClientOrg, clientId, branchIds, dispatch]);

  // Fetch employees when filters change
  useEffect(() => {
    if (isClientOrg && clientId?.clientMappedId && branchIds.length > 0) {
      const updatedData = removeEmptyStrings({
        ...selectedFilters,
        branchIds: [],
        clientMappedId: clientId?.clientMappedId,
        clientMappedIds: [],
        category: 'assigned',
      });
      dispatch(EmployeeClientListAction(updatedData));
    }
  }, [isClientOrg, branchIds, departmentIds, designationIds, clientId, selectedFilters, dispatch]);

  return (
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
      <MultiSelectDropdown
        data={clientBranchList}
        selectedData={branchIds}
        Dependency="_id"
        FeildName="name"
        InputName="Branches"
        setSelectedData={setBranchIds}
        hideLabel
      />
      <MultiSelectDropdown
        data={clientDepartments}
        selectedData={departmentIds}
        Dependency="_id"
        FeildName="name"
        InputName="Departments"
        setSelectedData={setDepartmentIds}
        hideLabel
      />
      <MultiSelectDropdown
        data={clientDesignations}
        selectedData={designationIds}
        Dependency="_id"
        FeildName="name"
        InputName="Designations"
        setSelectedData={setDesignationIds}
        hideLabel
      />
      <MultiSelectDropdown
        data={employeeList}
        selectedData={employeeIds}
        Dependency="_id"
        FeildName="name"
        InputName="Employees"
        setSelectedData={setEmployeeIds}
        hideLabel
        type="object"
      />
      <Button
        className="bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between"
        onClick={() => search(selectedFilters)}
      >
        Search
      </Button>
    </div>
  );
};

export default ClientFilter;
