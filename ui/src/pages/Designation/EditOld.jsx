import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/header/Header';
import BasicInformation from './BasicInformation/BasicInformation';
import Table from '../../components/Table/Table';
import { Switch, Tab, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react';
import { BranchGetAction } from '../../redux/Action/Branch/BranchAction';
import { AssignedModulesAction } from '../../redux/Action/Assignment/assignmentAction';
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
import toast from 'react-hot-toast';
import { DesignationEditAction } from '../../redux/Action/Designation/DesignationAction';

const Edit = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams({ tab: 'branch' });

  const assignedData = useSelector((state) => state.assignments);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const tab = params.get('tab');

  const [isEdit, setIsEdit] = useState(true);
  const [finalData, setFinalData] = useState({});
  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
    kycInfo: true,
    address: true,
  });
  const [selectedId, setSelectedId] = useState();
  const [defaultTab, setDefaultTab] = useState('all');
  const [renderData, setRenderData] = useState([]);

  const tabs = [
    { id: 1, label: 'all', value: 'all' },
    { id: 2, label: 'assigned', value: 'assigned' },
    { id: 3, label: 'unAssigned', value: 'unassigned' },
  ];

  const labels = useMemo(() => ({
    name: { DisplayName: 'Name' },
    assign: {
      DisplayName: 'Assigned',
      type: 'function',
      data: (data) => (
        <Switch circleProps={{ className: 'ml-5' }} value={data?.assign} color="green" />
      ),
    },
  }), []);


  // const handleSave = () => {
  //   setIsEdit(!isEdit);
  //   // Optionally validate and submit
  // };

  const fetchTypeList = useCallback(() => {
    const params = { mappedData: 'branch', orgLevel: true, subOrgId: '' };
    dispatch(BranchGetAction(params));
  }, [dispatch]);




  const handleSave = async () => {
     try{ 
      const isAllValid = Object.values(formValidity).every(Boolean);
  console.log(isAllValid,'isAllValid')
      if (!isAllValid) {
        toast.error('Please complete all required fields before saving.');
        return;
      }
  
      const errors = [];
      const formData = finalData.basicInfo.reduce((acc, field) => {
      
        if (field.required && !field.value?.toString().trim()) {
          errors.push(`${field.label} is required.`);
        }
        acc[field.key] = field.value;
        return acc;
      }, {});
  console.log(formData,errors)
      if (errors.length > 0) {
        toast.error(errors.join('\n'));
        return;
      }else{
  
      try {
        console.log('Form submitted:', formData);
   const result = await dispatch(DesignationEditAction({...formData,designationId:state?._id}));
        const { meta, payload } = result || {};
        console.log(meta,payload,'te')
  
        if (meta?.requestStatus === 'fulfilled') {
          // toast.success(payload?.message || 'Designation created successfully!');
          navigate('/designation');
        } else {
          toast.error(payload?.message || 'Failed to create Designation.');
        }
      } catch (error) {
        console.error('Error creating Designation:', error);
        toast.error('An error occurred while creating the Designation.');
      }
    }
    }catch(error)
    {
       toast.error('An error occurred while creating the Designation.');
    }
    
    };
  const fetchAssignedData = useCallback(async () => {
    if (tab !== "designation") return;

    try {
      const updatedParams = {
        mappedData: "branch",
        orgLevel: true,
        subOrgId: "",
      };
      const result = await dispatch(BranchGetAction(updatedParams));
      const fetchBranch = result?.payload?.data || [];
      const assignedBranch = assignedData?.dataList || [];
      console.log(assignedBranch, 'branches assigned')
      let filteredBranch = [];

      if (defaultTab === "assigned" || defaultTab === "all") {
        filteredBranch = fetchBranch.filter((branch) =>
          assignedBranch.some(
            (assigned) => assigned._id === branch._id && assigned.assigned === true
          )
        );
      } else if (defaultTab === "unassigned") {
        filteredBranch = fetchBranch.filter(
          (branch) =>
            assignedBranch.some(
              (assigned) => assigned._id === branch._id && assigned.assigned === true
            ) ||
            !assignedBranch.some((assigned) => assigned._id === branch._id)
        );
      }

      if (filteredBranch.length > 0) {
        setRenderData(filteredBranch);
        setSelectedId(filteredBranch[0]?._id || null);
      } else {
        setRenderData([{ _id: "no-data", name: "No Mapped Branch" }]);
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  }, [dispatch, tab, defaultTab,]);

  useEffect(() => {
    fetchTypeList();
  }, [fetchTypeList]);

  useEffect(() => {
    if (tab === 'branch') {
      setRenderData(branchList || []);
      setSelectedId(branchList[0]?._id || null);
    } else if (tab === 'designation') {
      fetchAssignedData();
    }
  }, [tab, branchList, designationList, fetchAssignedData]);

  useEffect(() => {
    const el = document.getElementById(tab || 'branch');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [tab]);
const handleEdit=()=>{
  setIsEdit(!isEdit)
}
  return (
    <div className="flex flex-col gap-4 w-full h-full bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Header
        buttonTitle="Save"
        isBackHandler
        isEditAvaliable={isEdit}
        isButton
        handleClick={handleSave}
        handleEdit={handleEdit}
        headerLabel="Designation"
        subHeaderLabel="Edit Your Designation Details"
      />

      <div className="mx-10 flex flex-col gap-4">
        <div className="border-gray-300 pb-2">
          <BasicInformation
            isEditAvaliable={isEdit}
            data={state}
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, basicInfo: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
            }
          />
        </div>
      </div>

      <div className="flex maxsm:flex-col gap-4 border-t-2 bg-white shadow-backgroundHover shadow-sm flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="flex flex-col maxsm:flex-row scrolls gap-2 p-2 border-r-2 border-gray-300 overflow-auto sm:w-32 md:w-44">
          {['branch', 'department'].map((item) => (
            <div
              key={item}
              id={item}
              className={`flex capitalize items-center justify-between p-2 cursor-pointer rounded-lg ${tab === item ? 'bg-pop text-white' : 'hover:bg-gray-200'
                }`}
              onClick={() => handleTabClick(item)}
            >
              <h2 className="text-sm max-w-[25ch] truncate">{item}</h2>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 p-2 w-full overflow-hidden">
          <Tabs value={defaultTab}>
            <div className="flex justify-between p-1 flex-wrap">


              <div defaultValue={"all"}  class="inline-flex rounded-md shadow-xs my-3" role="group" onClick={(e) => { console.log(e.target.value, 'clicked') }}>
                <button defaultChecked={true} type="button" value={"all"} class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-500 hover:text-gray-200 focus:z-10  focus:bg-pop focus:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                  All
                </button>
                <button type="button" value={"assigned"} class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200  hover:bg-gray-500 hover:text-gray-200 focus:z-10  focus:bg-pop focus:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                  Assigned
                </button>
                <button type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-500 hover:text-gray-200 focus:z-10  focus:bg-pop focus:text-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                  Un Assigned
                </button>
              </div>



              {tab === 'designation' && (
                <SingleSelectDropdown
                  hideLabel
                  inputName="Branch"
                  selectedOption={selectedId}
                  handleClick={(data) => setSelectedId(data?._id)}
                  selectedOptionDependency="_id"
                  feildName="name"
                  listData={branchList}
                />
              )}
            </div>

            <TabsBody className="shadow-sm">
              <Table
                tableName={tab}
                tableJson={renderData}
                labels={labels}
              />
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Edit;
