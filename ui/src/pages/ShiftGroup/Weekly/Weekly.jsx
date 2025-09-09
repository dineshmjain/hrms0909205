import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { Button, Input, Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import { ShiftGetAction } from '../../../redux/Action/Shift/ShiftAction';
import { days } from '../../../constants/Constants';
import * as Yup from 'yup';
import { FaCaretLeft, FaCaretRight, FaPen } from 'react-icons/fa';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { DepartmentGetAssignedAction } from '../../../redux/Action/Department/DepartmentAction';
import { DesignationGetAssignedAction } from '../../../redux/Action/Designation/DesignationAction';
import { RoleGetAction } from '../../../redux/Action/Roles/RoleAction';
import { EmployeeOfficialDetailsAction } from '../../../redux/Action/Employee/EmployeeAction';
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { clientListAction } from "../../../redux/Action/Client/ClientAction";
import { useLocation } from 'react-router-dom';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../../../components/MultiSelectDropdown/MultiSelectDropdown';
import { PiPlusBold } from 'react-icons/pi';
import { ImCancelCircle } from "react-icons/im";
import toast from 'react-hot-toast';
import YearMonthFilter from '../../../components/YearMonthFilter/YearMonthFilter';
import { ShiftGroupCreateAction } from '../../../redux/Action/ShiftGroup/ShiftGroupAction';


export const WeeklyConfig = (
) => ({
  initialValues: {
    year: moment().format('YYYY'),
    month: moment().format('MM'),
    shiftId: '',
    startDay: 'monday',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
    weekId: '',
    week: null,
    shift: null,
  },
  validationSchema: Yup.object().shape({
    shiftId: Yup.string().required('Shift is required'),
  }),
});

const getWeekdays = (startDay = 'sunday') => {
  const baseDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const index = baseDays.indexOf(startDay.toLowerCase());
  return [...baseDays.slice(index), ...baseDays.slice(0, index)];
};

const Weekly = ({
  isEditAvailable = false,
  onPayloadChange
  //  jsonValues = {} 
}) => {
  const { shiftList = [] } = useSelector((state) => state?.shift || {});
  const [weekOffDays, setWeekOffDays] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [calendarYears, setCalendarYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [assignedWeeklyShifts, setAssignedWeeklyShifts] = useState([]);
  const [weekOffDaysMap, setWeekOffDaysMap] = useState({});
  const [activeMonth, setActiveMonth] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  // const [patternName, setPatternName] = useState("");
  const [addedShifts, setAddedShifts] = useState({});
  const [week, SetWeek] = useState()
  const [selectedFilters, setSelectedFilters] = useState({
    year: "",
    month: "",
  });
  const [patterns, setPatterns] = useState([
    { patternName: "" },
  ]);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();
  const [filterType, setFilterType] = React.useState("myOrg");
  const { user } = useSelector((state) => state?.user);
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { employeeOfficial } = useSelector((state) => state?.employee)
  const [monthsAndWeeks, setMonthsAndWeeks] = useState({});
  const [selectedClient, setSelectedClient] = useState({
    clientMappedId: state?._id || "",
    clientBranchIds: [],
    category: "all",
  });
  const { clientList } = useSelector((state) => state?.client);
  const { clientBranchList } = useSelector((state) => state?.clientBranch);
  const [selectedMonths, setSelectedMonths] = useState([moment().month() + 1]);

  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [availableWeeks, setAvailableWeeks] = useState([]);


  const getMonthName = (monthNum) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1];
  };
  const generateWeeksForMonths = (year, months) => {
    const allWeeks = [];

    months.forEach(month => {
      const monthStart = moment(`${year}-${month}-01`);
      const monthEnd = moment(monthStart).endOf('month');

      let weekStart = moment(monthStart);
      let weekNumber = 1;

      while (weekStart.isSameOrBefore(monthEnd)) {
        const weekEnd = moment(weekStart).add(6, 'days');

        if (weekStart.isSameOrBefore(monthEnd)) {
          allWeeks.push({
            label: `${getMonthName(month)} - Week ${weekNumber}`,
            month: month,
            year: year,
            weekStart: weekStart.format('YYYY-MM-DD'),
            weekEnd: weekEnd.format('YYYY-MM-DD'),
            weekNumber: weekNumber
          });
        }

        weekStart.add(7, 'days');
        weekNumber++;
      }
    });

    return allWeeks;
  };

  // Add these useEffect hooks
  // useEffect(() => {
  //   const weeks = generateWeeksForMonths(selectedYear, selectedMonths);
  //   setAvailableWeeks(weeks);
  // }, [selectedYear, selectedMonths]);
  useEffect(() => {
    const weeks = generateWeeksForMonths(selectedYear, selectedMonths);
    setAvailableWeeks(weeks);

    // Keep only the selected weeks that still exist in the new weeks list
    setSelectedWeeks(prev =>
      prev.filter(weekValue => weeks.some(w => w.label === weekValue))
    );
  }, [selectedYear, selectedMonths]);


  // Add these filter components in the render section
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: moment().year() - 5 + i,
    label: (moment().year() - 5 + i).toString()
  }));

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const getClientBranch = (clientId) => {
    dispatch(clientBranchListAction({ clientMappedId: clientId }));
  };
  const handleChange = (name, value) => {
    setSelectedClient((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    if (state?._id) {
      return getClientBranch(state?._id);
    }
    dispatch(clientListAction({})).then(({ payload }) => {
      if (payload?.data?.length) {
        handleChange("clientMappedId", payload?.data?.[0]?._id);
        getClientBranch(payload?.data?.[0]?._id);
      }
    });
  }, [state]);

  useEffect(() => {
    dispatch(ShiftGetAction());
  }, [dispatch]);
  // 🔁 Fetch dropdowns
  useEffect(() => {
    dispatch(RoleGetAction());
  }, [dispatch]);

  useEffect(() => {
    if (user?.modules['suborganization'].r) {
      dispatch(SubOrgListAction());
    }
  }, [dispatch, user]);
  useEffect(() => {
    dispatch(EmployeeOfficialDetailsAction({ id: state?._id }));

  }, [dispatchEvent, state?._id])
  useEffect(() => {

    setFieldValue('branchId', employeeOfficial?.branchId)
    setFieldValue('subOrgId', employeeOfficial?.subOrgId)
    setFieldValue('departmentId', employeeOfficial?.departmentId)
    setFieldValue('designationId', employeeOfficial?.designationId)
  }, [employeeOfficial])

  console.log(employeeOfficial, "user")

  useEffect(() => {
    if (values?.subOrgId) {
      dispatch(BranchGetAction({
        mapedData: 'branch',
        orgLevel: true,
        subOrgId: values.subOrgId,
      }));
    }
  }, [dispatch, values.subOrgId]);

  function getWeeksMonthsYears(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks = [];
    const monthsSet = new Set();
    const yearsSet = new Set();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let current = new Date(start); // <-- start from startDate directly
    let i = 0;

    while (current <= end) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > end) weekEnd.setTime(end.getTime());

      const weekNum = getWeekNumber(weekStart);
      const year = weekStart.getFullYear();
      const month = weekStart.getMonth();
      i++;

      weeks.push({
        weekStart: moment(weekStart).format('DD-MM-YYYY'),
        weekEnd: moment(weekEnd).format('DD-MM-YYYY'),
        week: weekNum,
        month: month + 1,
        monthName: monthNames[month],
        year,
        weekCount: i,
        label: `${monthNames[month]} ${moment(weekStart).format('DD')}- ${monthNames[month]} ${moment(weekEnd).format('DD')} W-${weekNum}`
      });

      monthsSet.add(`${year}-${month}`);
      yearsSet.add(year);

      current.setDate(current.getDate() + 7); // move to next week
    }

    const months = Array.from(monthsSet).map(m => {
      const [year, monthIndex] = m.split('-');
      return {
        year: Number(year),
        month: Number(monthIndex) + 1,
        monthName: monthNames[Number(monthIndex)]
      };
    });

    const years = Array.from(yearsSet).map(year => ({ year: Number(year) }));
    return { weeks, months, years };
  }

  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  };

  useEffect(() => {
    const data = getWeeksMonthsYears(values?.startDate, values?.endDate);
    console.log(data.weeks, '===========================================================================weeks')
    setWeeks(data.weeks || []);
    setMonths(data.months || []);
    setCalendarYears(data.years || []);
  }, [values?.startDate, values?.endDate, values?.startDay]);

  const generateCalendarDays = (year, month, startDay = 'sunday') => {
    const start = moment(`${year}-${month}`, 'YYYY-MM');
    const daysInMonth = start.daysInMonth();
    const days = [];
    const weekdayOrder = getWeekdays(startDay);
    const firstDayIndex = weekdayOrder.indexOf(start.format('ddd').toLowerCase());

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(moment(`${year}-${month}-${i}`, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    return days;
  };


  // const isWeekOff = (dateStr) => {
  //   const dayName = moment(dateStr, 'YYYY-MM-DD').format('ddd').toLowerCase();

  //   const matchedWeek = assignedWeeklyShifts.find((entry) =>
  //     moment(dateStr).isBetween(
  //       moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
  //       moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
  //       'day'
  //     )
  //   );

  //   if (!matchedWeek || !Array.isArray(matchedWeek.weekOffDays)) return false;

  //   return matchedWeek.weekOffDays.some((d) => d?.toLowerCase() === dayName);
  // };

  // const handleShiftGroup = () => {
  //   if (!values?.week || !values?.shift) return;

  //   const weekId = values.week.weekCount;

  //   // Store weekOffDays per week in a map
  //   const updatedWeekOffMap = {
  //     ...weekOffDaysMap,
  //     [weekId]: weekOffDays,
  //   };
  //   setWeekOffDaysMap(updatedWeekOffMap);

  //   const exists = assignedWeeklyShifts.find(
  //     (entry) => entry.week?.weekCount === weekId
  //   );

  //   const newEntry = {
  //     week: values.week,
  //     shift: values.shift,
  //     weekOffDays: weekOffDays,
  //   };

  //   const updated = exists
  //     ? assignedWeeklyShifts.map((entry) =>
  //       entry.week?.weekCount === weekId ? newEntry : entry
  //     )
  //     : [...assignedWeeklyShifts, newEntry];

  //   setAssignedWeeklyShifts(updated);
  // };
  // const increaseMonth = () => {
  //   if (selectedMonth === 12) {
  //     setSelectedMonth(1);
  //     setSelectedYear(prev => prev + 1);
  //   } else {
  //     console.log(values?.month, selectedMonth)
  //     setSelectedMonth(prev => prev + 1);
  //   }
  // };

  // const decreaseMonth = () => {
  //   console.log(selectedMonth)
  //   if (selectedMonth === 1) {
  //     setSelectedMonth(12);
  //     setSelectedYear(prev => prev - 1);
  //   } else {
  //     setSelectedMonth(prev => prev - 1);
  //   }
  // };

  const handleSubmit = (selectedIndex) => {
    const selectedDayKey = selectedIndex;

    if (filterType === "myOrg") {
      if (!values?.subOrgId) return toast.error("Select an organization.");
      if (!values?.branchId) return toast.error("Select a branch.");
    }

    if (filterType === "clientOrg") {
      if (!selectedClient?.clientMappedId) return toast.error("Select a client.");
      if (!selectedClient?.clientBranchIds?.length) return toast.error("Select at least one client branch.");
    }
    if (!values.shift?._id) return toast.error("Select a shift.");

    setAddedShifts((prev) => ({
      ...prev,
      [selectedDayKey]: {
        shift: {
          id: values.shift._id,
          name: values.shift.name,
          bg: values.shift.bgColor,
          color: values.shift.textColor,
          startTime: values.shift.startTime,
          endTime: values.shift.endTime,
        },
        weekoffDay: { number: weekOffDays?.[0] ?? 0, name: days.find(d => d.id === weekOffDays?.[0])?.value || "" },
        org:
          filterType === "myOrg"
            ? {
              orgId: values.subOrgId,
              orgName: subOrgs?.find((o) => o._id === values.subOrgId)?.name,
              branchId: values.branchId,
              branchName: branchList?.find((b) => b._id === values.branchId)?.name,
            }
            : null,
        client:
          filterType === "clientOrg"
            ? {
              clientId: selectedClient?.clientMappedId,
              clientName: clientList?.find((c) => c._id === selectedClient?.clientMappedId)?.nickName,
              clientBranchIds: selectedClient?.clientBranchIds,
              clientBranchNames: clientBranchList
                ?.filter((b) => selectedClient?.clientBranchIds?.includes(b._id))
                ?.map((b) => b.name),
            }
            : null,
      },
    }));

    // Clear edit state
    setSelectedData(null);
    setFieldValue('subOrgId', '');
    setFieldValue('branchId', '');
    setFieldValue('shiftId', '');
    setWeekOffDays(null);
    setSelectedClient({ clientMappedId: '', clientBranchIds: [], category: 'all' });
  };

  const generatePayload = async () => {
    const timeFrame = Object.entries(monthsAndWeeks).map(([month, weeks]) => ({
      month: String(month),
      weeks
    }));
    try {
      const payload = {
        year: selectedYear,
        timeFrame,
        patterns: patterns.map((p, index) => {
          const shiftData = addedShifts[index];
          if (!shiftData) return null;
          let patternObj = {
            name: p.patternName,
            shiftId: shiftData.shift.id,
            weekOff: shiftData.weekoffDay?.number || 0
          };
          if (shiftData.org) {
            patternObj.subOrgId = shiftData.org.orgId;
            patternObj.branchId = shiftData.org.branchId;
          } else if (shiftData.client) {
            patternObj.clientMappedId = shiftData.client.clientId;
            patternObj.clientBranchId = shiftData.client.clientBranchIds[0];
          }
          return patternObj;
        }).filter(Boolean)
      };

      console.log(payload, "payload add pattern");
      const result = await dispatch(ShiftGroupCreateAction({ ...payload }));
      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/shiftgroup/list");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const [first, second] = name.trim().split(/\s+/);
    return (first?.[0] + (second?.[0] || '')).toUpperCase();
  };
  const handleInputChange = (index, field, value) => {
    const updated = [...patterns];
    updated[index][field] = value;
    setPatterns(updated);
  };
  const addPattern = () => {
    setPatterns([...patterns, { patternName: "", value: "" }]);
  };
  const removePattern = (keyToRemove) => {
    setPatterns((prev) => prev.filter((_, index) => index !== keyToRemove));
    setAddedShifts((prev) => {
      const copy = { ...prev };

      // Create a new object with shifted keys
      const newCopy = {};
      Object.keys(copy).forEach(key => {
        const numKey = parseInt(key);
        if (numKey < keyToRemove) {
          // Keep keys before the removed index
          newCopy[key] = copy[key];
        } else if (numKey > keyToRemove) {
          // Shift keys after the removed index down by 1
          newCopy[numKey - 1] = copy[key];
        }
        // Skip the keyToRemove index
      });

      return newCopy;
    });
  };


  console.log(values, "what are the assignedweek");

  return (
    <div className="w-full p-4">
      <div className='py-4 flex flex-row gap-4'>
        <SingleSelectDropdown
          feildName="label"
          listData={yearOptions}
          inputName="Year"
          selectedOption={selectedYear}
          hideLabel={true}
          handleClick={(selected) => {
            setSelectedYear(selected?.value);
          }}
        />


        <MultiSelectDropdown
          data={monthOptions}
          selectedData={selectedMonths}
          Dependency="value"
          FeildName="label"
          InputName="Months"
          setSelectedData={(selected) => {
            const monthsArray = Array.isArray(selected) ? selected : [];
            setSelectedMonths(monthsArray);

            // Initialize empty weeks for each selected month
            setMonthsAndWeeks(prev => {
              const updated = { ...prev };
              monthsArray.forEach(month => {
                if (!updated[month]) {
                  updated[month] = [];
                }
              });
              return updated;
            });
          }}
          hideLabel
        />

        <MultiSelectDropdown
          data={availableWeeks}
          selectedData={selectedWeeks}
          Dependency="label"
          FeildName="label"
          InputName="Weeks"
          setSelectedData={(selected) => {
            const weeksArray = Array.isArray(selected) ? selected : [];
            setSelectedWeeks(weeksArray);

            setMonthsAndWeeks(prev => {
              const updated = { ...prev };

              // Clear all weeks for selected months first
              selectedMonths.forEach(m => {
                updated[m] = [];
              });

              // Add the selected week numbers to the right month
              weeksArray.forEach(weekLabel => {
                const weekObj = availableWeeks.find(w => w.label === weekLabel);
                if (weekObj) {
                  if (!updated[weekObj.month]) updated[weekObj.month] = [];
                  updated[weekObj.month].push(weekObj.weekNumber);
                }
              });

              return updated;
            });
          }}

          hideLabel
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full max-w-md">
          {patterns.map((d, index) => (
            <div key={index} className="flex gap-3 h-fit items-end">
              <div className="w-[15vw]">
                <label
                  className="block antialiased font-sans text-gray-700 text-[14px] font-medium">
                  Pattern Name
                </label>
                <input
                  type="text"
                  placeholder="Pattern Name"
                  className="bg-white p-2 text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mt-1"
                  value={d.patternName}
                  onChange={(e) => handleInputChange(index, "patternName", e.target.value)}
                />
              </div>
              <div className="w-[15vw]">
                {addedShifts[index] ? (
                  <div className="flex flex-col w-full p-2 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className='flex justify-between'>
                      <Typography className='text-xs font-semibold'>
                        {addedShifts[index].org ? "My Organization" : "Client Organization"}
                      </Typography>
                      <button
                        className="text-blue-500 hover:underline text-xs"
                        onClick={() => {
                          // Prefill selected data
                          setSelectedData({ index, data: patterns[index] });

                          // Prefill form fields from existing shift
                          const shiftData = addedShifts[index];
                          if (shiftData.org) {
                            setFilterType("myOrg");
                            setFieldValue("subOrgId", shiftData.org.orgId);
                            setFieldValue("branchId", shiftData.org.branchId);
                          } else {
                            setFilterType("clientOrg");
                            setSelectedClient({
                              category: "all",
                              clientMappedId: shiftData.client.clientId,
                              clientBranchIds: shiftData.client.clientBranchIds,
                            });
                          }

                          setFieldValue("shiftId", shiftData.shift.id);
                          setFieldValue("shift", {
                            _id: shiftData.shift.id,
                            name: shiftData.shift.name,
                            bgColor: shiftData.shift.bg,
                            textColor: shiftData.shift.color,
                            startTime: shiftData.shift.startTime,
                            endTime: shiftData.shift.endTime,
                          });
                          setWeekOffDays(
                            Array.isArray(shiftData?.weekoffDay?.number)
                              ? shiftData.weekoffDay.number
                              : [shiftData.weekoffDay.number]
                          );
                        }}
                      >
                        <FaPen color='black' size={14} />
                        {/* Edit */}
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: addedShifts[index]?.shift.bg }}
                        >
                          <Typography
                            className="text-xs font-semibold"
                            style={{ color: addedShifts[index].shift?.color }}
                          >
                            {getInitials(addedShifts[index].shift?.name)}
                          </Typography>
                        </div>
                        <span className="text-sm">{addedShifts[index].shift?.name}</span>
                      </div>
                    </div>
                    {addedShifts[index].org && (
                      <div className="text-xs text-gray-600 mt-1">
                        {addedShifts[index].org?.orgName} • {addedShifts[index].org?.branchName}
                      </div>
                    )}
                    {addedShifts[index].client && (
                      <div className="text-xs text-gray-600 mt-1">
                        {addedShifts[index].client?.clientName} • {addedShifts[index].client?.clientBranchNames?.join(", ")}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mt-1">
                      {Array.isArray(addedShifts[index]?.weekoffDay?.name) ? addedShifts[index].weekoffDay.name.join(", ") : addedShifts[index].weekoffDay.name}
                    </div>
                  </div>
                ) : (
                  <button
                    size="sm"
                    className="bg-primary w-fit text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-2 rounded-md"
                    onClick={() => {
                      if (d.patternName) {
                        setSelectedData(null);
                        setFieldValue('subOrgId', '');
                        setFieldValue('branchId', '');
                        setFieldValue('shiftId', '');
                        setWeekOffDays(null);
                        setSelectedClient({ clientMappedId: '', clientBranchIds: [], category: 'all' });
                        setSelectedData({ index, data: d })
                      } else {
                        toast.error("Pattern Name Is Required")
                      }
                    }}
                  >Add
                  </button>
                )}
              </div>
              {patterns.length > 1 && (
                <div className="">
                  <button
                    onClick={() => removePattern(index)}
                  // className="items-center bg-primary w-fit text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-2 rounded-md"
                  >
                    <ImCancelCircle color='red' size={20} />
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button onClick={addPattern} className="items-center bg-primary w-fit text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-2 rounded-md">
              <PiPlusBold size={15} />Add More
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {selectedData !== null && (
            <>
              <p>Selected Pattern : <strong>{selectedData.data.patternName}</strong></p>
              <div className="rounded-md">
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
                {filterType == "myOrg" ? (
                  <div className="flex flex-col mt-2 gap-4">
                    {user?.modules['suborganization'].r && (
                      <div className="w-[250px]">
                        <FormikInput
                          name="subOrgId"
                          size="sm"
                          label="Organization"
                          inputType={isEditAvailable ? "edit" : "dropdown"}
                          listData={subOrgs}
                          inputName="Select Organization"
                          feildName="name"
                          hideLabel
                          showTip={false}
                          showSerch={true}
                          handleClick={(selected) => setFieldValue('subOrgId', selected?._id)}
                          selectedOption={values?.subOrgId}
                          editValue={subOrgs?.filter((d) => d._id == values.subOrgId)[0]?.name}
                          selectedOptionDependency="_id"

                        />
                      </div>
                    )}
                    <div className="w-[250px]">
                      <FormikInput
                        name="branchId"
                        size="sm"
                        label="Branch"
                        inputType={isEditAvailable ? "edit" : "dropdown"}
                        listData={branchList}
                        inputName="Select Branch"
                        feildName="name"
                        hideLabel
                        showTip={false}
                        showSerch={true}
                        handleClick={(selected) => setFieldValue('branchId', selected?._id)}
                        selectedOption={values?.branchId}
                        selectedOptionDependency="_id"
                      // editValue={branchList?.filter((d)=>d._id==values.branchId)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col mt-2 gap-4">
                    <div className="w-[250px]">
                      <SingleSelectDropdown
                        selectedOption={selectedClient?.clientMappedId}
                        listData={clientList}
                        selectedOptionDependency={"_id"}
                        feildName="nickName"
                        inputName="Client"
                        disabled={state?._id}
                        handleClick={(data) => {
                          setSelectedClient((prev) => {
                            return {
                              category: "all",
                              clientMappedId: data?._id,
                              clientBranchIds: [],
                            };
                          });
                          getClientBranch(data?._id);
                        }}
                        hideLabel
                      />
                    </div>
                    <div className="w-[250px]">
                      <MultiSelectDropdown
                        data={clientBranchList}
                        selectedData={selectedClient?.clientBranchIds}
                        Dependency={"_id"}
                        FeildName="name"
                        InputName={"Client Branch"}
                        setFieldName={"clientBranchIds"}
                        setSelectedData={setSelectedClient}
                        hideLabel
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-[250px]">
                <FormikInput
                  name="shiftId"
                  size="sm"
                  label="Select Shift"
                  inputType={isEditAvailable ? 'edit' : 'dropdown'}
                  listData={shiftList}
                  feildName="name"
                  showSerch
                  selectedOption={values?.shiftId}
                  selectedOptionDependency="_id"
                  handleClick={(selected) => {
                    setFieldValue('shiftId', selected?._id);
                    setFieldValue('shift', selected);
                  }}
                />
              </div>
              <div className="w-[250px]">
                <FormikInput
                  inputType="multiDropdown"
                  name="weekOff"
                  data={days}
                  InputName="Select Week Off"
                  Dependency="id"
                  FeildName="value"
                  setSelectedData={(selected) => {
                    setWeekOffDays(selected);
                  }}
                  selectedData={weekOffDays}
                />
              </div>
              <Button
                size="sm"
                className="bg-primary w-fit text-white shadow-md hover:bg-primaryLight transition flex gap-2"
                // onClick={handleShiftGroup}
                onClick={() => handleSubmit(selectedData.index)}>
                <Typography className="text-sm">Add</Typography>
              </Button>
            </>
          )}

        </div>
      </div>
      <div className="mt-10 flex gap-4">
        <button
          className="p-2 rounded-md transition bg-green-700 text-white"
          onClick={generatePayload}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Weekly;
