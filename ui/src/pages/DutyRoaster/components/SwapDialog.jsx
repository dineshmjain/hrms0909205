import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { IoMdSwap } from "react-icons/io";
import { FaUserPlus  } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { subOrgListApi } from "../../../apis/Organization/Organization";
import { clientBranchListApi } from "../../../apis/Client/ClientBranch";
import { clientDepartments, clientListApi } from "../../../apis/Client/Client";
import { BranchGetApi } from "../../../apis/Branch/Branch";
import { DesignationListApi } from "../../../apis/Designation/Designation";
import { DepartmentGetApi } from "../../../apis/Department/Department";
import {
  EmployeeClientListApi,
  EmployeeListApi,
} from "../../../apis/Employee/Employee";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { getShiftByDateApi } from "../../../apis/Shift/Shift";
import { useDispatch } from "react-redux";
import { ShiftSwapbyDateAction } from "../../../redux/Action/Shift/ShiftAction";
import SwapFilterDialog from "./SwapFilterDialog";
import { format } from "date-fns";

const SwapDialog = ({
  swapDiv,
  setSwapDiv,
  empDetails,
  selectedDate,
  refrencesData,
  getShifts,
  shiftA
}) => {
  const checkModules = useCheckEnabledModule();
  const dispatch = useDispatch();

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

  const [shiftBId, setShiftBId] = useState(null);
  const [shiftBDate, setShiftBDate] = useState();
  const [shiftBEmpDetails, setShiftBEmpDetails] = useState({});
  const [shiftsForTheDay, setShiftsForTheDay] = useState([]);

  const [filterType, setFilterType] = useState("myOrg");
  const [openFilter, setOpenFilter] = useState(false);
//   const [fromShiftState, setFromShiftState] = useState([]);

//   useEffect(() => {
//     setFromShiftState(empDetails?.dates?.[selectedDate] || []);
//   }, [selectedDate, empDetails]);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
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

  const getShiftsForTheDay = (empDetails) => {
    let formatted;
    if (shiftBDate) {
        formatted = format(shiftBDate, "yyyy-MM-dd")
    }
 
    const allShifts = empDetails[0]?.dates?.[formatted];
    const shiftsToList = allShifts?.map((s) => {
        return refrencesData.shiftId[s.shiftId]
    })
    return shiftsToList;
  }

  const getShiftDetails = async () => {
    try {
      if (!employeeId) return;
      const params = {
        startDate: format(shiftBDate, "yyyy-MM-dd"),
        endDate: format(shiftBDate, "yyyy-MM-dd"),
        limit: 1,
        page: 1,
        isClient: filterType === "clientOrg",
        orgIds: [orgId],
        employeeIds: [employeeId],
      };
      const response = await getShiftByDateApi(removeEmptyStrings(params));
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
        const details = await getShiftDetails();
        const shiftsToList = getShiftsForTheDay(details)
        setShiftsForTheDay(shiftsToList)
    })()
  }, [employeeId, shiftBDate]);

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
          departmentIds: [departmentId],
        });
        const response = await EmployeeListApi(params);
        setEmployeeList(response?.data || []);
      }
      if (clientBranchId && filterType === "clientOrg") {
        let params = removeEmptyStrings({
          clientMappedId: clientMappedId,
          clientBranchIds: [clientBranchId],
          category: "assigned",
        });

        const response = await EmployeeClientListApi(params);
        setEmployeeList(response?.data?.data || []);

        const findIsEmployeeExists = response?.data?.data?.includes(
          (r) => r._id === empDetails?._id
        );
        if (response?.data?.data > 0 && findIsEmployeeExists === false) {
          toast.error(
            "Employee not found in this client branch or organization"
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDepartments = async () => {
    try {
      let response = "";
      if (filterType === "clientOrg" && clientBranchId) {
        response = await clientDepartments({
          clientMappedId: clientMappedId,
          clientBranchIds: [clientBranchId],
        });
      } else {
        response = await DepartmentGetApi();
      }
      setDepartments(response?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getDesignations = async () => {
    try {
      let response = "";
      if (filterType === "clientOrg" && clientBranchId) {
        response = await clientDepartments({
          clientMappedId: clientMappedId,
          clientBranchIds: [clientBranchId],
        });
      } else {
        response = await DesignationListApi();
      }
      setDesignations(response?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getClientList = async () => {
    try {
      const response = await clientListApi({});
      setClients(response?.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch client list");
    }
  };

  // ---- SHIFT SWAP FUNCTION ----
  const handleSwapShifts = () => {
    console.log('SHIFT A', shiftA)
    console.log('SHIFTB', shiftBId)
  };

  // ---- CONFIRM SWAP FUNCTION ----
  const handleConfirmSwap = async () => {
    // try {
    //   const fromShift = fromShiftState?.[0];
    //   const toShift =
    //     swapEmpShiftDetails?.[0]?.dates?.[selectedDate]?.[0];

    //   if (
    //     fromShift?.shiftId &&
    //     toShift?.shiftId &&
    //     fromShift?.branchId &&
    //     toShift?.branchId &&
    //     fromShift.shiftId === toShift.shiftId &&
    //     fromShift.branchId === toShift.branchId
    //   ) {
    //     toast.error("Cannot be swapped because same shift assigned");
    //     return;
    //   }

    //   const payload = {
    //     date: selectedDate,
    //     fromEmployeeId: empDetails?._id,
    //     toEmployeeId: shiftBEmpDetails?._id,
    //   };

    //   dispatch(ShiftSwapbyDateAction(payload));
    //   setSwapDiv(false);
    //   getShifts();
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Failed to save shift swap");
    // }
  };

  return (
    <Dialog open={swapDiv} handler={() => setSwapDiv(false)} size="md">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* FILTER DIALOG */}
      <SwapFilterDialog
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        filterType={filterType}
        setFilterType={setFilterType}
        checkModules={checkModules}
        orgs={orgs}
        branches={branches}
        departments={departments}
        designations={designations}
        clients={clients}
        employeeList={employeeList}
        orgId={orgId}
        branchId={branchId}
        departmentId={departmentId}
        designationId={designationId}
        clientId={clientId}
        clientMappedId={clientMappedId}
        clientBranchId={clientBranchId}
        employeeId={employeeId}
        setOrgId={setOrgId}
        setBranchId={setBranchId}
        setDepartmentId={setDepartmentId}
        setDesignationId={setDesignationId}
        setClientId={setClientId}
        setClientMappedId={setClientMappedId}
        setClientBranchId={setClientBranchId}
        setEmployeeId={setEmployeeId}
        setShiftBEmpDetails={setShiftBEmpDetails}
        callRequiredFields={callRequiredFields}
        shiftBDate={shiftBDate}
        setShiftBDate={setShiftBDate}
        shiftBId={shiftBId}
        setShiftBId={setShiftBId}
        refrencesData={refrencesData}
        shiftsForTheDay={shiftsForTheDay}
        />


      {/* MAIN SWAP DIALOG */}
      <DialogBody className="flex flex-col gap-4 bg-white">
        <Header
          headerLabel="Swap Shift"
          subHeaderLabel="Swap shifts of two employees"
          isButton={false}
        />

        {/* Employee Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {/* From Employee */}
          <Card className="p-4 shadow-sm border shadow-lg rounded-2xl">
            <Typography className="text-base font-semibold text-gray-900 mb-1">
              {empDetails?.name?.firstName} {empDetails?.name?.lastName}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-1">
              {refrencesData?.userIds?.[empDetails?._id]?.designation?.name || "—"}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-3">
              {formattedDate}
            </Typography>
            
            <div className="flex flex-col gap-2">
                {shiftA && (
                    <div
                    className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                    >
                    <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                        backgroundColor: shiftA.bgColor,
                        color: shiftA.textColor,
                        }}
                    >
                        {getInitials(shiftA.name)}
                    </div>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{shiftA.name}</span>
                        <span className="text-gray-500">
                        {shiftA.startTime} – {shiftA.endTime}
                        </span>
                    </div>
                    </div>
                )}
            </div>
          </Card>

          {/* Swap Icon */}
          <div className="flex items-center justify-center">
            <div
              onClick={handleSwapShifts}
              className="h-14 w-14 flex items-center justify-center rounded-full bg-primary text-white shadow-md cursor-pointer hover:scale-110 transition-transform"
            >
              <IoMdSwap className="h-8 w-8" />
            </div>
          </div>

          {/* To Employee */}
        <Card className="relative p-4 shadow-sm border shadow-lg rounded-2xl min-h-[160px] flex flex-col">
        {shiftBId && shiftBEmpDetails && shiftBEmpDetails._id ? (
            <>
            {/* Employee details */}
            <Typography className="text-base font-semibold text-gray-900 mb-1">
                {shiftBEmpDetails?.name?.firstName} {shiftBEmpDetails?.name?.lastName}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-1">
                {shiftBEmpDetails?.designation?.designationName ||
                "No Employee Selected"}
            </Typography>
            <Typography className="text-sm text-gray-600 mb-3">
                {format(shiftBDate, "EEEE, MMM d, yyyy")}
            </Typography>

            {/* Shift details */}
            <div className="flex flex-col gap-2 w-full">
                <div
                 className="flex items-center gap-3 p-3 rounded-lg shadow-sm border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{
                            backgroundColor:
                            refrencesData.shiftId[shiftBId].bgColor,
                            color: refrencesData.shiftId[shiftBId]?.textColor,
                        }}
                        >
                        {getInitials(
                            refrencesData.shiftId[shiftBId]?.name
                        )}
                        </div>
                        <div className="flex flex-col text-sm">
                        <span className="font-semibold">
                            {refrencesData.shiftId[shiftBId]?.name}
                        </span>
                        <span className="text-gray-500">
                            {refrencesData.shiftId[shiftBId]?.startTime}{" "}
                            –{" "}
                            {refrencesData.shiftId[shiftBId]?.endTime}
                        </span>
                        </div>
                    </div>
            </div>
            </>
        ) : (
            // Centered plus button
            <div className="absolute inset-0 grid place-items-center">
            <button
                onClick={() => {
                setOpenFilter(true);
                callRequiredFields();
                }}
                className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-dashed border-gray-400 text-gray-400 hover:border-primary hover:text-primary transition"
            >
                <span className="text-2xl font-bold"><FaUserPlus /></span>
            </button>
            </div>
        )}
        </Card>

        </div>
      </DialogBody>

      {/* Footer */}
      <DialogFooter className="flex justify-end gap-3 border-t px-6 py-4">
        <Button
          variant="outlined"
          onClick={() => setSwapDiv(false)}
          className="rounded-lg"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmSwap}
          className="bg-primary hover:bg-primaryLighter rounded-lg"
        >
          Confirm Swap
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SwapDialog;
