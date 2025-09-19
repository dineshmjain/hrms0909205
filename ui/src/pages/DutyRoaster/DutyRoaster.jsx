import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MultiSelectFilter from "../../components/Filter/MultiSelectFilter";
import ClientFilter from "./components/ClientFilter";
import {
  ShiftCreatebyDateAction,
  ShiftListbyDateAction,
  ShiftUpdatebyDateAction,
} from "../../redux/Action/Shift/ShiftAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { clientListApi } from "../../apis/Client/Client";
import { subOrgListApi } from "../../apis/Organization/Organization";
import ShiftDialog from "./components/ShiftDialog";
import { BranchGetApi } from "../../apis/Branch/Branch";
import { clientBranchListApi } from "../../apis/Client/ClientBranch";
import { ShiftGetApi } from "../../apis/Shift/Shift";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/header/Header";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../context/PromptProvider";
import SwapDialog from "./components/SwapDialog";
import RosterFooter from "./components/RosterFooter";
import WeekNavigator from "./components/WeekNavigator";
import EmployeeShiftGrid from "./components/EmployeeShiftGrid";
const isIntersecting = (r1, r2) =>
  r1.x < r2.x + r2.width &&
  r1.x + r1.width > r2.x &&
  r1.y < r2.y + r2.height &&
  r1.y + r1.height > r2.y;
const DutyRoaster = () => {
  const [filterType, setFilterType] = React.useState("myOrg");
  const [selectedFilters, setSelectedFilters] = React.useState([]);
  const [isLoading, SetIsLoading] = useState(false)
  const [selectedShiftsForms, setSelectedShiftsForms] = useState([])
  const { user } = useSelector((state) => state?.user);
  const [openDialog, setOpenDialog] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFilterType, setFilterSelectedType] = useState("myOrg");
  const [finalFilterData, setFinalFilterData] = useState([]);
  const { employeeList } = useSelector((state) => state?.employee);
  const [employees, setEmployees] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragRect, setDragRect] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [subOrgList, setSubOrgList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [noMultiSelectDraging, setNoMultiSelectDraging] = useState([]);
  const [isWeekOff, setIsWeekOff] = useState(false)
  const [swapDiv, setSwapDiv] = useState(false)
  const filterRef = useRef();
  const [forList, setForList] = useState([
    { id: 1, name: "My Organization", value: "myOrg" },
    { id: 2, name: "Client Organization", value: "clientOrg" },
  ]);
  const pickerRef = useRef(null);
  const gridRef = useRef(null);
  const { shiftByDates, totalRecord, nextPage, loading } = useSelector(
    (state) => state?.shift,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersData, setFiltersData] = useState({
    orgId: "",
    clientMappedId: "",
    clientBranchId: "",
    branchId: "",
    shiftId: "",
  });
  const dispatch = useDispatch();
  const [forId, setForId] = useState("myOrg");
  const [inputPageValue, setInputPageValue] = useState(1);
  const fromDate = useMemo(
    () => moment().startOf("isoWeek").add(weekOffset, "weeks"),
    [weekOffset],
  );
  const toDate = useMemo(() => moment(fromDate).endOf("isoWeek"), [fromDate]);
  const start = totalRecord === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = totalRecord === 0 ? 0 : Math.min(totalRecord, (page) * limit);
  const visibleDays = useMemo(() => {
    const days = toDate.diff(fromDate, "days") + 1;
    return Array.from({ length: days }, (_, i) =>
      moment(fromDate).add(i, "days"),
    );
  }, [fromDate, toDate]);
  const checkModules = useCheckEnabledModule();

  const { showPrompt, hidePrompt } = usePrompt();

  const handleShowPrompt = () => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Multiple Employee Shift has been assigned{" "}
          <b>Do you want to override</b>
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            setOpenSidebar(true)
            setIsUpdate(true)
            setSelectedShiftsForms([])
            setIsUpdate(true)
            setSelectedShiftsForms([])
            return hidePrompt();
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
             setOpenSidebar(false)
            return hidePrompt();
          },
        },
      ],
    });
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const rect = gridRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragRect(null);
    setSelectedCells([]);
  };

  useEffect(() => {
    console.log(subOrgList[0]?._id, "user in duty roaster");
    if (user?.modules?.["suborganization"]?.r) {
      setFiltersData((prev) => ({
        ...prev,
        orgId: user?.suborganization?._id ? subOrgList[0]._id : '',
      }))
    }
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (!dragStart) return;
      const rect = gridRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setDragRect({
        x: Math.min(dragStart.x, currentX),
        y: Math.min(dragStart.y, currentY),
        width: Math.abs(currentX - dragStart.x),
        height: Math.abs(currentY - dragStart.y),
      });
    },
    [dragStart],
  );

  const onPointerUp = useCallback(() => {
    if (!dragStart || !dragRect) {
      return setDragStart(null);
    }

    const rect = gridRef.current.getBoundingClientRect();
    const selected = [];

    // Collect all selected cells
    gridRef.current.querySelectorAll("[data-emp-id]").forEach((cell) => {
      const cr = cell.getBoundingClientRect();
      const rel = {
        x: cr.left - rect.left,
        y: cr.top - rect.top,
        width: cr.width,
        height: cr.height,
      };

      if (isIntersecting(dragRect, rel)) {
        selected.push({
          empId: cell.getAttribute("data-emp-id"),
          day: cell.getAttribute("data-day"),
          shift: cell.getAttribute("data-shift-id"),
          shiftdetails: JSON.parse(cell.getAttribute("data-empShift") || "{}"),
        });
      }
    });

    setSelectedCells(selected);
    setDragStart(null);
    setDragRect(null);

    // Helper: check if all employees have the same shifts
    function allEmployeesSameShifts(employees) {
      if (!employees || employees.length <= 1) return true;

      const shiftSets = employees
        .map((emp) =>
          emp?.shiftdetails?.dates?.[emp?.day]
            ?.map((s) => s?.shiftId)
            .sort((a, b) => a - b)
        )
        .filter(Boolean);

      if (shiftSets.length === 0) return true;

      const reference = shiftSets[0]?.join(",") || "";
      return shiftSets.every((set) => (set?.join(",") || "") === reference);
    }

    const allSameShift = allEmployeesSameShifts(selected);
    const isAnyShiftIdOne = selected?.some((d) => d.shift == 1);

    if (!selected.length) return;

    // Block if any selected day is in the past
    if (selected.some((d) => moment(d?.day).isBefore(moment(), "day"))) {
      toast.error("You cannot edit for Previous Days");
      setOpenSidebar(true);
      setOpenDialog(true);
      return;
    }

    // Multiple selections: show prompt if not all same shifts or contains shiftId=1
    if ((selected.length > 1 && !allSameShift) || isAnyShiftIdOne) {
      handleShowPrompt();
    }

    // Handle multiple selections with same shifts
    if (selected.length > 1 && allSameShift) {
      const shiftSets = selected
        .map((emp) => emp?.shiftdetails?.dates?.[emp?.day])
        .filter(Boolean);
      if (shiftSets.length === 0) {
        setOpenSidebar(true);
        setOpenDialog(true);
        return;
      }

      const sortedData = shiftSets[0].map((d) => {
        const shiftData = shiftByDates?.references?.shiftId?.[d?.shiftId];

        // Determine base orgId based on permission
        const baseOrgId = checkModules("suborganization", "r")
          ? d?.subOrgId
          : d?.orgId;

        // Org and client data
        let orgData = shiftByDates?.references?.orgId?.[baseOrgId];
        let clientData = d?.clientId
          ? shiftByDates?.references?.clientId?.[d?.clientId]
          : null;

        // Branch data
        let branchData = d?.clientId
          ? clientData?.branch?.[d?.branchId]
          : orgData?.branch?.[d?.branchId];

        if (d?.clientId) orgData = clientData;

        return {
          ...d,
          forId: d?.clientId ? "clientOrg" : "myOrg",
          shiftName: shiftData?.name || "",
          startTime: d?.startTime || shiftData?.startTime,
          endTime: d?.endTime || shiftData?.endTime,
          orgDisplayName: orgData?.name || "",
          branchDisplayName: branchData?.name || "",
          shiftTextColor: shiftData?.textColor || "#000",
          shiftBgColor: shiftData?.bgColor || "#e5e7eb",
        };
      });

      setSelectedShiftsForms(sortedData);
    }

    setOpenSidebar(true);
    setOpenDialog(true);
  }, [dragStart, dragRect]);


  const initialForm = (clientList, subOrgList, sortedShifts) => ({
    forId: '',
    clientId: '',
    clientMappedId: '',
    orgId: '',
    clientBranchId: '',
    branchId: '',
    shiftId: '',
    shiftName: '',
    branches: clientList?.[0]?.branches || [],
    shifts: sortedShifts || [],
    clientList: clientList || [],
    subOrgList: subOrgList || [],
    startTime: '',
    endTime: '',
    modifiedStartTime: '',
    modifiedEndTime: ''
  });
  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);
  const searchFunction = (params) => {
    setSelectedShiftsForms([])
    // Update filters if params are provided
    if (params && typeof params === 'object') {
      setSelectedFilters(params);
    }
    // Call getShifts after a brief delay to ensure state is updated
    setTimeout(() => {
      getShifts();
    }, 100);
  };
  useEffect(() => {
    if (totalRecord && limit) {
      setTotalPages(Math.ceil(totalRecord / limit));
    }
  }, [totalRecord, limit, page]);
 
  const [shiftForms, setShiftForms] = useState([]);

  const doTimeRangesOverlap = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
  };

  // Convert "HH:mm" to minutes for easier comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const updateShiftForm = (index, field, value) => {
    console.log(index, field, value, "updateShiftForm");

    setShiftForms((prev) => {
      const updated = [...prev];
      const currentForm = { ...updated[index], [field]: value };
      updated[index] = currentForm;

      // Conditional API triggers
      if (field === "forId") {
        if (value === "clientOrg") getClientsForDialog(value, currentForm, index);
        if (value === "myOrg" && user?.modules?.['suborganization'].r) getOrgsForDialog(value, currentForm, index);
        if (value === "myOrg" && !user?.modules?.['suborganization'].r) {
          getBranchList(value, currentForm, index);
        }

      }

      if (field === "orgId" || field === "clientId") {
        console.log("calling branch", updated)
        getBranchList(value, currentForm, index);
      }

      if (field === "branchId" || field === "clientBranchId") {
        getshiftList(value, currentForm, index);
      }

      // Validate shift time overlap
      if (field === "shiftId") {
        const selectedShift = currentForm.shifts?.find((s) => s._id === value);
        if (selectedShift) {
          const newStart = timeToMinutes(selectedShift.startTime);
          const newEnd = timeToMinutes(selectedShift.endTime);

          for (let i = 0; i < updated.length; i++) {
            if (i === index) continue;

            const otherShift = updated[i].shifts?.find(
              (s) => s._id === updated[i].shiftId
            );
            if (!otherShift) continue;

            const otherStart = timeToMinutes(otherShift.startTime);
            const otherEnd = timeToMinutes(otherShift.endTime);

            if (doTimeRangesOverlap(newStart, newEnd, otherStart, otherEnd)) {
              toast.error(
                `Shift time overlaps with another shift for ${updated[i].shiftName}`
              );
              currentForm[field] = ""; // Revert
              break;
            }
          }
        }
      }

      // Detect modified start time
      if (field === "modifiedStartTime") {
        const selectedShift = currentForm.shifts?.find(
          (s) => s._id === currentForm.shiftId
        );
        if (selectedShift && selectedShift.startTime !== value) {
          currentForm.modifiedStartTime = value;
        } else {
          delete currentForm.modifiedStartTime;
        }
      }

      // Detect modified end time
      if (field === "modifiedEndTime") {
        const selectedShift = currentForm.shifts?.find(
          (s) => s._id === currentForm.shiftId
        );
        if (selectedShift && selectedShift.endTime !== value) {
          currentForm.modifiedEndTime = value;
        } else {
          delete currentForm.modifiedEndTime;
        }
      }

      return updated;
    });
  };

  const getClientsForDialog = async (id, forData, index) => {
    try {
      const response = await clientListApi({});
      console.log(
        response?.data,
        "client =================================================list",
      );
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["clientList"] = response?.data || [];
        return updated;
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch client list");
    }
  };

  const getOrgsForDialog = async (id, forData, index) => {
    try {
      const response = await subOrgListApi({});
      console.log(
        response?.data,
        "s =================================================list",
      );
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["subOrgList"] = response?.data || [];
        return updated;
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch organization list");
    }
  };

  const removeShiftForm = (index) => {
    setShiftForms((prev) => prev.filter((_, i) => i !== index));
  };
  const getBranchList = async (id, forData, index) => {
    try {
      console.log(forData, "Getting branches for form");
      SetIsLoading(true)
      let params = {};
      let apiCall = null;

      const isClientOrg = forData?.forId === "clientOrg";
      const canReadSubOrg = user?.modules?.["suborganization"]?.r;

      if (isClientOrg) {
        const mappedId = forData?.clientMappedId ||
          forData?.clientList?.find(d => d.clientId)?.["_id"];

        if (!mappedId) {
          toast.error("Client Mapped ID not found");
          return;
        }

        params = { clientMappedId: mappedId };
        apiCall = clientBranchListApi;
      } else {
        if (canReadSubOrg) {
          if (id) {
            params = { subOrgId: id };
          }
        }
        apiCall = BranchGetApi;
      }

      console.log(params, "Fetching branches with params");

      const response = await apiCall(params);
      const branches = response?.data || [];
      SetIsLoading(false)
      // Update branch list and shift form
      setBranchList(branches);
      setShiftForms(prev => {
        const updated = [...prev];
        updated[index]["branches"] = branches;
        return updated;
      });

    } catch (err) {
      SetIsLoading(false)
      console.error("Error fetching branch list:", err);
      toast.error("Failed to fetch branch list");
    }
  };

  const getshiftList = async (id, forData, index) => {
    try {
      SetIsLoading(true)
      console.log(forData, "shifts upd");
      const params =
        forData?.forId == "clientOrg" ? { orgId: forData?.clientMappedId } : {};
      const response = await ShiftGetApi(params);
      console.log(response?.data, "response from shift get api");
      let baseData = response?.data?.map((data) => {
        return {
          ...data,
          mname: `${data?.name} ${data?.startTime} ${data?.endTime}`,
        };
      }).filter((d) => d?.isActive);
      SetIsLoading(false)
      // setShiftList(baseData)
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["shifts"] = baseData;
        return updated;
      });
    } catch (err) {
      SetIsLoading(false)
      console.log(err);
    }
  };
  const [isUpdate, setIsUpdate] = useState(false)

  const handleShiftAssign = () => {
    const employeeIds = [...new Set(selectedCells.map((c) => c.empId))];
    const selectedDates = selectedCells.map((c) => c.day);

    const sortedDates = selectedDates.sort((a, b) => new Date(a) - new Date(b));
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    console.log('payload', selectedShiftsForms)

    let filteredData = removeEmptyStrings(selectedShiftsForms);

    filteredData = filteredData?.map((data) => {

      const {
        shifts, branches, forId, shiftId, clientList, subOrgList, shiftName, startTime, endTime, modifiedStartTime, modifiedEndTime, orgDisplayName, branchDisplayName, shiftTextColor,
        shiftBgColor, createdBy,
        subOrgId, holidayId,
        ...rest
      } = data;

      return { ...rest, currentShiftId: shiftId, startTime: modifiedStartTime, endTime: modifiedEndTime };
    });

    const finalData = {
      startDate: startDate,
      endDate: endDate,
      shifts: isWeekOff == true ? [{ currentShiftId: 'WO' }, ...filteredData] : filteredData,
      employeeIds: employeeIds,
    };

    if (isUpdate) {
      dispatch(ShiftUpdatebyDateAction(removeEmptyStrings({ ...finalData })))
        .then(({ payload }) => {
          if (payload?.status == 200) {

            getShifts();
            setSelectedShiftsForms([])
            setOpenSidebar(false)
          }
        })
    }
    else {
      dispatch(ShiftCreatebyDateAction(removeEmptyStrings({ ...finalData })))
        .then(({ payload }) => {
          if (payload?.status == 200) {

            getShifts();
            setSelectedShiftsForms([])
            setOpenSidebar(false)
          }
        });
    }

    setOpenDialog(false);
    setOpenSidebar(false)
    setShiftForms([{ clientId: "", clientBranchId: "", shiftId: "" }]);
    setSelectedShiftsForms([])
  };

  const handleUpdateAssign = () => {
    const employeeIds = [...new Set(selectedCells.map((c) => c.empId))];
    const selectedDates = selectedCells.map((c) => c.day);
    console.log(employeeIds, selectedDates, "selectedCells");
    const sortedDates = selectedDates.sort((a, b) => new Date(a) - new Date(b));
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    console.log(startDate, endDate, "sortedDates");
    let filteredData = removeEmptyStrings(selectedShiftsForms);
    console.log(filteredData, selectedShiftsForms);
    filteredData = filteredData?.map((data) => {
      console.log(data, 'dataffff')
      const {
        shifts, branches, forId, shiftId, clientList, subOrgList, shiftName, startTime, endTime, modifiedStartTime, modifiedEndTime, orgDisplayName, branchDisplayName, shiftTextColor,
        shiftBgColor, createdBy,
        subOrgId,
        ...rest
      } = data;

      return { ...rest, currentShiftId: data?.shiftId, startTime: modifiedStartTime, endTime: modifiedEndTime };
    });
    console.log(filteredData, employeeIds, "recived");

    const finalData = {
      startDate: startDate,
      endDate: endDate,
      shifts: isWeekOff == true ? ['WO'] : filteredData,
      employeeIds: employeeIds,
    };
    console.log(finalData, isWeekOff == true, 'finalData to be sent to api');

    // dispatch(ShiftCreatebyDateAction({ ...finalData })).then(({ payload }) => {
    //   getShifts();
    // });

    // setOpenDialog(false);
    // setOpenSidebar(false)
    // setShiftForms([{ clientId: "", clientBranchId: "", shiftId: "" }]);
    // setSelectedShiftsForms([])
  };

  useEffect(() => {
    console.log(forId, "type Selected", user);
    if (user?.modules?.["suborganization"]?.r && forId == "myOrg") {
      console.log("sub Orgs ");
      getSubOrgList();
    }
    if (forId == "clientOrg") {
      console.log("client s ");
      getClients();
    }
  }, [forId]);
  console.log(
    forId,
    "================`=========================== typ Of forId in shift Dialog",
  );
  const getSubOrgList = async () => {
    try {
      const response = await subOrgListApi({});
      console.log(response?.data, "d");
      setSubOrgList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClients = async () => {
    try {
      const response = await clientListApi({});
      console.log(response?.data,"client =list");
      setClientList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getShifts = async () => {
    console.log("getShifts called with params:", selectedFilters);
    let baseParams = {
      startDate: fromDate.format("YYYY-MM-DD"),
      endDate: toDate.format("YYYY-MM-DD"),
      limit,
      page,
      ...selectedFilters,
      isClient: filterType === "clientOrg",
      orgIds: selectedFilters?.orgIds ? [selectedFilters?.orgIds] : [],
      employeeIds: selectedFilters?.employeeIds
    };

    console.log("getShifts called with params:", selectedFilters);
    let cleanedParams = removeEmptyStrings(baseParams);

    if (filterType === "clientOrg") {
      delete cleanedParams.branchIds;
      delete cleanedParams.orgIds;
    } else {
      delete cleanedParams.clientMappedIds;
      delete cleanedParams.clientBranchIds;
    }

    const { ...rest } = cleanedParams; // if (cleanedParams?.orgIds || cleanedParams?.branchIds || cleanedParams?.clientMappedIds || cleanedParams?.clientBranchIds) {
    const finalData = removeEmptyStrings(rest);
    console.log(finalData, "finalData");
    if (filterType === "clientOrg" && finalData?.clientMappedIds?.length > 0 && finalData?.clientBranchIds?.length > 0) {
      dispatch(ShiftListbyDateAction(finalData));
    }
    if (filterType === "myOrg") {
      dispatch(ShiftListbyDateAction(finalData));
    }
    // }
  };
  
  

  // Add useEffect to call getShifts on component mount and when dependencies change
  useEffect(() => {
    getShifts();
  }, [filterType, page, limit, weekOffset]);

  // Add useEffect to reset page when filters change
  useEffect(() => {
    setPage(1);
    setInputPageValue(1);

  
  }, [selectedFilters, filterType]);


  const handleCloseSidebar = () => {
    setOpenSidebar(false);
    setSelectedShiftsForms([])

  };
  const handleDisplayData = (form) => {
    console.log(form, "form in display data");

    const start = form?.modifiedStartTime || form?.startTime;
    const end = form?.modifiedEndTime || form?.endTime;

    // ---------- Validation ----------
    const validations = [
      { cond: !form.forId, msg: "Please select For" },
      { cond: form.forId === "clientOrg" && !form.clientId, msg: "Please select Client Organization" },
      { cond: form.forId === "myOrg" && !form.branchId, msg: "Please select Branch" },
      { cond: form.forId === "clientOrg" && !form.clientBranchId, msg: "Please select Branch" },
      { cond: !form.shiftId, msg: "Please select Shift" },
      { cond: !start || !end, msg: "Please select both start and end times." },
    ];

    for (const v of validations) {
      if (v.cond) {
        toast.error(v.msg);
        return;
      }
    }

    // ---------- Utility ----------
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(start);
    const newEnd = toMinutes(end);

    // ---------- Overlap check ----------
    const hasOverlap = selectedShiftsForms.some((shift) => {
      const existingStart = toMinutes(shift.modifiedStartTime || shift.startTime);
      const existingEnd = toMinutes(shift.modifiedEndTime || shift.endTime);
      return (
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });

    if (hasOverlap) {
      toast.error("Shift time overlaps with an existing shift!");
      return;
    }

    // ---------- Prepare display object ----------
    const selectedOrg = form?.subOrgList?.find((s) => s._id === form?.orgId);
    const selectedBranch = form?.branches?.find((s) => s._id === form?.branchId);
    const selectedShift = form?.shifts?.find((s) => s._id === form?.shiftId);
    const clientOrg = form?.clientList?.find((s) => s.clientId === form?.clientId);
    const clientBranch = form?.branches?.find((s) => s._id === form?.clientBranchId);

    const displayForm = {
      ...form,
      orgDisplayName: selectedOrg?.name || clientOrg?.name || "",
      branchDisplayName: selectedBranch?.name || clientBranch?.name || "",
      shiftTextColor: selectedShift?.textColor || "#000",
      shiftBgColor: selectedShift?.bgColor || "#e5e7eb",
    };

    // ---------- Update state ----------
    // setSelectedShiftsForms((prev) => [...prev, displayForm]);
    setSelectedShiftsForms((prev) => {
      console.log('black sheep')
      console.log('prev', prev)
      console.log('displayform', [...prev, displayForm])
      return [...prev, displayForm]
    })

    // ---------- Reset form ----------
    setShiftForms([
      {
        ...initialForm,
        clientList,
        subOrgList,
        branches: [],
        shifts: [],
        startTime: "",
        endTime: "",
        modifiedStartTime: "",
        modifiedEndTime: "",
      },
    ]);
  };

  const checkIsShiftAlreadyExists = async (data, str) => {
    if (moment(str).isBefore(moment(), 'day')) {
      toast.error("You cannot edit for Previous Day");
    } else {
      setOpenDialog(true);
      setOpenSidebar(true);
      console.log(data, "update");
      const filteredData = data?.dates?.[str];
      console.log(filteredData, "update");

      if (!filteredData) {
        console.log("New Add");
        setIsUpdate(false);
        return;
      }

      setIsUpdate(true);
      console.log("is checking ", filteredData);

      const isAnyWeekOff = filteredData.some((d) => d.shiftId === "WO");
      console.log("is checking ", isAnyWeekOff, filteredData);

      if (isAnyWeekOff) {
        setIsWeekOff(true);
      } else {
        setIsWeekOff(false);
      }

      // ✅ FIX: If only one record and it's WO → clear forms
      if (filteredData.length === 1 && filteredData[0]?.shiftId === "WO") {
        setSelectedShiftsForms([]);
        return;
      }

      const sortedData = filteredData.map((d) => {
        const shiftData = shiftByDates?.references?.shiftId?.[d?.shiftId];

        // Determine base orgId based on permission
        const baseOrgId = checkModules("suborganization", "r")
          ? d?.subOrgId
          : d?.orgId;

        // Org and client data
        let orgData = shiftByDates?.references?.orgId?.[baseOrgId];
        let clientData = d?.clientId
          ? shiftByDates?.references?.clientId?.[d?.clientId]
          : null;

        // Branch data
        let branchData = null;
        if (d?.clientId) {
          orgData = clientData; // If client exists, orgData should refer to client
          branchData = clientData?.branch?.[d?.branchId];
        } else {
          branchData = orgData?.branch?.[d?.branchId];
        }

        console.log(branchData, "branchData");
        if (d?.shiftId !== "WO") {
          return {
            ...d,
            forId: d?.clientId ? "clientOrg" : "myOrg",
            shiftName: shiftData?.name || "",
            startTime: d?.startTime || shiftData?.startTime,
            endTime: d?.endTime || shiftData?.endTime,
            orgDisplayName: orgData?.name || "",
            branchDisplayName: branchData?.name || "",
            shiftTextColor: shiftData?.textColor || "#000",
            shiftBgColor: shiftData?.bgColor || "#e5e7eb",
          };
        }
      });

      console.log(sortedData, "sortedData");
      setSelectedShiftsForms(
        sortedData?.filter((r) => r?.shiftId).filter(Boolean)
      );
    }
  };

  const HOLIDAY_TYPE_COLORS = {
    public: { bg: "#FDEAEA", text: "#5A1E1E" }, // Rose Mist
    restricted: { bg: "#FFF4E5", text: "#5A3E1E" }, // Sand Cream
    optional: { bg: "#EAF8EA", text: "#1E5A1E" }, // Mint Cloud
  };
  const [empDetails, setEmpDetails] = useState({})
  const [selectedDate, setSelectedDate] = useState()
  const [refrencesData, setReferencesData] = useState({})
  const [shiftA, setShiftA] = useState({});
  
  const manageSwap = (e, emp, date, refernce, shiftRef) => {
    e?.stopPropagation(), setSwapDiv(true)

    setShiftA(shiftRef)
    setEmpDetails(emp)
    setReferencesData(refernce)
    setSelectedDate(date)
  }
  const holidayColumnColors = useMemo(() => {
    const colors = {};

    visibleDays.forEach(day => {
      const dateStr = day.format("YYYY-MM-DD");
      let holidayIds = [];

      shiftByDates?.data?.forEach(emp => {
        const shifts = emp.dates?.[dateStr] || [];
        const ids = shifts.map(s => s.holidayId).filter(Boolean);
        if (ids.length > 0) {
          holidayIds.push(ids[0]); // we just need the first for check
        }
      });

      const isSameHoliday =
        holidayIds.length > 0 && holidayIds.every(id => id === holidayIds[0]);

      if (isSameHoliday) {
        const holidayRef = shiftByDates.references.holidays?.[holidayIds[0]];
        const holidayType = holidayRef?.holidayType?.toLowerCase() || "public";
        const holidayColor = HOLIDAY_TYPE_COLORS[holidayType] || HOLIDAY_TYPE_COLORS.public;

        colors[dateStr] = holidayColor;
      }
    });

    return colors;
  }, [visibleDays, shiftByDates]);


  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border border-gray-100 rounded-md relative">

      {/* Sidebar */}
      <div
        className={`fixed top-[45px] right-0 z-30 min-w-[25vw] maxsm:min-w-[50vw] bg-white shadow-2xl rounded-md overflow-y-auto transition-transform duration-300 ease-in-out ${openSidebar ? "translate-x-0" : "translate-x-full"
          }`}

        ref={filterRef}
      >

        <SwapDialog 
          getShifts={getShifts} 
          swapDiv={swapDiv} 
          setSwapDiv={setSwapDiv} 
          empDetails={empDetails} 
          selectedDate={selectedDate} 
          refrencesData={refrencesData} 
          shiftA={shiftA}
          />
        <ShiftDialog
          initialForm={initialForm}
          removeShiftForm={removeShiftForm}
          setForId={setForId}
          subOrgList={subOrgList}
          handleShiftAssign={handleShiftAssign}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          forList={forList}
          setShiftForms={setShiftForms}
          shiftForms={shiftForms}
          updateShiftForm={updateShiftForm}
          selectedShiftsForms={selectedShiftsForms}
          setSelectedShiftsForms={setSelectedShiftsForms}
          closeSidebar={handleCloseSidebar}
          handleDisplayData={handleDisplayData}
          setIsWeekOff={setIsWeekOff}
          isWeekOff={isWeekOff}
        />
      </div>
      <Header
        headerLabel={
          "Duty Roster"
        }
        subHeaderLabel={
          "Manage your employee shifts"
        }
        isButton={false}
      />
      <div className="bg-white p-4 shadow rounded-md">
        <div className="text-gray-700 font-semibold mb-2 text-sm">Filters</div>
        <div className="inline-flex rounded-md overflow-hidden shadow border border-gray-200 mb-4">
          {["myOrg", "clientOrg"].map((typeValue) => (
            <button
              key={typeValue}
              type="button"
              onClick={() => setFilterType(typeValue)}
              className={`px-4 py-2 text-xs font-medium transition-all duration-150 ${filterType === typeValue
                ? "bg-primary text-white"
                : "bg-white text-gray-900 hover:bg-gray-100"
                }`}
            >
              {typeValue === "myOrg" ? "My Organization" : "Client Organization"}
            </button>
          ))}
        </div>
        {filterType === "myOrg" ? (
          <MultiSelectFilter
            pageName="roster"
            showFilters={true}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            onSet={searchFunction}
          />
        ) : (
          <ClientFilter
            setLimit={setLimit}
            setPage={setPage}
            filterType={filterType}
            setFiltersData={setSelectedFilters}
            selectedFilters={selectedFilters}
            search={searchFunction}
          />
        )}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md sticky top-0 z-20">
        <WeekNavigator fromDate={fromDate} toDate={toDate} setWeekOffset={setWeekOffset} />
        <EmployeeShiftGrid
          visibleDays={visibleDays}
          holidayColumnColors={holidayColumnColors}
          shiftByDates={shiftByDates}
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
          setIsWeekOff={setIsWeekOff}
          checkIsShiftAlreadyExists={checkIsShiftAlreadyExists}
          manageSwap={manageSwap}
          dragRect={dragRect}
          gridRef={gridRef}
          onPointerDown={onPointerDown}
        />
      </div>
      <RosterFooter
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalRecord={totalRecord}
        start={start}
        end={end}
        limit={limit}
        setLimit={setLimit}
        inputPageValue={inputPageValue}
        setInputPageValue={setInputPageValue}
        loading={loading}
    />
    </div>
  );
};

export default DutyRoaster;
