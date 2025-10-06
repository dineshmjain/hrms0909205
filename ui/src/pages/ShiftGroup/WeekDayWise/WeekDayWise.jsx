import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { Button, Checkbox, IconButton, Option, Select, Typography } from '@material-tailwind/react';
import FormikInput from '../../../components/input/FormikInput';
import { ShiftGetAction } from '../../../redux/Action/Shift/ShiftAction';
import { days } from '../../../constants/Constants';
import * as Yup from 'yup';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PiPlusBold } from 'react-icons/pi';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { clientListAction } from "../../../redux/Action/Client/ClientAction";
import { useLocation } from 'react-router-dom';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../../../components/MultiSelectDropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { LuTrash2 } from 'react-icons/lu';

export const WeekDayWiseConfig = () => ({
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

const WeekDayWise = ({ isEditAvailable = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const { shiftList = [] } = useSelector((state) => state?.shift || {});
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { user } = useSelector((state) => state?.user);
  const [filterType, setFilterType] = React.useState("myOrg");
  const [shiftPattern, setShiftPattern] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [calendarYears, setCalendarYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedData, setSelectedData] = useState(null);
  const [addedShifts, setAddedShifts] = useState({});
  const [selectedShift, setSelectedShift] = useState("")

  useEffect(() => {
    dispatch(ShiftGetAction());
  }, [dispatch]);

  const getWeeksMonthsYears = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weeks = [], monthsSet = new Set(), yearsSet = new Set();
    const monthNames = moment.months();

    let current = new Date(start);
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
        label: `Week ${i}`,
      });

      monthsSet.add(`${year}-${month}`);
      yearsSet.add(year);
      current.setDate(current.getDate() + 7);
    }

    const months = Array.from(monthsSet).map(m => {
      const [year, monthIndex] = m.split('-');
      return {
        year: Number(year),
        month: Number(monthIndex) + 1,
        monthName: monthNames[Number(monthIndex)],
      };
    });

    const years = Array.from(yearsSet).map(year => ({ year: Number(year) }));
    return { weeks, months, years };
  };

  const getWeekNumber = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  };

  useEffect(() => {
    const data = getWeeksMonthsYears(values?.startDate, values?.endDate);
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

    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(moment(`${year}-${month}-${i}`, 'YYYY-MM-DD').format('YYYY-MM-DD'));

    return days;
  };

  const handleShiftGroup = (d, shiftData) => {
    let updatedShifts = [...shiftPattern];
    const selectedDay = d?.key;
    const existingIndex = updatedShifts.findIndex((d) => d?.day === selectedDay);

    if (existingIndex !== -1) {
      updatedShifts[existingIndex] = { day: selectedDay, ...shiftData };
    } else {
      updatedShifts.push({ day: selectedDay, ...shiftData });
    }
    setShiftPattern(updatedShifts);
    setSelectedShift(shiftData)

  };
  // const handleSubmit = (d) => {
  // setAddedShifts((prev) => ({
  //   ...prev,
  //   [d.key]: {
  //     id: selectedShift._id,
  //     name: selectedShift.name
  //   }
  // }));

  const handleSubmit = (d) => {
    const selectedDayKey = d.key;


    if (filterType === "myOrg") {
      if (!values?.subOrgId) return toast.error("Select an organization.");
      if (!values?.branchId) return toast.error("Select a branch.");
    }

    if (filterType === "clientOrg") {
      if (!selectedClient?.clientMappedId) return toast.error("Select a client.");
      if (!selectedClient?.clientBranchIds?.length) return toast.error("Select at least one client branch.");
    }
    if (!selectedShift?._id) return toast.error("Select a shift.");
    setAddedShifts((prev) => ({
      ...prev,
      [selectedDayKey]: {
        shift: {
          id: selectedShift._id,
          name: selectedShift.name,
          bg: selectedShift.bgColor,
          color: selectedShift.textColor,
          startTime: selectedShift.startTime,
          endTime: selectedShift.endTime,
        },
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
    setSelectedShift(null);
    setFieldValue('subOrgId', '');
    setFieldValue('branchId', '');
    setSelectedClient({
      clientMappedId: '',
      clientBranchIds: [],
      category: 'all',
    });
  };

  const getInitials = (name) => {
    if (!name) return '';
    const [first, second] = name.trim().split(/\s+/);
    return (first?.[0] + (second?.[0] || '')).toUpperCase();
  };


  // }
  const calendarDays = generateCalendarDays(selectedYear, selectedMonth, values?.startDay);
  const weekdayHeaders = getWeekdays(values?.startDay || 'sunday');

  const increaseMonth = () => {
    let newMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    let newYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

    const newDate = new Date(newYear, newMonth - 1); // JS months are 0-based

    if (newDate <= endDate) {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    }
  };

  const decreaseMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const [selectedClient, setSelectedClient] = useState({
    clientMappedId: state?._id || "",
    clientBranchIds: [],
    category: "all",
  });
  const { clientList } = useSelector((state) => state?.client);
  const { clientBranchList } = useSelector((state) => state?.clientBranch);
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
    if (user?.modules['suborganization'].r) {
      dispatch(SubOrgListAction());
    }
  }, [dispatch, user]);


  useEffect(() => {
    if (values?.subOrgId) {
      dispatch(BranchGetAction({
        mapedData: 'branch',
        orgLevel: true,
        subOrgId: values.subOrgId,
      }));
    }
  }, [dispatch, values.subOrgId]);



  return (
    <div className="w-full p-4">
      <SubCardHeader headerLabel="Week Day Wise" />

      <div className="flex flex-col justify-between lg:flex-row gap-6">
        <div className="flex flex-row  gap-4 w-full">
          <div className='flex flex-col gap-4 w-full max-w-sm'>
            {days.map((d, index) => (
              <div key={d.key} className="flex gap-3 justify-between">
                <div className="w-[10vw]">
                  <Typography>{d?.value}</Typography>
                </div>
                <div className="w-[15vw] ">
                  {addedShifts[d.key] ? (
                    <div className="flex flex-col w-full p-2 bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition">
                      <Typography className='text-xs font-semibold'>
                        {addedShifts[d.key].org ? "My Organization" : "Client Organization"}
                      </Typography>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-7 w-7 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: addedShifts[d.key]?.shift.bg }}
                          >
                            <Typography
                              className="text-xs font-semibold"
                              style={{ color: addedShifts[d.key].shift?.color }}
                            >
                              {getInitials(addedShifts[d.key].shift?.name)}
                            </Typography>
                          </div>
                          <span className="text-sm">{addedShifts[d.key].shift?.name}</span>
                        </div>
                      </div>
                      {addedShifts[d.key].org && (
                        <div className="text-xs text-gray-600 mt-1">
                          {addedShifts[d.key].org?.orgName} • {addedShifts[d.key].org?.branchName}
                        </div>
                      )}
                      {addedShifts[d.key].client && (
                        <div className="text-xs text-gray-600 mt-1">
                          {addedShifts[d.key].client?.clientName} • {addedShifts[d.key].client?.clientBranchNames?.join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      size="sm"
                      className="bg-primary w-fit text-white shadow-md hover:bg-primaryLight transition flex gap-2 p-2 rounded-md"
                      onClick={() => setSelectedData({ index, data: d })}
                    >
                      <PiPlusBold size={15} />
                    </button>
                  )}
                  {/* <button
                    size="sm"
                    className="bg-primary w-fit text-white shadow-md hover:bg-primaryLight transition flex gap-2 p-2 rounded-md"
                   onClick={() => setSelectedData({ index, data: d })}
                  >
                    <PiPlusBold size={15} />
                  </button> */}

                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-4 w-full px-2 max-w-sm'>
            {selectedData !== null && (
              <>
                <p>Selected Day : <strong>{selectedData.data.value}</strong></p>
                <div className="rounded-md w-72">
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
                  <label
                    className="block antialiased font-sans text-gray-700 text-[14px] font-medium"
                  >
                    Shift
                  </label>
                  {/* <Select variant="outlined" className="!border !border-gray-400 bg-white text-gray-900 rounded-md">
                    {[...shiftList, { _id: 0, name: 'Week Off' }].map((shiftdata) => (
                      <Option key={shiftdata._id} onClick={() => handleShiftGroup(selectedData.data, shiftdata)}>{shiftdata.name}</Option>
                    ))}
                  </Select> */}
                  <Select
                    value={selectedShift?._id || ""}
                    onChange={() => { }} // Optional to suppress warning
                    variant="outlined"
                    className="!border !border-gray-400 bg-white text-gray-900 rounded-md"
                  >
                    {[...shiftList, { _id: 0, name: 'Week Off' }].map((shiftdata) => (
                      <Option
                        key={shiftdata._id}
                        value={shiftdata._id}
                        onClick={() => handleShiftGroup(selectedData.data, shiftdata)}
                      >
                        {shiftdata.name}
                      </Option>
                    ))}
                  </Select>

                </div>
                <button className="bg-primary w-fit text-white shadow-md hover:bg-primaryLight transition flex gap-2 p-2 rounded-md"
                  onClick={() => handleSubmit(selectedData.data)}>Add</button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <div className="flex gap-4 mb-4 justify-between items-center">
            <FaCaretLeft onClick={decreaseMonth} />
            <select className="border p-2 rounded" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {months.filter(m => m.year === selectedYear).map(m => (
                <option key={m.month} value={m.month}>{m.monthName}</option>
              ))}
            </select>
            <select className="border p-2 rounded" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {calendarYears.map(y => (
                <option key={y.year} value={y.year}>{y.year}</option>
              ))}
            </select>
            <FaCaretRight onClick={increaseMonth} />
          </div>

          <div className="grid grid-cols-7 text-center font-medium text-gray-700 mb-2">
            {weekdayHeaders.map(day => <div key={day} className="capitalize py-2">{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((date, idx) => {
              if (!date) return <div key={idx} className="p-2" />;
              const thisDate = moment(date);
              const startDate = moment(values.startDate);
              const endDate = moment(values.endDate);
              if (thisDate.isBefore(startDate) || thisDate.isAfter(endDate)) return <div key={idx} className="p-2 text-gray-300">{thisDate.date()}</div>;

              const dayKey = thisDate.format('ddd').toLowerCase();
              const selectedShift = shiftPattern.find(d => d.day === dayKey);
              const isOffDay = !selectedShift;

              const customStyle = isOffDay ? {
                backgroundColor: '#c9c9c9',
                color: '#000000',
                fontWeight: 'bold'
              } : {
                backgroundColor: selectedShift?.bgColor ?? '#e0e0e0',
                color: selectedShift?.textColor ?? '#000000',
                fontWeight: 'bold'
              };
              return <div key={idx} className="p-2 h-10 flex items-center justify-center border rounded text-sm" style={customStyle}>{thisDate.date()}</div>;
            })}
          </div>
        </div>
      </div>

      {/* <div className="flex gap-4 py-10">
        {shiftList.map(data => (
          <div key={data._id} className="flex gap-2 items-center">
            <div className="h-5 w-5" style={{ background: data.bgColor }}></div>
            <Typography className="text-sm capitalize">{data.name}</Typography>
          </div>
        ))}
        <div className="flex gap-2 items-center">
          <div className="h-5 w-5 bg-gray-400"></div>
          <Typography className="text-sm capitalize">Week Off</Typography>
        </div>
      </div> */}
    </div>
  );
};

export default WeekDayWise;
