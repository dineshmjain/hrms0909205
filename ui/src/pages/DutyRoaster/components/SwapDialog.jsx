import {
    Button,
    Card,
    Dialog,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { IoMdSwap } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { subOrgListApi } from "../../../apis/Organization/Organization";
import { clientBranchListApi } from "../../../apis/Client/ClientBranch";
import { clientDepartments, clientListApi } from "../../../apis/Client/Client";
import { BranchGetApi } from "../../../apis/Branch/Branch";
import { DesignationListApi } from "../../../apis/Designation/Designation";
import { DepartmentGetApi } from "../../../apis/Department/Department";
import { EmployeeClientListApi, EmployeeListApi } from "../../../apis/Employee/Employee";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { getShiftByDateApi } from "../../../apis/Shift/Shift";
import { useDispatch } from "react-redux";
import { ShiftSwapbyDateAction } from "../../../redux/Action/Shift/ShiftAction";
// hypothetical save API
// import { swapShiftsApi } from "../../../apis/Shift/Swap"; 

const SwapDialog = ({
    swapDiv,
    setSwapDiv,
    empDetails,
    shiftDetails,
    selectedDate,
    refrencesData,
    getShifts
}) => {
    const checkModules = useCheckEnabledModule();
    const dispatch = useDispatch()
    const [branches, setBranches] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [clients, setClients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeId, setEmployeeId] = useState(null);
    const [orgId, setOrgId] = useState(null);
    const [clientId, setClientId] = useState(null);
    const [branchId, setBranchId] = useState(null);
    const [designationId, setDesignationId] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const [clientMappedId, setClientMappedId] = useState(null);
    const [clientBranchId, setClientBranchId] = useState(null);
    const [swapEmpDetails, setSwapEmpDetails] = useState({});
    const [filterType, setFilterType] = useState("myOrg");
    const [openFilter, setOpenFilter] = useState(false);
    const [swapEmpShiftDetails, setswapEmpShiftDetails] = useState([]);

    // make fromShift stateful

    const [fromShiftState, setFromShiftState] = useState(
        []
    );
    useEffect(() => {
        setFromShiftState(empDetails?.dates?.[selectedDate] || [])
    }, [selectedDate, empDetails])
    const formattedDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        })
        : "";

    const getInitials = (name) =>
        name
            ? name
                .trim()
                .split(/\s+/)
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "";

    useEffect(() => {
        if (filterType === "clientOrg") {
            getClientList();
        }
             getBranches();
            getDepartments();
            getDesignations();
     

    }, [orgId, filterType, clientMappedId, clientBranchId]);

    useEffect(() => {
        getEmployees();
    }, [orgId, branchId, designationId, departmentId, clientId, clientBranchId]);

    useEffect(() => {
        getShiftDetails();
    }, [employeeId]);

    const getShiftDetails = async () => {
        try {
            if (!employeeId) return;
            const params = {
                startDate: selectedDate,
                endDate: selectedDate,
                limit: 1,
                page: 1,
                isClient: filterType === "clientOrg",
                orgIds: [orgId],
                employeeIds: [employeeId]
            };
            const response = await getShiftByDateApi(removeEmptyStrings(params));
            setswapEmpShiftDetails(response?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const callRequiredFields = async () => {
        try {
            if (filterType === "myOrg") {
                if (checkModules("suborganization", "r")) {
                    await getOrgs();
                } else {
                    await getBranches();
                    await getDepartments();
                    await getDesignations();
                }
            } else {
                console.log("Client Org selected");
                await getClientList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getOrgs = async () => {
        try {
            const response = await subOrgListApi({});
            setOrgs(response?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    const getBranches = async () => {
        try {
            const params = checkModules("suborganization", "r")
                ? filterType === "clientOrg"
                    ? { clientMappedId }
                    : { subOrgId: orgId }
                : {};

            const response =
                filterType === "myOrg"
                    ? await BranchGetApi(params)
                    : await clientBranchListApi(params);

            setBranches(response?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const getEmployees = async () => {
        try {
            if (filterType == "myOrg") {
                const params = removeEmptyStrings({
                    orgIds: [orgId],
                    branchIds: [branchId],
                    designationIds: [designationId],
                    departmentIds: [departmentId]
                });
                const response = await EmployeeListApi(params);
                setEmployeeList(response?.data || []);
            }
            if (clientBranchId && filterType === "clientOrg") {
                let params = removeEmptyStrings({
                    "clientMappedId": clientMappedId,
                    "clientBranchIds": [clientBranchId],

                    "category": "assigned"
                })

                console.log("params",clientId, params);
                const response = await EmployeeClientListApi(params);
                setEmployeeList(response?.data?.data || []);

                const findIsEmployeeExists = response?.data?.data?.includes((r) => r._id === empDetails?._id);

                console.log("findIsEmployeeExists",empDetails?._id, findIsEmployeeExists);
                if(response?.data?.data > 0 && findIsEmployeeExists===false) {
                 toast.error("Employee not found in this client branch or client organization you can not swap shifts");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDepartments = async () => {
        try {
            let response = ""

            console.log("filterType", filterType)
            if (filterType === "clientOrg" && clientBranchId) {
                response = await clientDepartments({
                    clientMappedId:clientMappedId, clientBranchIds: [clientBranchId]
                })
            }
            else {
                response = await DepartmentGetApi();
            }
            console.log("departments", response);
            setDepartments(response?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const getDesignations = async () => {
        try {
            let response = ""

            console.log("filterType", filterType)
            if (filterType === "clientOrg" && clientBranchId) {
                response = await clientDepartments({
                    clientMappedId: clientMappedId, clientBranchIds: [clientBranchId]
                })
            }
            else {
                response = await DesignationListApi();
            }
            console.log("designations", response);
            setDesignations(response?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const getClientList = async () => {
        try {
            const response = await clientListApi({});
            console.log("clients", response);
            setClients(response?.data || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch client list");
        }
    };

    // ---- SHIFT SWAP FUNCTION ----
    const handleSwapShifts = () => {
        if (!fromShiftState.length && !swapEmpShiftDetails.length) {
            toast.warn("No shifts to swap");
            return;
        }
        const swapShifts = swapEmpShiftDetails?.[0]?.dates?.[selectedDate] || [];
        const newFromShifts = [...swapShifts];
        const newSwapShifts = [...fromShiftState];
        // update local states
        setFromShiftState(newFromShifts);
        setswapEmpShiftDetails((prev) => {
            if (!prev.length) return prev;
            const updated = [...prev];
            updated[0] = {
                ...updated[0],
                dates: {
                    ...updated[0].dates,
                    [selectedDate]: newSwapShifts
                }
            };
            return updated;
        });
        // toast.success("Shifts swapped in UI");
    };

    // ---- CONFIRM SWAP FUNCTION ----
    // ---- CONFIRM SWAP FUNCTION ----
    const handleConfirmSwap = async () => {
        try {
            const fromShift = fromShiftState?.[0];
            const toShift = swapEmpShiftDetails?.[0]?.dates?.[selectedDate]?.[0];

            // Validation: Check if both shiftId and branchId match
            if (
                fromShift?.shiftId &&
                toShift?.shiftId &&
                fromShift?.branchId &&
                toShift?.branchId &&
                fromShift.shiftId === toShift.shiftId &&
                fromShift.branchId === toShift.branchId
            ) {
                toast.error("Cannot be swapped because same shift assigned");
                return; // Stop execution
            }

            const payload = {
                date: selectedDate,
                fromEmployeeId: empDetails?._id,
                toEmployeeId: swapEmpDetails?._id,
            };

            console.log(payload, "payload");
            dispatch(ShiftSwapbyDateAction(payload));
            setSwapDiv(false);
            getShifts()
        } catch (error) {
            console.log(error);
            toast.error("Failed to save shift swap");
        }
    };


    return (
        <Dialog open={swapDiv} handler={() => setSwapDiv(false)} size="xl">
            {/* Filter Dialog */}
        <ToastContainer position="top-right" autoClose={3000} />
            <Dialog
                open={openFilter}
                handler={() => setOpenFilter(!openFilter)}
                size="lg"
            >
                <DialogBody>
                        <ToastContainer position="top-right" autoClose={3000} />
                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-md shadow-sm text-sm justify-between">
                        <div className="bg-white w-full">
                            <div className="flex justify-between">
                                <span className="font-medium text-gray-600 flex gap-2">
                                    Select Employee
                                </span>
                                <Button
                                    onClick={() => {
                                        setOpenFilter(!openFilter);
                                    }}
                                    className="bg-primary hover:bg-primaryLighter hover:text-primary"
                                >
                                    Save
                                </Button>
                            </div>
                            {/* Org toggle */}
                            <div className="inline-flex overflow-hidden shadow border border-gray-200 mb-4">
                                {["myOrg", "clientOrg"].map((typeValue) => (
                                    <button
                                        key={typeValue}
                                        type="button"
                                        onClick={() => setFilterType(typeValue)}
                                        className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 
                                            ${filterType === typeValue
                                                ? "bg-primary text-white"
                                                : "bg-white text-gray-900 hover:bg-gray-100"
                                            }`}
                                    >
                                        {typeValue === "myOrg"
                                            ? "My Organization"
                                            : "Client Organization"}
                                    </button>
                                ))}
                            </div>

                            {/* Filters */}
                            {filterType === "myOrg" ? (
                                <div className="flex flex-wrap gap-2">
                                    {checkModules("suborganization", "r") && (
                                        <SingleSelectDropdown
                                            listData={orgs}
                                            selectedOptionDependency={"_id"}
                                            hideLabel
                                            inputName="Select Organization"
                                            selectedOption={orgId}
                                            handleClick={(d) =>
                                                setOrgId(d?._id)
                                            }
                                        />
                                    )}
                                    <SingleSelectDropdown
                                        listData={branches}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Branch"
                                        selectedOption={branchId}
                                        handleClick={(d) =>
                                            setBranchId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={departments}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Department"
                                        selectedOption={departmentId}
                                        handleClick={(d) =>
                                            setDepartmentId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={designations}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Designation"
                                        selectedOption={designationId}
                                        handleClick={(d) =>
                                            setDesignationId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={employeeList}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Employee"
                                        selectedOption={employeeId}
                                        handleClick={(d) => {
                                            setEmployeeId(d?._id);
                                            setSwapEmpDetails(d);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <SingleSelectDropdown
                                        listData={clients}
                                        selectedOptionDependency={"clientId"}
                                        hideLabel
                                        inputName="Select Client"
                                        selectedOption={clientId}
                                        handleClick={(d) => {
                                            console.log(d, "clientId");
                                            setClientId(d?.clientId)
                                            setClientMappedId(d?._id);

                                        }
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={branches}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Branch"
                                        selectedOption={clientBranchId}
                                        handleClick={(d) =>
                                            setClientBranchId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={departments}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Department"
                                        selectedOption={departmentId}
                                        handleClick={(d) =>
                                            setDepartmentId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={designations}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Designation"
                                        selectedOption={designationId}
                                        handleClick={(d) =>
                                            setDesignationId(d?._id)
                                        }
                                    />
                                    <SingleSelectDropdown
                                        listData={employeeList}
                                        selectedOptionDependency={"_id"}
                                        hideLabel
                                        inputName="Select Employee"
                                        selectedOption={employeeId}
                                        handleClick={(d) => {
                                            setEmployeeId(d?._id);
                                            setSwapEmpDetails(d);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </DialogBody>
            </Dialog>

            {/* Main Swap Dialog */}
            <DialogBody className="flex flex-col gap-2 bg-white">
                <Header
                    headerLabel="Swap Shift"
                    subHeaderLabel="Easily request and manage shift swaps"
                    isButton={false}
                    buttonTitle="Update"
                />
                {/* Date row */}
                <div className="flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-md shadow-sm text-sm justify-between">
                    <span className="font-medium text-gray-600 flex gap-2">
                        Swapping for:
                        <Typography
                            variant="small"
                            className="font-semibold text-blue-700"
                        >
                            {formattedDate}
                        </Typography>
                    </span>
                    <span className="font-medium text-gray-600 flex items-center gap-2">
                        Select Employee
                        <IconButton
                            onClick={() => {
                                setOpenFilter(true);
                                callRequiredFields();
                            }}
                            className="bg-primary"
                        >
                            <FaUser />
                        </IconButton>
                    </span>
                </div>

                {/* Selection Panels */}
                <div className="flex flex-col md:flex-row gap-2">
                    {/* From Employee */}
                    <Card className="flex-1 p-2 shadow-sm border-2 border-gray-100">
                        <div className="border gap-2 flex flex-col p-2">
                            <Typography className="text-lg font-medium text-gray-900">
                                {empDetails?.name?.firstName}{" "}
                                {empDetails?.name?.lastName}
                            </Typography>
                            <Typography className="mb-2 text-sm text-gray-700">
                                Designation:{" "}
                                {
                                    refrencesData?.userIds?.[empDetails?._id]
                                        ?.designation?.name
                                }
                            </Typography>
                        </div>
                        {fromShiftState?.filter((r) => r?.shiftId !== "WO").map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <div className="flex flex-col w-full">
                                    <Typography className="text-xs font-semibold">
                                        {!item?.clientId
                                            ? "My Organization"
                                            : "Client Organization"}
                                    </Typography>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-7 w-7 rounded-md flex items-center justify-center"
                                            style={{
                                                backgroundColor:
                                                    refrencesData?.shiftId[
                                                        item?.shiftId
                                                    ]?.bgColor
                                            }}
                                        >
                                            <Typography
                                                className="text-xs font-semibold"
                                                style={{
                                                    color:
                                                        refrencesData?.shiftId[
                                                            item?.shiftId
                                                        ]?.textColor
                                                }}
                                            >
                                                {getInitials(
                                                    refrencesData?.shiftId[
                                                        item?.shiftId
                                                    ]?.name
                                                )}
                                            </Typography>
                                        </div>
                                        <span className="text-sm">
                                            {
                                                refrencesData?.shiftId[
                                                    item?.shiftId
                                                ]?.name
                                            }
                                        </span>
                                        <span className="text-sm">
                                            {item?.startTime ||
                                                refrencesData?.shiftId[
                                                    item?.shiftId
                                                ]?.startTime}
                                        </span>
                                        <span className="text-sm">
                                            {item?.endTime ||
                                                refrencesData?.shiftId[
                                                    item?.shiftId
                                                ]?.endTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Card>

                    {/* Swap Icon */}
                    <div className="flex flex-col items-center justify-center">
                        <IconButton variant="text" size="md" onClick={handleSwapShifts}>
                            <IoMdSwap className="h-5 w-5" />
                        </IconButton>
                    </div>

                    {/* To Employee */}
                    <Card className="flex-1 p-2 shadow-sm border-2 border-gray-100">
                        <div className="border gap-2 flex flex-col p-2">
                            <Typography className="text-lg font-medium text-gray-900">
                                {swapEmpDetails?.name?.firstName}{" "}
                                {swapEmpDetails?.name?.lastName}
                            </Typography>
                            <Typography className="mb-2 text-sm text-gray-700">
                                Designation:{" "}
                                {swapEmpDetails?.designation?.designationName}
                            </Typography>
                        </div>
                        {swapEmpShiftDetails.map((emp, ida) =>
                            emp?.dates?.[selectedDate]?.filter((r) => r?.shiftId !== "WO")?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <div className="flex flex-col w-full">
                                        <Typography className="text-xs font-semibold">
                                            {!item?.clientId
                                                ? "My Organization"
                                                : "Client Organization"}
                                        </Typography>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-7 w-7 rounded-md flex items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        refrencesData?.shiftId[
                                                            item?.shiftId
                                                        ]?.bgColor
                                                }}
                                            >
                                                <Typography
                                                    className="text-xs font-semibold"
                                                    style={{
                                                        color:
                                                            refrencesData
                                                                ?.shiftId[
                                                                item?.shiftId
                                                            ]?.textColor
                                                    }}
                                                >
                                                    {getInitials(
                                                        refrencesData?.shiftId[
                                                            item?.shiftId
                                                        ]?.name
                                                    )}
                                                </Typography>
                                            </div>
                                            <span className="text-sm">
                                                {
                                                    refrencesData?.shiftId[
                                                        item?.shiftId
                                                    ]?.name
                                                }
                                            </span>
                                            <span className="text-sm">
                                                {item?.startTime ||
                                                    refrencesData?.shiftId[
                                                        item?.shiftId
                                                    ]?.startTime}
                                            </span>
                                            <span className="text-sm">
                                                {item?.endTime ||
                                                    refrencesData?.shiftId[
                                                        item?.shiftId
                                                    ]?.endTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            </DialogBody>

            {/* Footer */}
            <DialogFooter className="border-t border-gray-200 pt-3 bg-gray-50">
                <Button
                    variant="outlined"
                    color="red"
                    onClick={() => setSwapDiv(false)}
                    className="mr-2"
                >
                    Cancel
                </Button>
                <Button color="green" className="px-6" onClick={handleConfirmSwap}>
                    Confirm Swap
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default SwapDialog;
