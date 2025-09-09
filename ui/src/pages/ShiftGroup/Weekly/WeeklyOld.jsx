// // WeeklyConfig.js
import * as Yup from 'yup';

// export const WeeklyConfig = () => ({
//   initialValues: {
//     year: moment().format('YYYY'),
//     month: moment().format('MM'),
//     shiftId: '',
//     weekId: '',
//     week: null,
//     shift: null,
//   },
//   validationSchema: Yup.object().shape({
//     shiftId: Yup.string().required('Shift is required'),
//     // Extend validation if needed
//   }),
// });
// // Weekly.js

// const Weekly = ({ isEditAvailable = false }) => {
//   const { values, setFieldValue } = useFormikContext();
//   const dispatch = useDispatch();
//   const { shiftList = [] } = useSelector((state) => state?.shift || {});

//   const [shiftListArray, setShiftListArray] = useState([]);
//   const [weekOffDays, setWeekOffDays] = useState([]);
//   const [weeks, setWeeks] = useState([]);
//   const [rotatedDays, setRotatedDays] = useState([]);
//   const [customisedDays, setCustomisedDays] = useState([]);

//   useEffect(() => {
//     dispatch(ShiftGetAction());
//   }, []);

//   useEffect(() => {
//     if (values?.startDay) {
//       const index = days.findIndex((d) => d.key === values.startDay);
//       if (index !== -1) {
//         setRotatedDays([...days.slice(index), ...days.slice(0, index)]);
//       }
//     }
//   }, [values?.startDay]);

//   useEffect(() => {
//     if (values?.startDate && values?.endDate && values?.startDay) {
//       const generatedWeeks = generateWeeksSequential(values.startDate, values.endDate);
//       setWeeks(generatedWeeks);
//     }
//   }, [values?.startDate, values?.endDate, values?.startDay]);

//   useEffect(() => {
//     const dayList = getDaysInMonth(values?.year, values?.month);
//     setCustomisedDays(dayList);
//   }, [values?.month, values?.year]);

//   const generateWeeksSequential = (startDate, endDate) => {
//     const startDayIndex = moment().day(values?.startDay).day();
//     let current = moment(startDate).day(startDayIndex);

//     if (moment(startDate).isAfter(current)) {
//       current.add(7, 'days');
//     }

//     const end = moment(endDate).endOf('day');
//     const result = [];
//     let weekCounter = 1;

//     while (current.isBefore(end)) {
//       result.push({
//         week: weekCounter,
//         label: `Week ${weekCounter}`,
//         value: weekCounter,
//         start: current.clone().format('YYYY-MM-DD'),
//         end: current.clone().add(6, 'days').format('YYYY-MM-DD'),
//       });
//       current.add(7, 'days');
//       weekCounter++;
//     }

//     return result;
//   };

//   const getDaysInMonth = (year, month) => {
//     const daysInMonth = moment({ year, month: month - 1 }).daysInMonth();
//     return Array.from({ length: daysInMonth }, (_, i) => {
//       const dayMoment = moment({ year, month: month - 1, day: i + 1 });
//       return {
//         value: dayMoment.format('DD'),
//         day: dayMoment.format('ddd'),
//         date: dayMoment.format('YYYY-MM-DD'),
//         id: i + 1,
//       };
//     });
//   };

//   const handleShiftGroup = () => {
//     const filteredShifts = shiftListArray.filter((item) => item.value !== values?.weekId);
//     const newShift = {
//       ...values?.week,
//       ...values?.shift,
//       weekOffDays,
//     };
//     setShiftListArray([...filteredShifts, newShift]);
//   };

//   const updateWeekOff = (data, day) => {
//     const updatedList = shiftListArray.map((item) => {
//       if (item.value === data.value) {
//         const updatedDays = item.weekOffDays.includes(day)
//           ? item.weekOffDays.filter((d) => d !== day)
//           : [...item.weekOffDays, day];
//         return { ...item, weekOffDays: updatedDays };
//       }
//       return item;
//     });
//     setShiftListArray(updatedList);
//   };

//   const incrementMonthYear = () => {
//     const month = parseInt(values?.month, 10);
//     const year = parseInt(values?.year, 10);
//     if (month === 1) {
//       setFieldValue('month', 12);
//       setFieldValue('year', year - 1);
//     } else {
//       setFieldValue('month', month - 1);
//     }
//   };

//   const decrementMonthYear = () => {
//     const month = parseInt(values?.month, 10);
//     const year = parseInt(values?.year, 10);
//     if (month === 12) {
//       setFieldValue('month', 1);
//       setFieldValue('year', year + 1);
//     } else {
//       setFieldValue('month', month + 1);
//     }
//   };

//   return (
//     <div className="w-full p-4">
//       <SubCardHeader headerLabel="Weekly" />
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left Form Section */}
//         <div className="flex flex-col gap-4 w-full max-w-xs">
//           <FormikInput
//             name="weekId"
//             size="sm"
//             label="Select Week"
//             inputType={isEditAvailable ? 'edit' : 'dropdown'}
//             listData={weeks}
//             feildName="label"
//             showSerch
//             selectedOption={values?.weekId}
//             selectedOptionDependency="value"
//             handleClick={(selected) => {
//               setFieldValue('weekId', selected?.value);
//               setFieldValue('week', selected);
//             }}
//           />
//           <FormikInput
//             name="shiftId"
//             size="sm"
//             label="Select Shift"
//             inputType={isEditAvailable ? 'edit' : 'dropdown'}
//             listData={shiftList}
//             feildName="name"
//             showSerch
//             selectedOption={values?.shiftId}
//             selectedOptionDependency="_id"
//             handleClick={(selected) => {
//               setFieldValue('shiftId', selected?._id);
//               setFieldValue('shift', selected);
//             }}
//           />
//           <FormikInput
//             inputType="multiDropdown"
//             name="weekOff"
//             data={days}
//             InputName="Select Week Off"
//             Dependency="key"
//             FeildName="value"
//             selectedData={weekOffDays}
//             setSelectedData={setWeekOffDays}
//             type="object"
//           />
//           <Button onClick={handleShiftGroup}>Add</Button>
//         </div>

//         {/* Calendar Grid */}
//         <div className="flex flex-col w-full lg:w-2/3">
//           <div className="flex justify-between items-center gap-4 mb-4">
//             <FaChevronLeft onClick={incrementMonthYear} />
//             <div className="w-32">
//               <FormikInput
//                 name="month"
//                 showSerch={false}
//                 listData={months}
//                 feildName="value"
//                 selectedOption={values?.month}
//                 selectedOptionDependency="id"
//                 inputType="dropdown"
//                 handleClick={(selected) => setFieldValue('month', selected?.id)}
//               />
//             </div>
//             <div className="w-32">
//               <FormikInput
//                 name="year"
//                 showSerch={false}
//                 listData={years}
//                 feildName="value"
//                 selectedOption={values?.year}
//                 selectedOptionDependency="value"
//                 inputType="dropdown"
//                 handleClick={(selected) => setFieldValue('year', selected?.value)}
//               />
//             </div>
//             <FaChevronRight onClick={decrementMonthYear} />
//           </div>

//           <div className="grid grid-cols-7 gap-2">
//             {rotatedDays.map((day) => (
//               <Typography key={day.key} className="text-center capitalize font-bold">
//                 {day.key}
//               </Typography>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-2 mt-2">
//             {customisedDays.map((day) => {
//               const isInWeek = weeks.some((week) =>
//                 moment(day.date).isBetween(week.start, week.end, null, '[]')
//               );
//               return (
//                 <div
//                   key={day.id}
//                   className={`h-12 flex items-center justify-center rounded ${
//                     isInWeek ? 'bg-blue-100' : 'bg-gray-100'
//                   }`}
//                 >
//                   {day.value}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Weekly;
import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SubCardHeader from '../../../components/header/SubCardHeader';
import { Button, Typography } from '@material-tailwind/react';
import FormikInput from '../../../components/Input/FormikInput';
import { useDispatch, useSelector } from 'react-redux';
import { ShiftGetAction } from '../../../redux/Action/Shift/ShiftAction';
import { days, months, years } from '../../../constants/Constants';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export const WeeklyConfig = () => {
  return {
    initialValues: {
      year: moment().format('YYYY'),
      month: moment().format('MM'),
      shiftId: ''
    },
    validationSchema: {
      shiftId: Yup.string().required('Shift'),
    },
  };
};

const Weekly = ({ isEditAvailable = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { shiftList = [] } = useSelector((state) => state?.shift || {});
  const [date, setDate] = React.useState(new Date());
  const [shiftListArray, setShiftListArray] = useState([]);
  const [weekOffDays, setWeekOffDays] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [rotatedDays, setRotatedDays] = useState([]);
  const [customisedDays, setCustomisedDays] = useState([]);

  useEffect(() => {
    dispatch(ShiftGetAction());
  }, []);

  useEffect(() => {
    if (values?.startDay) {
      const index = days.findIndex((d) => d.key === values.startDay);
      if (index !== -1) {
        setRotatedDays([...days.slice(index), ...days.slice(0, index)]);
      }
    }
  }, [values?.startDay]);

  useEffect(() => {
    if (values?.startDate && values?.endDate && values?.startDay) {
      const generatedWeeks = generateWeeksSequential(values.startDate, values.endDate);
      setWeeks(generatedWeeks);
    }
  }, [values?.startDate, values?.endDate, values?.startDay]);

  useEffect(() => {
    const day = getDaysInMonth(values?.year, values?.month);
    setCustomisedDays(day);
  }, [values?.month, values?.year]);

  const generateWeeksSequential = (startDate, endDate) => {
    const startDayIndex = moment().day(values?.startDay).day();
    let current = moment(startDate).day(startDayIndex);

    if (moment(startDate).isAfter(current)) {
      current.add(6, 'days');
    }

    const end = moment(endDate).endOf('day');
    const result = [];
    let weekCounter = 1;

    while (current.isBefore(end)) {
      result.push({
        week: weekCounter,
        label: `Week ${weekCounter}`,
        value: weekCounter,
        start: current.clone().format('YYYY-MM-DD'),
        end: current.clone().add(6, 'days').format('YYYY-MM-DD'),
      });
      current.add(7, 'days');
      weekCounter++;
    }

    return result;
  };

  const handleShiftGroup = () => {
    try {
      const filteredShifts = shiftListArray.filter((item) => item.value !== values?.weekId);
      const newShift = {
        ...values?.week,
        ...values?.shift,
        weekOffDays,
      };
      setShiftListArray([...filteredShifts, newShift]);
    } catch (error) {
      console.error('Error in handleShiftGroup:', error);
    }
  };

  const getDaysInMonth = (year, month) => {
    const momentObj = moment({ year: year, month: month - 1, day: 1 });
    const daysInMonth = momentObj.daysInMonth();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        value: moment({ year: year, month: month - 1, day: i }).format('DD'),
        day: moment({ year: year, month: month - 1, day: i }).format('ddd'),
        date: moment({ year: year, month: month - 1, day: i }).format('YYYY-MM-DD'),
        id: i
      });
    }
    return daysArray;
  };

  const incremntMonthYear = () => {
    if (values?.month == 1 && values?.year > "2024") {
      setFieldValue('year', values?.year - 1);
      setFieldValue('month', 12);
    } else {
      setFieldValue('month', values?.month - 1);
    }
  };

  const decremntMonthYear = () => {
    if (values?.month == 12) {
      setFieldValue('year', values?.year + 1);
      setFieldValue('month', 1);
    } else {
      setFieldValue('month', values?.month + 1);
    }
  };

  return (
    <div className="w-full p-4">
      <SubCardHeader headerLabel="Weekly" />
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="flex flex-col gap-4 w-full max-w-xs ">
          <FormikInput
            name="weekId"
            size="sm"
            label="Select Week"
            inputType={isEditAvailable ? 'edit' : 'dropdown'}
            listData={weeks}
            feildName="label"
            showSerch
            selectedOption={values?.weekId}
            selectedOptionDependency="value"
            handleClick={(selected) => {
              setFieldValue('weekId', selected?.value);
              setFieldValue('week', selected);
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
            setSelectedData={setWeekOffDays}
          />
          <Button onClick={handleShiftGroup}>Add</Button>
        </div>

        <div className="flex-1">
          <div className='flex flex-col w-full max-w-2xl'>
            <div className='flex justify-between items-center gap-4'>
              <FaChevronLeft onClick={incremntMonthYear} />
              <div className='w-32'>
                <FormikInput name="month" showSerch={false} listData={months} feildName="value" handleClick={(selected) => { setFieldValue('month', selected?.id) }} selectedOption={values?.month} selectedOptionDependency={"id"} inputType={"dropdown"} />
              </div>
              <div className='w-32'>
                <FormikInput showSerch={false} selectedOptionDependency={"value"} handleClick={(selected) => { setFieldValue('year', selected?.value) }} selectedOption={values?.year} name="year" listData={years} feildName="value" inputType={"dropdown"} />
              </div>
              <FaChevronRight onClick={decremntMonthYear} />
            </div>

            <div className='flex justify-between items-center gap-4 mt-4'>
              {rotatedDays.map((day) => (
                <Typography key={day.key} className='capitalize'>{day?.key}</Typography>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {customisedDays.map((dayObj) => {
                const dayDate = moment(dayObj.date);
                const week = weeks.find(w =>
                  dayDate.isBetween(moment(w.start).subtract(1, 'days'), moment(w.end).add(1, 'days'), undefined, '[]')
                );
                const shiftData = shiftListArray.find(s => s.value === week?.value);
                const isWeekOff = shiftData?.weekOffDays?.includes(dayObj.day);

                const bgColor = isWeekOff ? '#FECACA' : shiftData?.bgColor || '#E5E7EB';
                const textColor = isWeekOff ? '#991B1B' : shiftData?.textColor || '#000000';

                return (
                  <div
                    key={dayObj.date}
                    className="w-10 h-10 flex items-center justify-center rounded text-sm font-medium"
                    style={{ backgroundColor: bgColor, color: textColor }}
                    title={shiftData?.name || ''}
                  >
                    {dayObj.value}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
