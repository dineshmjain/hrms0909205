
import React, { useState, useEffect, useCallback } from "react";
import {
    Typography,
    Input,
    Button,
    IconButton,
    Checkbox,
} from "@material-tailwind/react";
import { Plus, Edit2, Save, X, Check, Upload, UploadIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    ShiftCreateAction,
    ShiftGetAction,
    ShiftUpdateAction,
} from "../../redux/Action/Shift/ShiftAction";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import moment from "moment";
import { clientListAction, clientListwithFeildOfficerAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import axiosInstance from "../../config/axiosInstance";
import { removeEmptyStrings } from "../../constants/reusableFun";
import toast from "react-hot-toast";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
import { EmployeeGetAction, EmployeeGetActionForFilter } from '../../redux/Action/Employee/EmployeeAction';
import { useNavigate } from "react-router-dom";
const DEFAULT_SHIFTS = [
    { id: "morning", name: "Morning Shift" },
    { id: "evening", name: "Evening Shift" },
    { id: "night", name: "Night Shift" },
];
const DEFAULT_GENDER = [
    { id: "male", name: "Male" },
    { id: "female", name: "Female" },

];


const ClientBulkRequirementsandCheckPoints = ({}) => {
  
    const checkModules = useCheckEnabledModule()

    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [editingShiftId, setEditingShiftId] = useState(null);
    const { clientList } = useSelector((state) => state?.client);
    const { clientBranchList } = useSelector((state) => state?.clientBranch || {});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedClient, setSelectedClient] = useState();
    const [selectedClientDetails, setSelectedClientDetails] = useState();
    const [selectedClientMappedId, setSelectedClientMappedId] = useState();
    const [requirementList, setRequirementList] = useState([])
    const [selectedBranch, setSelectedBranch] = useState(
        []
    );
    const [searchTerm,setSearchTerm]=useState("")
    useEffect(() => {
        fetchClientBranchRequirements()
    }, [selectedBranch])
    const fetchClientBranchRequirements = async () => {
        if (selectedClient && selectedBranch) {
            try {
                const data = await axiosInstance.post("/client/branch/requirements/list", {
                    "limit": 10,
                    "page": 1,
                    "orgId": selectedClientMappedId, branchId: selectedBranch, clientId: selectedClient
                }).then((res) => res?.data);
                setRequirementList(data?.data)
                // setDesignationList(data?.data);
            } catch (error) {
                console.error('Error fetching designations:', error);
            }

        }
    };
    // Local state for editing
    const [editRow, setEditRow] = useState({
        shiftName: "",
        shiftStartTime: "",
        shiftEndTime: "",
        reportInTimeRequired: false,
        reportInTimeMinutes: "", // Store as minutes
        graceIn: "",
        graceOut: "",
    });
    const [employeeId, setEmployeeId] = useState()
    const { subOrgs } = useSelector((state) => state?.subOrgs || {});
    const { branchList } = useSelector((state) => state?.branch || {});
    const { employeesFilters } = useSelector((state) => state?.employee || {});
    const [designationList, setDesignationList] = useState([])
    // const { designationList } = useSelector((state) => state?.designation || {});
    const [subOrgId, setSubOrgId] = useState()
    const [branchId, setBranchId] = useState()
    const [designationId, setDesignationId] = useState()

    const [currentRequirement, setCurrentRequirement] = useState({
        shiftId: "",
        designationId: "",
        count: 0,
        checkPoints: 0,
        gender: 'male'
    })
    // Load initial data
    useEffect(() => {
        if (checkModules('suborganization', 'r')) {
            dispatch(SubOrgListAction({}));
        } else {
            dispatch(BranchGetAction({}));
        }

    }, [dispatch]);

    useEffect(() => {
        fetchDesignations();
    }, [selectedClient]);

    const fetchDesignations = async () => {
        try {
            const data = await axiosInstance.post("/designation/get/asService", { type: "active" }).then((res) => res?.data);
            setDesignationList(data?.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };

    // Load branches based on subOrg selection
    useEffect(() => {
        if (subOrgId) {
            dispatch(BranchGetAction({ subOrgId: subOrgId }));
        }
    }, [subOrgId, dispatch]);

    // Load employees based on filters
    useEffect(() => {
        const filters = {};
        if (branchId) filters.branchIds = [branchId];
        if (designationId) filters.designationIds = [designationId];

        if (Object.keys(filters).length > 0) {
            dispatch(EmployeeGetActionForFilter(filters));
        }
    }, [branchId]);
    useEffect(() => {
        dispatch(clientListwithFeildOfficerAction());
    }, [dispatch]);

    useEffect(() => {
        if (selectedClientMappedId) {
            dispatch(clientBranchListAction({ clientMappedId: selectedClientMappedId }));
        }
    }, [selectedClientMappedId, dispatch]);

    const { shiftList } = useSelector((state) => state.shift);

    const [newRow, setNewRow] = useState({
        shiftName: "",
        shiftStartTime: "",
        shiftEndTime: "",
        reportInTimeRequired: false,
        reportInTimeMinutes: "", // Store as minutes
    });

    const [isCustomShiftName, setIsCustomShiftName] = useState(false);

    const formatTo12Hour = (time24) => {
        if (!time24) return "—";
        return moment(time24, "HH:mm").format("hh:mm A");
    };
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [desgId, setDesgId] = useState();
    const [gender, setGender] = useState('male');
    useEffect(() => {
        if (selectedClientMappedId && selectedBranch)
            dispatch(ShiftGetAction({
                orgId: selectedClientMappedId,
                branchIds: [selectedBranch],
            }));
    }, [dispatch, selectedBranch, selectedClientMappedId]);
    const handleOpenAssignModal = useCallback((requirement) => {
        setDesgId(requirement?.designationId);
        setGender(requirement?.gender);
        setSelectedRequirement(requirement);
        setSelectedEmployees(requirement.assignedUsers || []);
        setIsAssignModalOpen(true);
    }, []);
    const filteredRequirements =
        selectedBranch && selectedBranch.length > 0
    requirementList

    const handleShiftNameChange = (value) => {
        if (value === "custom") {
            setIsCustomShiftName(true);
            setNewRow((prev) => ({
                ...prev,
                shiftName: "",
                shiftNameType: "custom",
            }));
        } else {
            setIsCustomShiftName(false);
            const selectedShift = DEFAULT_SHIFTS.find((s) => s.id === value);
            setNewRow((prev) => ({
                ...prev,
                shiftName: selectedShift?.name || "",
                shiftNameType: value,
            }));
        }
    };

    const handleSaveShift = async (isNew = false) => {
        const rowData = isNew ? newRow : editRow;

        // 1️⃣ Basic validation
        if (!selectedBranch || selectedBranch.length === 0) {
            toast.error("Please select at least one branch first");
            return;
        }

        if (!rowData.shiftName || !rowData.shiftStartTime || !rowData.shiftEndTime) {
            toast.error("Please fill all required fields");
            return;
        }

        setSaving(true);

        try {
            // 2️⃣ Build base payload
            let payload = {
                name: rowData.shiftName,
                startTime: rowData.shiftStartTime,
                endTime: rowData.shiftEndTime,
                branchIds: selectedBranch,
            };

            // 3️⃣ Handle reportInTime logic
            if (rowData.reportInTimeRequired && rowData.reportInTime) {
                const reportTime = moment(rowData.shiftStartTime, "HH:mm")
                    .subtract(rowData.reportInTime, "minutes")
                    .format("HH:mm");
                payload.reportTimeIn = reportTime;
            } else {
                payload.reportTimeIn = "";
            }

            // 4️⃣ Clean undefined or empty values
            const cleanPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, v]) => v !== undefined && v !== "")
            );

            let resultAction;

            // 5️⃣ Create or update flow
            if (isNew) {
                //   resultAction = await axiosInstance.post('/shift/create', removeEmptyStrings({ ...cleanPayload,clientId:selectedClient,clientMappedId:selectedClientMappedId }));
                resultAction = await dispatch(ShiftCreateAction(removeEmptyStrings({ ...cleanPayload, clientId: selectedClient, clientMappedId: selectedClientMappedId })))

                console.log(removeEmptyStrings({ ...cleanPayload, clientId: selectedClient, clientMappedId: selectedClientMappedId }))

            } else {
                const { branchIds, ...rest } = cleanPayload
                resultAction = await dispatch(
                    ShiftUpdateAction({
                        clientId: selectedClient, clientMappedId: selectedClientMappedId,
                        shiftId: editingShiftId,
                        ...rest,
                    })
                );
            }

            // 6️⃣ Handle result
            const isSuccess =
                (isNew && ShiftCreateAction.fulfilled.match(resultAction)) ||
                (!isNew && ShiftUpdateAction.fulfilled.match(resultAction));

            if (isSuccess) {
                // Reset forms after success
                const resetData = {
                    shiftName: "",
                    shiftStartTime: "",
                    shiftEndTime: "",
                    reportInTimeRequired: false,
                    reportInTime: "",
                };

                if (isNew) {
                    setNewRow(resetData);
                    setIsAddingNew(false);
                    setIsCustomShiftName(false);
                } else {
                    setEditRow(resetData);
                    setEditingShiftId(null);
                }

                // Refresh shifts
                await dispatch(
                    ShiftGetAction({
                        orgId: selectedClientMappedId,
                        branchIds: selectedBranch,
                    })
                );

                if (onSuccess) await onSuccess();
            } else {
                //   toast.error(resultAction.payload?.message || "Failed to save shift");
            }
        } catch (err) {
            console.error("Error saving shift:", err);
            toast.error("Something went wrong while saving shift");
        } finally {
            setSaving(false);
        }
    };


    const handleEditShift = (shift) => {
        let dem = moment(shift?.startTime, 'HH:mm').diff(moment(shift?.reportTimeIn, 'HH:mm'), 'minutes')
        setEditRow({
            shiftId: shift?._id,
            shiftName: shift.name,
            shiftStartTime: shift.startTime,
            shiftEndTime: shift.endTime,
            reportInTimeRequired: !!shift.reportTimeIn,
            reportInTime: dem || "",
            graceIn: "",
            graceOut: "",
        });
        setEditingShiftId(shift._id);
    };

    // const handleCancelEdit = () => {
    //     setEditingShiftId(null);
    //     setEditRow({
    //         shiftName: "",
    //         shiftStartTime: "",
    //         shiftEndTime: "",
    //         reportInTimeRequired: false,
    //         reportInTime: "",
    //         graceIn: "",
    //         graceOut: "",
    //     });
    // };

    const handleCancelNew = () => {
        setIsAddingNew(false);
        setIsCustomShiftName(false);
        setNewRow({
            shiftName: "",
            shiftStartTime: "",
            shiftEndTime: "",
            reportInTimeRequired: false,
            reportInTime: "",
            graceIn: "",
            graceOut: "",
            shiftNameType: "",
        });
    };

    const handleNewRowChange = (field, value) => {
        setNewRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditRowChange = (field, value) => {
        setEditRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleBranchChange = (e, branch) => {
        setIsAddingNew(false);
        setEditingShiftId(null);
        handleCancelEdit();
    };

    const handleAddRequirement = async () => {
        // Validate all fields are filled

        console.log(currentRequirement)
        if (!currentRequirement.shiftId || !currentRequirement.checkPoints ||
            !currentRequirement.designationId || !currentRequirement.gender || !currentRequirement.requiredCount) {
            toast.error("Please fill all fields");
            return;
        }

        // Validate checkpoints is a number
        if (isNaN(currentRequirement.checkPoints) || currentRequirement.checkPoints < 1) {
            toast.error("Please enter a valid checkpoint count");
            return;
        }

        // Validate employee count is a number
        if (isNaN(currentRequirement.requiredCount) || currentRequirement.requiredCount < 1) {
            toast.error("Please enter a valid employee count");
            return;
        }
        const { requiredCount, ...rest } = currentRequirement
        const newRequirement = {
            "clientId": selectedClient,
            "clientMappedId": selectedClientMappedId,
            "branchId": selectedBranch,
            "requirements": [{ ...rest, count: requiredCount }]
        }
        console.log(newRequirement, 'newRequirement')
        // Reset form
        setCurrentRequirement({
            shift: "",
            checkPoints: "",
            designation: "",
            gender: "",
            count: ""
        });

        try {
            const { data } = await axiosInstance.post("/client/branch/requirements/add", newRequirement)
            console.log(data)
            toast.success(data?.message)
            // setIsAdd(true)
            fetchClientBranchRequirements()

        }
        catch (error) {
            // setIsAdd(false)
            console.log(error)
        }
    };

    const [editingId, setEditingId] = useState(null);
    //   const [editRow, setEditRow] = useState({});

    const handleEdit = (row) => {
        setEditingId(row._id);
        setEditRow({
            checkPoints: row.checkPoints,
            requiredCount: row.requiredCount,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditRow({});
    };

    const handleSave = () => {
        // mock save
        console.log("Saved:", editRow);
        setEditingId(null);
    }
    const handleCloseAssignModal = useCallback(() => {
        setIsAssignModalOpen(false);
        setSelectedRequirement(null);
        setSelectedEmployees([]);
        setSearchTerm("")
    }, []);
    const navigate =useNavigate()

    useEffect(() => {
        if (selectedBranch) {
            const clientDetails = selectedClientDetails

            const clientBranches = clientDetails?.branches

            const clientFilteredBranch = clientBranches?.filter((r) => r._id == selectedBranch)

            const asiignedFeildOfficer = clientFilteredBranch?.[0]?.fieldOfficer?.[0]
            const assignments = asiignedFeildOfficer?.assignments?.[0]
            console.log(asiignedFeildOfficer?.assignments?.[0], 'fi clientDetails')
            setSubOrgId(assignments?.subOrgId)
            setBranchId(assignments?.branchId)
            setDesignationId(assignments?.designationId)
            setEmployeeId(asiignedFeildOfficer?._id)
        }
    }, [selectedBranch])

    const handleFieldOfficer = async () => {
        try {
            const temp = {
                clientMappedId: [selectedClientMappedId],
                clientBranchIds: [selectedBranch],
                id: employeeId
            }
            const { data } = await axiosInstance.post('/client/add/fieldOfficer', temp)
            console.log(data)
            toast.success(data?.message)
        }
        catch (error) {
            console.log(error)
        }
    }
    //  const [editingId, setEditingId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const { employeeList } = useSelector((state) => state?.employee);
    const handleStartEdit = useCallback((req, field) => {


        setEditingId(req._id);
        setEditField(field);
        setEditValue(field === 'checkPoints' ? req.checkPoints : req.requiredCount);
    }, []);

    const handleSaveAssignment = useCallback(async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee');
            return;
        }

        try {
            const payload = {
                requirementId: selectedRequirement?._id,
                employeeIds: selectedEmployees?.map((r) => r?._id)
            };

            const { data } = await axiosInstance.post('/client/branch/requirements/employees', payload);

            if (data?.status === 200 || data?.status === "200") {
                // Update local state
                setRequirementList(prev => prev.map(req => {
                    if (req._id === selectedRequirement._id) {
                        return {
                            ...req,
                            assignedCount: selectedEmployees.length,
                            assignedUsers: selectedEmployees
                        };
                    }
                    return req;
                }));

                toast.success(`${selectedEmployees.length} employee(s) assigned successfully`);
                handleCloseAssignModal();
            } else {
                toast.error(data?.message || 'Failed to assign employees');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to assign employees');
        }
    }, [selectedEmployees, selectedRequirement, handleCloseAssignModal]);
    const handleSaveEdit = useCallback(async (reqId) => {
        if (!editValue || editValue.trim() === '') {
            toast.error('Value cannot be empty');
            return;
        }

        const numValue = parseInt(editValue);
        if (isNaN(numValue) || numValue <= 0) {
            toast.error('Please enter a valid positive number');
            return;
        }

        try {
            // Determine which field to update
            const updateField = editField === 'checkPoints' ? 'checkPoints' : 'requiredCount';

            const { data } = await axiosInstance.post("/client/branch/requirements/update", {
                "requirementId": reqId,
                "updates": {
                    [updateField]: numValue
                }
            });

            if (data?.status === "200" || data?.status === 200) {
                // Update local state
                setRequirementList(prev => prev.map(req => {
                    if (req._id === reqId) {
                        return { ...req, [updateField]: numValue };
                    }
                    return req;
                }));

                toast.success(`${editField === 'checkPoints' ? 'Checkpoints' : 'Employee count'} updated successfully`);
                handleCancelEdit();
            } else {
                toast.error(data?.message || 'Failed to update');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to update');
        }
    }, [editValue, editField, handleCancelEdit]);

    useEffect(() => {
        if (selectedRequirement) {
            dispatch(EmployeeGetAction(removeEmptyStrings({
                orgIds: subOrgId ? [subOrgId] : [],
                branchIds: branchId ? [branchId] : [],
                designationIds: desgId ? [desgId] : [],
            })));
        }
    }, [selectedRequirement, desgId, dispatch]);

const getFilteredEmployees = (term = "") => {
  const lowerTerm = term.toLowerCase();
  return employeeList.filter((emp) => {
    const name = `${emp.name.firstName} ${emp.name.lastName}`.toLowerCase();
    return (
      name.includes(lowerTerm) &&
      emp.designation?.designationName === selectedRequirement.designationDetails?.name &&
      emp.gender === selectedRequirement.gender
    );
  });
};
    const handleEmployeeSelection = useCallback((employee) => {
        setSelectedEmployees(prev => {
            const isAlreadySelected = prev.some(emp => emp._id === employee._id);
            if (isAlreadySelected) {
                return prev.filter(emp => emp._id !== employee._id);
            } else {
                if (prev.length >= parseInt(selectedRequirement.requiredCount)) {
                    toast.error('Maximum employee limit reached');
                    return prev;
                }
                return [...prev, employee];
            }
        });
    }, [selectedRequirement]);
    return (
         <div
            className="min-h-screen py-12 px-2 relative overflow-hidden w-full"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #1E40AF 100%)",
            }}
        >
            {/* Subtle animated grid background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" patternUnits="userSpaceOnUse" width="60" height="60">
                            <rect
                                x="0"
                                y="0"
                                width="60"
                                height="60"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-16 relative z-10">
                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
                    {/* Header with Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-blue-600 font-extrabold text-3xl mb-2">
                                Client Bulk Requirements
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Manage client requirements and assignments
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/auth/assist-client/bulkupload")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium shadow-sm"
                            >
                                <UploadIcon className="w-5 h-5" />
                                Bulk Upload
                            </button>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm"
                            >
                             
                                Go to Dashboard
                                   <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

            {/* Branch Selection Row */}
            <div className="flex items-center gap-4 p-4 border border-blue-200 rounded-lg">
                <div>
                    <div className="w-64">

                        <SingleSelectDropdown
                            listData={clientList}
                            selectedOption={selectedClientMappedId}

                            handleClick={(sel) => {
                                setSelectedClient(sel?.clientId);
                                setSelectedClientMappedId(sel?._id);
                                setSelectedClientDetails(sel)
                                setSelectedBranch()
                            }}
                            selectedOptionDependency={"_id"}
                            // FeildName="name"
                            feildName="nickName"
                            inputName="Select Client"
                            enableSearch={true}
                            hideLabel={false}
                            showTip={false}
                        // hideLabel={true}
                        />
                    </div>
                </div>
                <div>
                    <div className="w-64">


                        <SingleSelectDropdown
                            listData={clientBranchList}
                            selectedOption={selectedBranch}
                            handleClick={(sel) => {
                                setSelectedBranch(sel?._id)
                            }}
                            selectedOptionDependency={"_id"}
                            // FeildName="name"
                            feildName="name"
                            inputName="Select Branch"
                            enableSearch={true}
                            hideLabel={false}
                            showTip={false}
                        // hideLabel={true}
                        />
                    </div>
                </div>
                {/* {selectedBranch && selectedBranch.length > 0 && (
                    <div className="flex-1 flex justify-end">
                        <Button
                            size="sm"
                            className="flex items-center gap-2 bg-primary text-white"
                            onClick={() => setIsAddingNew(true)}
                            disabled={isAddingNew || selectedBranch.length === 0}
                        >
                            <Plus size={16} />
                            Add New Shift
                        </Button>
                    </div>
                )} */}
            </div>
            <div className="flex justify-between items-center">
                <Typography variant="h6" className="font-semibold text-gray-800">
                    Assign Organization Field Officer
                </Typography>
            </div>
            {/* Add Feild Officer Details */}
            <div className="flex items-center gap-4 p-4 border border-blue-200 rounded-lg">
                <div>
                    {checkModules('suborganization', 'r') && <div className="w-64">

                        <SingleSelectDropdown
                            listData={subOrgs}
                            selectedOption={subOrgId}
                            handleClick={(sel) => {
                                setSubOrgId(sel._id)
                            }}
                            selectedOptionDependency={"_id"}
                            // FeildName="name"
                            feildName="name"
                            inputName="Select Organization"
                            enableSearch={true}
                            hideLabel={false}
                            showTip={false}
                        // hideLabel={true}
                        />


                    </div>
                    }
                </div>

                <div className="w-64">

                    <SingleSelectDropdown
                        listData={branchList}
                        selectedOption={branchId}
                        handleClick={(sel) => {
                            setBranchId(sel?._id)
                        }}
                        selectedOptionDependency={"_id"}
                        // FeildName="name"
                        feildName="name"
                        inputName="Select Branch"
                        enableSearch={true}
                        hideLabel={false}
                        showTip={false}
                    // hideLabel={true}
                    />
                </div>
                <div className="w-64">
                    <SingleSelectDropdown
                        listData={designationList}
                        selectedOption={designationId}
                        handleClick={(sel) => {
                            setDesignationId(sel?._id)
                        }}
                        selectedOptionDependency={"_id"}
                        // FeildName="name"
                        feildName="name"
                        inputName="Select Designation"
                        enableSearch={true}
                        hideLabel={false}
                        showTip={false}
                    // hideLabel={true}
                    />
                </div>
                <div className="w-64">
                    <SingleSelectDropdown
                        listData={employeesFilters}
                        selectedOption={employeeId}
                        handleClick={(sel) => {
                            setEmployeeId(sel?._id)
                        }}
                        selectedOptionDependency={"_id"}
                        // FeildName="name"
                        feildName="name"
                        inputName="Select Employee"
                        enableSearch={true}
                        hideLabel={false}
                        showTip={false}
                    // hideLabel={true}
                    />


                </div>
                <div className="p-1 mt-6">
                    <Button
                        size="sm"
                        className="flex items-center gap-2 bg-primary text-white"
                        onClick={() => handleFieldOfficer()}

                    >
                        {/* <Plus size={16} /> */}
                        Update
                    </Button>

                </div>

            </div>
            {/* Info Message */}
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <Typography variant="h6" className="font-semibold text-gray-800">
                        Add Requirements
                    </Typography>
                </div>

                {/* Input Section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-blue-200 rounded-lg bg-white">
                    {/* Select Shift */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Select Shift</label>
                        <SingleSelectDropdown
                            listData={shiftList}
                            showSerch={false}
                            feildName="name"
                            hideLabel
                            showTip={false}
                            inputName="Select Shift"
                            selectedOptionDependency={"_id"}
                            selectedOption={currentRequirement?.shiftId}
                            handleClick={(e) =>
                                setCurrentRequirement((prev) => ({ ...prev, shiftId: e?._id }))
                            }
                        />
                    </div>

                    {/* CheckPoint Count */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Enter CheckPoint Count</label>
                        <Input
                            size="md"
                            label="Enter CheckPoint Count"
                            value={currentRequirement?.checkPoints}
                            onChange={(r) =>
                                setCurrentRequirement((prev) => ({ ...prev, checkPoints: r.target.value }))
                            }
                            className="bg-white"
                        />
                    </div>

                    {/* Designation */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Select Designation</label>
                        <SingleSelectDropdown
                            listData={designationList}
                            showSerch={false}
                            feildName="name"
                            hideLabel
                            showTip={false}
                            inputName="Select Designation"
                            selectedOptionDependency={"_id"}
                            selectedOption={currentRequirement?.designationId}
                            handleClick={(e) =>
                                setCurrentRequirement((prev) => ({ ...prev, designationId: e?._id }))
                            }
                        />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Select Gender</label>
                        <SingleSelectDropdown
                            listData={DEFAULT_GENDER}
                            showSerch={false}
                            feildName="name"
                            showTip={false}
                            hideLabel
                            inputName="Select Gender"
                            selectedOptionDependency={"id"}
                            selectedOption={currentRequirement?.gender}
                            handleClick={(e) =>
                                setCurrentRequirement((prev) => ({ ...prev, gender: e?.id }))
                            }
                        />
                    </div>

                    {/* Employee Count + Add Button */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-700 mb-1">Enter Employee Count</label>
                        <div className="flex items-center gap-2">
                            <Input
                                size="md"
                                label="Enter Employee Count"
                                value={currentRequirement?.requiredCount}
                                onChange={(r) =>
                                    setCurrentRequirement((prev) => ({
                                        ...prev,
                                        requiredCount: r.target.value,
                                    }))
                                }
                                className="bg-white flex-1"
                            />
                            <Button
                                color="blue"
                                size="sm"
                                className="h-10 px-4 flex items-center justify-center"
                                onClick={() => handleAddRequirement()}
                            >
                                <Plus size={18} className="mr-1" /> Add
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Shift
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Checkpoints
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Designation
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee Count
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Assigned
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">

                            {requirementList.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {req?.shiftDetails?.name || 'N/A'}
                                    </td>

                                    {/* Editable Checkpoints */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingId === req._id && editField === 'checkPoints' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(req._id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" type='button' />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{req.checkPoints || 0}</span>
                                                <button
                                                    onClick={() => handleStartEdit(req, 'checkPoints')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit Checkpoints"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {req.designationDetails?.name || 'N/A'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                                        {req.gender || 'N/A'}
                                    </td>

                                    {/* Editable Employee Count */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingId === req._id && editField === 'employeeCount' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(req._id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{req.requiredCount || 0}</span>
                                                <button
                                                    onClick={() => handleStartEdit(req, 'employeeCount')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit Employee Count"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.assignedCount > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {req.assignedCount || 0} / {req.requiredCount || 0}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenAssignModal(req)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>

            {saving && (
                <div className="text-center py-2">
                    <Typography className="text-blue-600">Saving...</Typography>
                </div>
            )}


            {/* Assignment Modal */}
            {isAssignModalOpen && selectedRequirement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assign Employees</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedRequirement.shiftDetails?.name} - {selectedRequirement.designationDetails?.name} ({selectedRequirement.gender})
                                </p>
                            </div>
                            <button
                                onClick={handleCloseAssignModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Selection Info */}
                        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    Selected: {selectedEmployees.length} / {selectedRequirement.requiredCount}
                                </span>
                                {selectedEmployees.length >= parseInt(selectedRequirement.requiredCount) && (
                                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                        Maximum limit reached
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Employee List */}
                        <div className="p-6 overflow-y-auto flex-1">
  {/* Search Bar */}
  <div className="mb-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Search employee by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>
    </div>
  </div>

  {/* Employee List */}
  {getFilteredEmployees(searchTerm).length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      <p>No employees found matching the criteria</p>
      <p className="text-sm mt-2">
        Designation: {selectedRequirement.designationDetails?.name}, Gender:{" "}
        {selectedRequirement.gender}
      </p>
    </div>
  ) : (
    <div className="grid gap-3">
      {getFilteredEmployees(searchTerm).map((employee) => {
        const isSelected = selectedEmployees.some(
          (emp) => emp._id === employee._id
        );
        const isDisabled =
          !isSelected &&
          selectedEmployees.length >=
            parseInt(selectedRequirement.requiredCount);

        return (
          <div
            key={employee._id}
            onClick={() => !isDisabled && handleEmployeeSelection(employee)}
            className={`
              p-4 border-2 rounded-lg cursor-pointer transition-all
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                    ${isSelected ? "bg-blue-600" : "bg-gray-400"}
                  `}
                >
                  {employee.name?.firstName.charAt(0)}
                  {employee.name?.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {employee?.name.firstName} {employee?.name.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {employee.designation?.designationName}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>


                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={handleCloseAssignModal}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAssignment}
                                disabled={selectedEmployees.length === 0}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Assignment ({selectedEmployees.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
            </div>
        </div>
    );
};

export default ClientBulkRequirementsandCheckPoints;