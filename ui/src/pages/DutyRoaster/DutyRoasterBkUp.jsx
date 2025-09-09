import { IconButton, Typography } from "@material-tailwind/react";
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
import TooltipMaterial from "../../components/TooltipMaterial/TooltipMaterial";
import { LuSkipBack, LuSkipForward } from "react-icons/lu";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { clientListApi } from "../../apis/Client/Client";
import { subOrgListApi } from "../../apis/Organization/Organization";
import ShiftDialog from "./components/ShiftDialog";
import { BranchGetApi } from "../../apis/Branch/Branch";
import { clientBranchListApi } from "../../apis/Client/ClientBranch";
import { ShiftGetApi } from "../../apis/Shift/Shift";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/header/Header";
import Loader from "../Loader/Loader";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../context/PromptProvider";
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
    () => moment().startOf('month').add(weekOffset, 'month'),
    [weekOffset],
  );
  const toDate = useMemo(() => moment(fromDate).endOf('month'), [fromDate]);
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
            return hidePrompt();
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
            return hidePrompt();
          },
        },
      ],
    });
  };


  //   const {subOrgs}=useSelector((state) => state?.subOrgs);
  //   console.log(subOrgs, "subOrgs in duty roaster");

  //   useEffect(() => {
  //     if (subOrgs?.length > 0 && user?.modules?.["suborganization"]?.r && filterType === "myOrg") {
  // const subOrg = subOrgs[0]?._id || '';
  //       setSelectedFilters((prev) => ({ ...prev, orgIds: subOrg }));
  //     }
  //   }, [subOrgs,filterType==="myOrg"]);
  //   console.log(selectedFilters, "filtersData in duty roaster d");
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
  console.log(shiftForms);

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
      });
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
      shifts: filteredData,
      employeeIds: employeeIds,
    };
    console.log(finalData, 'finalData to be sent to api');
    if (isUpdate) {
      dispatch(ShiftUpdatebyDateAction(removeEmptyStrings({ ...finalData })))
        .then(({ payload }) => {
          if (payload?.status == 200) {
            console.log("pa", payload)
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
            console.log("pa", payload)
            getShifts();
            setSelectedShiftsForms([])
            setOpenSidebar(false)
          }
        });
    }

    // setOpenDialog(false);
    // setOpenSidebar(false)
    // setShiftForms([{ clientId: "", clientBranchId: "", shiftId: "" }]);
    // setSelectedShiftsForms([])
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
      shifts: filteredData,
      employeeIds: employeeIds,
    };
    console.log(finalData, 'finalData to be sent to api');

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
      console.log(
        response?.data,
        "client =================================================list",
      );
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
      employeeIds:selectedFilters?.employeeIds
    };

    console.log("getShifts called with params:", baseParams);
    let cleanedParams = removeEmptyStrings(baseParams);

    if (filterType === "clientOrg") {
      delete cleanedParams.branchIds;
      delete cleanedParams.orgIds;
    } else {
      delete cleanedParams.clientMappedIds;
      delete cleanedParams.clientBranchIds;
    }

    const {...rest } = cleanedParams; // if (cleanedParams?.orgIds || cleanedParams?.branchIds || cleanedParams?.clientMappedIds || cleanedParams?.clientBranchIds) {
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
    const start = form?.modifiedStartTime || form?.startTime;
    const end = form?.modifiedEndTime || form?.endTime;
    if (!form.forId) {
      toast.error("Please select For");
      return;
    }
    if (form.forId == 'clientOrg' && !form.clientId) {
      toast.error("Please select Client Organization");
      return;
    }
    // if (form.forId == 'myOrg' && !form.orgId && chec) {
    //   toast.error("Please select My Organization");
    //   return;
    // }
    if (form.forId == 'myOrg' && !form.branchId) {
      toast.error("Please select Branch");
      return;
    }
    if (form.forId == 'clientOrg' && !form.clientBranchId) {
      toast.error("Please select Branch");
      return;
    }
    if (!form.shiftId) {
      toast.error("Please select Shift");
      return;
    }
    if (!start || !end) {
      toast.error("Please select both start and end times.");
      return;
    }

    // Convert times to comparable numbers (HH:MM -> minutes)
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(start);
    const newEnd = toMinutes(end);

    // if (newStart >= newEnd) {
    //   alert("End time must be after start time.");
    //   return;
    // }

    // Check for overlap
    const hasOverlap = selectedShiftsForms.some((shift) => {
      const existingStart = toMinutes(shift.modifiedStartTime || shift.startTime);
      const existingEnd = toMinutes(shift.modifiedEndTime || shift.endTime);
      // Overlap condition: new shift starts before existing shift ends and ends after existing shift starts
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasOverlap) {
      return toast.error("Shift time overlaps with an existing shift!");
    }

    // --- If no overlap, proceed to add shift ---
    const selectedOrg = form?.subOrgList?.find((s) => s._id === form?.orgId);
    const selectedBranch = form?.branches?.find((s) => s._id === form?.branchId);
    const selectedShift = form?.shifts?.find((s) => s._id === form?.shiftId);
    const clientOrg = form?.clientList?.find((s) => s.clientId === form?.clientId);
    const clientBranch = form?.branches?.find((s) => s._id === form?.clientBranchId);

    const displayForm = {
      ...form,
      orgDisplayName: selectedOrg?.name || clientOrg?.name,
      branchDisplayName: selectedBranch?.name || clientBranch?.name,
      shiftTextColor: selectedShift?.textColor || '#000',
      shiftBgColor: selectedShift?.bgColor || '#e5e7eb',
    };
    console.log(displayForm, 'display form')
    const temp = [...selectedShiftsForms, displayForm]

    console.log(temp, 'temp')

    setSelectedShiftsForms(temp);

    // Clear form
    const clearedForm = {
      ...initialForm,
      clientList,
      subOrgList,
      branches: [],
      shifts: [],
      startTime: '',
      endTime: '',
      modifiedEndTime: '',
      modifiedStartTime: ''
    };

    setShiftForms([clearedForm]);
  };
  const checkIsShiftAlreadyExists = async (data, str) => {

    if (moment(str).isBefore(moment(), 'day')) {
      toast.error("You cannot edit for Previous Days");
    }

    else {
      setOpenDialog(true);
      setOpenSidebar(true)
      console.log(data, "update");

      const filteredData = data?.dates?.[str];
      console.log(filteredData, "update");

      if (!filteredData) {
        console.log("New Add");
        setIsUpdate(false);
        return;
      }

      // console.log("Update");
      setIsUpdate(true);

      // console.log(
      //   JSON.stringify(data, null, 2),
      //   selectedCells,
      //   "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYy"
      // );

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
      console.log(sortedData, "sortedData");
      setSelectedShiftsForms(sortedData);
    }
  };
const [isWeekOff,setIsWeekOff]=useState(false)
  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md relative">
      <div
        className={`fixed sidebar  overflow-y-scroll scrolls z-30 min-w-[25vw] rounded-lg 
           maxsm:min-w-[50vw] shadow-2xl transition-all ease-in-out duration-[.3s] top-[48px]  ${openSidebar ? `right-[-10px] visible` : `right-[-3000px]`
          } rounded-sm bg-white z-10 overflow-hidden`}
        ref={filterRef}
      >
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
      <div className="bg-white p-4 shadow-hrms rounded-md">
        <div className="text-gray-700 font-semibold mb-2 text-[14px]">
          Filters
        </div>
        <div className="inline-flex rounded-md overflow-hidden shadow  border border-gray-200 mb-4">
          {["myOrg", "clientOrg"].map((typeValue) => (
            <button
              key={typeValue}
              type="button"
              onClick={() => setFilterType(typeValue)}
              className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 
              ${filterType === typeValue ? "bg-primary text-white" : "bg-white text-gray-900 hover:bg-gray-100"} 
              `}
            >
              {typeValue === "myOrg"
                ? "My Organization"
                : "Client Organization"}
            </button>
          ))}
        </div>
        <>
          {filterType == "myOrg" ? (
            <MultiSelectFilter
              pageName={"roster"}
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
              search={(c) => {
                searchFunction();
              }}
            />
          )}
        </>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md ">
        <div className="flex justify-center items-center gap-4">
          <IconButton
            size="sm"
            variant="filled"
            className="bg-primary"
            onClick={() => setWeekOffset((o) => o - 1)}
          >
            <PiCaretLeftBold className="text-white" />
          </IconButton>

          <div
            onClick={() => setShowPicker((p) => !p)}
            className="cursor-pointer px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm"
          >
            <Typography variant="small" color="gray">
              {fromDate.format("MMM D, YYYY")} – {toDate.format("MMM D, YYYY")}
            </Typography>
          </div>

          <IconButton
            size="sm"
            variant="filled"
            className="bg-primary"
            onClick={() => setWeekOffset((o) => o + 1)}
          >
            <PiCaretRightBold className="text-white" />
          </IconButton>
        </div>

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute top-14 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-2xl rounded-lg p-2 border"
          >
            <DatePicker
              selected={fromDate.toDate()}
              onChange={(date) => {
                const diff = moment(date)
                  .startOf("isoWeek")
                  .diff(moment().startOf("isoWeek"), "weeks");
                setWeekOffset(diff);
                setShowPicker(false);
              }}
              inline
              calendarStartDay={1}
            />
          </div>
        )}
        {/* Roster Grid */}
        <div
          ref={gridRef}
          onPointerDown={onPointerDown}
          className="relative overflow-auto bg-white rounded-lg shadow"
        >
          {dragRect && (
            <div
              className="absolute border-2 border-blue-400 bg-blue-200/30 pointer-events-none z-50"
              style={{
                left: `${dragRect.x}px`,
                top: `${dragRect.y}px`,
                width: `${dragRect.width}px`,
                height: `${dragRect.height}px`,
              }}
            />
          )}
          <div className="grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] border-b border-gray-300">
            <div className="p-2 font-semibold text-gray-700">Employee</div>
            {visibleDays.map((day) => (
              <div
                key={day.format("YYYY-MM-DD")}
                className="p-2 text-center font-medium text-gray-700"
              >
                {day.format("ddd D")}
              </div>
            ))}
          </div>

          {shiftByDates?.data?.map((emp) => (
            <div
              key={emp._id}
              className="grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] border-b border-gray-200"
            >
              
              <div className="p-2 text-gray-800">
               <Typography className='text-gray-700 font-medium'>
                 {emp.name.firstName} {emp.name.lastName}
               </Typography>
             </div>

            {visibleDays.map((day) => {
  const dateStr = day.format("YYYY-MM-DD");
  const shifts = emp.dates?.[dateStr] || [];
  const isSelected = selectedCells.some(
    (cell) => cell.empId === emp._id && cell.day === dateStr,
  );

  return (
    <div
      key={dateStr}
      data-emp-id={emp._id}
      data-shift-id={shifts.length}
      data-empshift={JSON.stringify(emp)}
      data-day={dateStr}
      onClick={() => {
        setSelectedCells((prev) => {
          const exists = prev.find(
            (cell) => cell.empId === emp._id && cell.day === dateStr,
          );
          return exists
            ? prev.filter(
                (cell) =>
                  !(cell.empId === emp._id && cell.day === dateStr),
              )
            : [...prev, { empId: emp._id, day: dateStr }];
        });
        checkIsShiftAlreadyExists(emp, dateStr);
      }}
      className={`p-2 text-center border-l border-gray-100 cursor-pointer  select-none ${
        isSelected ? "bg-blue-100 border-blue-300" : ""
      }`}
    >
      {shifts.length > 0 ? (
        <div className="flex flex-col gap-1 items-center">
          {shifts.map((shift) => {
            const shiftRef =
              shiftByDates.references.shiftId?.[shift.shiftId] || {};
            const clientRef =
              shift.clientMappedId &&
              shiftByDates.references.clientId?.[shift.clientMappedId];
            const clientBranch = clientRef?.branch?.[shift.clientBranchId];
            const subOrg =
              shift.orgId &&
              shift.subOrgId &&
              shiftByDates.references.orgId?.[shift.subOrgId];
            const subOrgBranch = subOrg?.branch?.[shift.branchId];

            const startTime = shift.startTime || shiftRef.startTime;
            const endTime = shift.endTime || shiftRef.endTime;

            const leaveRef =
              shiftByDates.references.leaves?.[shift.userLeaveId];
            const holidayRef =
              shiftByDates.references.holidays?.[shift.holidayId];

            // Priority rendering logic
            if (leaveRef) {
              return (
                <div
                  key={`${shift._id}-leave`}
                  className="flex flex-col text-xs font-medium px-3 py-1 rounded w-full text-left shadow-md border-2 border-blue-600 bg-blue-100"
                >
                  <div className="text-blue-800 text-sm">
                    {leaveRef.policyName}
                  </div>
                  <div className="text-blue-600 text-xs">
                    Applied For {leaveRef.type} day
                  </div>
                </div>
              );
            }

            return (
              <div key={shift._id} className="w-full flex flex-col gap-1">
                {/* Holiday + Shift */}
                {holidayRef &&  shiftRef &&(
                  <div className="flex flex-col text-xs font-medium px-3 py-1 rounded w-full text-left shadow-md border-2 border-green-600 bg-green-50">
                    <div className="text-green-800 text-xm">
                      {holidayRef.name}
                    </div>
                    <div className="text-green-600 text-xs">{holidayRef?.duration} Holiday</div>
                    {shiftRef && (
                  <div
                    className="text-xs font-medium px-3 py-1 rounded w-full text-left shadow-md"
                    style={{
                      backgroundColor: shiftRef.bgColor || "#e0e0e0",
                      color: shiftRef.textColor || "#000",
                    }}
                  >
                    <div className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between">
                      {shiftRef.name || ""}
                      <div>
                        {startTime || ""} - {endTime || ""}
                      </div>
                    </div>
                    <div
                      className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between"
                      style={{
                        color: (shiftRef.textColor || "#000") + "77",
                      }}
                    >
                      {clientRef?.name && <div>{clientRef.name}</div>}
                      {clientBranch?.name && <div>{clientBranch.name}</div>}
                      {subOrg?.name && <div>{subOrg.name}</div>}
                      {subOrgBranch?.name && <div>{subOrgBranch.name}</div>}
                    </div>
                  </div>
                )}
                  </div>
                )}

                {shiftRef && !holidayRef && (
                  <div
                    className="text-xs font-medium px-3 py-1 rounded w-full text-left shadow-md"
                    style={{
                      backgroundColor: shiftRef.bgColor || "#e0e0e0",
                      color: shiftRef.textColor || "#000",
                    }}
                  >
                    <div className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between">
                      {shiftRef.name || ""}
                      <div>
                        {startTime || ""} - {endTime || ""}
                      </div>
                    </div>
                    <div
                      className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between"
                      style={{
                        color: (shiftRef.textColor || "#000") + "77",
                      }}
                    >
                      {clientRef?.name && <div>{clientRef.name}</div>}
                      {clientBranch?.name && <div>{clientBranch.name}</div>}
                      {subOrg?.name && <div>{subOrg.name}</div>}
                      {subOrgBranch?.name && <div>{subOrgBranch.name}</div>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      )}
    </div>
  );
})}

            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-md shadow-hrms maxsm:flex-col">
        {/* Showing Count */}
        <div className="text-sm text-gray-700">
          {loading
            ? "Loading Data..."
            : `Showing ${start} – ${end} of ${totalRecord}`}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* First Page */}
          <TooltipMaterial content="First Page">
            <button
              disabled={page === 1}
              className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900
                   disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                   disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
              onClick={() => {
                setPage(1);
                setInputPageValue(1);
              }}
            >
              <LuSkipBack className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          {/* Previous Page */}
          <TooltipMaterial content="Previous Page">
            <button
              disabled={page === 1}
              className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900
                   disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                   disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  setInputPageValue(page - 1);
                }
              }}
            >
              <IoIosArrowBack className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          {/* Page Number Input */}
          <TooltipMaterial content="Page No">
            <input
              type="number"
              className="w-16 h-8 text-center rounded-md bg-popLight px-2 shadow-hrms hover:shadow-md"
              min={1}
              max={totalPages}
              value={inputPageValue}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setInputPageValue(isNaN(val) ? 1 : val);
              }}
              onBlur={() => {
                if (inputPageValue >= 1 && inputPageValue <= totalPages) {
                  setPage(inputPageValue); // ✅ Only fetch when valid
                } else {
                  toast.error(`Page number must be between 1 and ${totalPages}`);
                  setInputPageValue(page); // Reset to current page
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.target.blur(); // ✅ Trigger validation
              }}
            />
          </TooltipMaterial>

          {/* Next Page */}
          <TooltipMaterial content="Next Page">
            <button
              disabled={page >= totalPages}
              className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900
                   disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                   disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
              onClick={() => {
                if (page < totalPages) {
                  setPage(page + 1);
                  setInputPageValue(page + 1);
                }
              }}
            >
              <IoIosArrowForward className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          {/* Last Page */}
          <TooltipMaterial content="Last Page">
            <button
              disabled={page >= totalPages}
              className="p-1 rounded-md aspect-square bg-popLight hover:shadow-hrms cursor-pointer text-black-900
                   disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-white disabled:shadow-none
                   disabled:hover:shadow-none w-8 h-8 flex items-center justify-center"
              onClick={() => {
                setPage(totalPages);
                setInputPageValue(totalPages);
              }}
            >
              <LuSkipForward className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          {/* Rows per page */}
          <TooltipMaterial content="Rows per page">
            <select
              name="NumberOfRows"
              className="h-8 px-2 rounded-md bg-popLight"
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value, 10);
                setLimit(newLimit);
                setPage(1); // Reset to first page
                setInputPageValue(1);
              }}
            >
              {[10, 25, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </TooltipMaterial>
        </div>
      </div>


    </div>
  );
};

export default DutyRoaster;