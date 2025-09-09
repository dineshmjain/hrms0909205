import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { Button, Typography } from '@material-tailwind/react';
import FormikInput from '../../../components/Input/FormikInput';
import { useDispatch, useSelector } from 'react-redux';
import { ShiftGetAction } from '../../../redux/Action/Shift/ShiftAction';
import { days } from '../../../constants/Constants';
import * as Yup from 'yup';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

export const CustomConfig = () => ({
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

const Custom = ({ isEditAvailable = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { shiftList = [] } = useSelector((state) => state?.shift || {});

  const [weekOffDays, setWeekOffDays] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [calendarYears, setCalendarYears] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [assignedWeeklyShifts, setAssignedWeeklyShifts] = useState([]);
  const [weekOffDaysMap, setWeekOffDaysMap] = useState({});

  useEffect(() => {
    dispatch(ShiftGetAction());
  }, [dispatch]);

  // const getWeeksMonthsYears = (startDate, endDate) => {
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   const weeks = [];
  //   const monthsSet = new Set();
  //   const yearsSet = new Set();

  //   const monthNames = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];

  //   let current = new Date(start);
  //   current.setDate(current.getDate() - current.getDay());
  //   let i = 0;

  //   while (current <= end) {
  //     const weekStart = new Date(current);
  //     const weekEnd = new Date(current);
  //     weekEnd.setDate(weekEnd.getDate() + 6);
  //     if (weekEnd > end) weekEnd.setTime(end.getTime());

  //     const weekNum = getWeekNumber(weekStart);
  //     const year = weekStart.getFullYear();
  //     const month = weekStart.getMonth();
  //     i++;

  //     weeks.push({
  //       weekStart: moment(weekStart).format('DD-MM-YYYY'),
  //       weekEnd: moment(weekEnd).format('DD-MM-YYYY'),
  //       week: weekNum,
  //       month: month + 1,
  //       monthName: monthNames[month],
  //       year,
  //       weekCount: i,
  //       label: `Week ${i}`,
  //     });

  //     monthsSet.add(`${year}-${month}`);
  //     yearsSet.add(year);
  //     current.setDate(current.getDate() + 7);
  //   }

  //   const months = Array.from(monthsSet).map(m => {
  //     const [year, monthIndex] = m.split('-');
  //     return {
  //       year: Number(year),
  //       month: Number(monthIndex) + 1,
  //       monthName: monthNames[Number(monthIndex)],
  //     };
  //   });

  //   const years = Array.from(yearsSet).map(year => ({ year: Number(year) }));
  //   return { weeks, months, years };
  // };

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
        label: `Week ${i}`
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
    console.log(weeks, '===========================================================================weeks')
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

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth, values?.startDay);
  const weekdayHeaders = getWeekdays(values?.startDay || 'sunday');

  //   const isWeekOff = (dateStr) => {
  //   const dayName = moment(dateStr, 'YYYY-MM-DD').format('ddd').toLowerCase();

  //   const matchedWeek = assignedWeeklyShifts.find((entry) =>
  //     moment(dateStr).isBetween(
  //       moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
  //       moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
  //       'day'
  //     )
  //   );

  //   if (!matchedWeek) return false;

  //   return matchedWeek?.weekOffDays?.some((d) => d?.toLowerCase() === dayName);
  // };

  // const isWeekOff = (dateStr) => {
  //   const dayName = moment(dateStr, 'YYYY-MM-DD').format('ddd').toLowerCase();
  //   const matchedWeek = assignedWeeklyShifts.find((entry) =>
  //     moment(dateStr).isBetween(
  //       moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
  //       moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
  //       'day'
  //     )
  //   );
  //   if (!matchedWeek) return false;
  //   return matchedWeek.weekOffDays?.some((d) => d?.toLowerCase() === dayName);
  // };

  //   const isWeekOff = (dateStr) => {
  //   const dayName = moment(dateStr, 'YYYY-MM-DD').format('ddd').toLowerCase();

  //   const matchedWeek = assignedWeeklyShifts.find((entry) =>
  //     moment(dateStr).isBetween(
  //       moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
  //       moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
  //       'day'
  //     )
  //   );

  //   if (!matchedWeek) return false;

  //   const weekOffDaysArray = Array.isArray(matchedWeek.weekOffDays)
  //     ? matchedWeek.weekOffDays
  //     : [];

  //   return weekOffDaysArray.some((d) => d?.toLowerCase() === dayName);
  // };


  const isWeekOff = (dateStr) => {
    const dayName = moment(dateStr, 'YYYY-MM-DD').format('ddd').toLowerCase();

    const matchedWeek = assignedWeeklyShifts.find((entry) =>
      moment(dateStr).isBetween(
        moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
        moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
        'day'
      )
    );

    if (!matchedWeek || !Array.isArray(matchedWeek.weekOffDays)) return false;

    return matchedWeek.weekOffDays.some((d) => d?.toLowerCase() === dayName);
  };

  const handleShiftGroup = () => {
    if (!values?.week || !values?.shift) return;

    const weekId = values.week.weekCount;

    // Store weekOffDays per week in a map
    const updatedWeekOffMap = {
      ...weekOffDaysMap,
      [weekId]: weekOffDays,
    };
    setWeekOffDaysMap(updatedWeekOffMap);

    const exists = assignedWeeklyShifts.find(
      (entry) => entry.week?.weekCount === weekId
    );

    const newEntry = {
      week: values.week,
      shift: values.shift,
      weekOffDays: weekOffDays,
    };

    const updated = exists
      ? assignedWeeklyShifts.map((entry) =>
        entry.week?.weekCount === weekId ? newEntry : entry
      )
      : [...assignedWeeklyShifts, newEntry];

    setAssignedWeeklyShifts(updated);
  };



  const handleWeekSelection = (selected) => {
    setFieldValue('weekId', selected?.weekCount);
    setFieldValue('week', selected);
    setWeekOffDays(weekOffDaysMap[selected?.weekCount] || []);
  };

  const handleWeekOffChange = (newWeekOffDays) => {
    setWeekOffDays(newWeekOffDays);
    if (values?.week?.weekCount) {
      setWeekOffDaysMap(prev => ({
        ...prev,
        [values.week.weekCount]: newWeekOffDays,
      }));
    }
  };

  const increaseMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const decreaseMonth = () => {
    console.log(selectedMonth)
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  return (
    <div className="w-full p-4">
      <SubCardHeader headerLabel="Weekly" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {/* <FormikInput
            name="weekId"
            size="sm"
            label="Select Week"
            inputType={isEditAvailable ? 'edit' : 'dropdown'}
            listData={weeks}
            feildName="label"
            showSerch
            selectedOption={values?.weekId}
            selectedOptionDependency="weekCount"
            handleClick={handleWeekSelection}
          /> */}

          <FormikInput
            name="weekId"
            size="sm"
            label="Select Week"
            inputType={isEditAvailable ? 'edit' : 'dropdown'}
            listData={weeks}
            feildName="label"
            showSerch
            selectedOption={values?.weekId}
            selectedOptionDependency="weekCount"
            handleClick={(selected) => {
              setFieldValue('weekId', selected?.weekCount);
              setFieldValue('week', selected);

              const existingEntry = assignedWeeklyShifts.find(
                (entry) => entry.week?.weekCount === selected?.weekCount
              );

              // Set weekOffDays to match stored value if exists
              if (existingEntry) {
                setWeekOffDays(existingEntry.weekOffDays || []);
              } else {
                setWeekOffDays([]); // default empty if new
              }
            }}
          />
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
          <FormikInput
            inputType="multiDropdown"
            name="weekOff"
            data={days}
            InputName="Select Week Off"
            Dependency="key"
            FeildName="value"
            selectedData={weekOffDays}
            setSelectedData={(selected) => {
              setWeekOffDays(selected);
              if (values?.week?.weekCount) {
                setWeekOffDaysMap((prev) => ({
                  ...prev,
                  [values.week.weekCount]: selected,
                }));
              }
            }}
          />



          <Button onClick={handleShiftGroup}>Add</Button>
        </div>
        <div>
          <div className="flex-1 justify-between">
            <div className="flex gap-4 mb-4 justify-between items-center">
              <FaCaretLeft onClick={() => { decreaseMonth() }} />
              <select
                className="border p-2 rounded"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.filter((m) => m.year === selectedYear).map((m) => (
                  <option key={m.month} value={m.month}>{m.monthName}</option>
                ))}
              </select>

              <select
                className="border p-2 rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {calendarYears.map((y) => (
                  <option key={y.year} value={y.year}>{y.year}</option>
                ))}
              </select>
              <FaCaretRight onClick={() => { increaseMonth() }} />
            </div>

            <div className="grid grid-cols-7 text-center font-semibold">
              {weekdayHeaders.map((day) => (
                <div key={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mt-2 text-center">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} className="p-2" />;

                const thisDate = moment(date, 'YYYY-MM-DD');

                if (
                  thisDate.isBefore(moment(values.startDate, 'YYYY-MM-DD')) ||
                  thisDate.isAfter(moment(values.endDate, 'YYYY-MM-DD'))
                ) {
                  return <div key={idx} className="p-2 text-gray-300" > {thisDate.date()}</div>;
                }

                const weekEntry = assignedWeeklyShifts.find((entry) =>
                  thisDate.isBetween(
                    moment(entry.week.weekStart, 'DD-MM-YYYY').clone().subtract(1, 'day'),
                    moment(entry.week.weekEnd, 'DD-MM-YYYY').clone().add(1, 'day'),
                    'day'
                  )
                );

                const offDay = isWeekOff(date);
                let customStyle = {};


                if (offDay) {
                  customStyle = {
                    backgroundColor:'#c9c9c9',
                    color: '#000000',
                    fontWeight: 'bold',
                  };


                } else if (weekEntry) {
                  customStyle = {
                    backgroundColor: weekEntry.shift.bgColor,
                    color: weekEntry.shift.textColor || '#000000',
                  };
                }

                return (
                  <div
                    key={idx}
                    className="p-2 border rounded"
                    style={customStyle}
                  >
                    {thisDate.date()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
<div className=' flex gap-4 py-10  '>
          {shiftList?.map((data)=>{
            return(
              <div className='flex gap-2 my-1 items-center'><div className='h-5 w-5' style={{background:data?.bgColor}}></div><Typography className='text-sm capitalize'>{data?.name}</Typography></div>
            )
          })}
           <div className='flex gap-2 my-1 items-center'><div className='h-5 w-5 bg-gray-400' ></div><Typography className='text-sm capitalize'>Week Off</Typography></div>
      
        </div>
       
      </div>
       
    </div>
  );
};

export default Custom;
