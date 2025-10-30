import { useFormikContext } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { Button, Typography } from "@material-tailwind/react";
import FormikInput from "../../../components/Input/FormikInput";
import { useDispatch, useSelector } from "react-redux";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
// import { days, months, years } from '../../../constants/Constants';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import * as Yup from "yup";
import { days, years } from "../../../constants/Constants";

export const WeeklyConfig = () => {
  return {
    initialValues: {
      year: moment().format("YYYY"),
      month: moment().format("MM"),
      shiftId: "",
      startDay: "monday",
      startDate: moment().startOf("month").format("YYYY-MM-DD"),
      endDate: moment().endOf("month").format("YYYY-MM-DD"),
      weekId: "",
      week: null,
      shift: null,
    },
    validationSchema: Yup.object().shape({
      shiftId: Yup.string().required("Shift is required"),
    }),
  };
};

const Weekly = ({ isEditAvailable = false }) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { shiftList = [] } = useSelector((state) => state?.shift || {});
  const [shiftListArray, setShiftListArray] = useState([]);
  const [weekOffDays, setWeekOffDays] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [rotatedDays, setRotatedDays] = useState([]);
  const [customisedDays, setCustomisedDays] = useState([]);
  const [months, setMonths] = useState([]);
  useEffect(() => {
    dispatch(ShiftGetAction());
  }, []);

  function getMonthObjects(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    start.setDate(1); // Ensure we're at the start of the month
    let id = 0;
    while (start <= end) {
      months.push({
        id: id,
        key: start.toLocaleString("default", { month: "long" }),
        value: start.getMonth() + 1, // 1-12
        // year: start.getFullYear(),
        // label: start.toLocaleString('default', { month: 'long'})
      });
      id = id = 1;
      start.setMonth(start.getMonth() + 1);
    }

    return months;
  }

  // Example:
  console.log(getMonthObjects("2024-01-15", "2024-06-10"));

  useEffect(() => {
    const generateMonths = getMonthObjects(values?.startDate, values?.endDate);
    console.log(generateMonths, "months and year");
    setMonths(generateMonths);
  }, [values?.startDate, values?.endDate]);

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
      const generatedWeeks = generateWeeksSequential(
        values.startDate,
        values.endDate
      );
      setWeeks(generatedWeeks);
    }
  }, [values?.startDate, values?.endDate, values?.startDay]);

  useEffect(() => {
    const day = getDaysInMonth(values?.year, values?.month);
    setCustomisedDays(day);
  }, [values?.month, values?.year]);

  const generateWeeksSequential = (startDate, endDate) => {
    const startDayIndex = days.findIndex((d) => d.key === values?.startDay);
    if (startDayIndex === -1) return [];

    let current = moment(startDate).startOf("week").add(startDayIndex, "days");
    if (current.isBefore(moment(startDate))) current.add(7, "days");

    const end = moment(endDate).endOf("day");
    const result = [];
    let weekCounter = 1;

    while (current.isBefore(end)) {
      result.push({
        week: weekCounter,
        label: `Week ${weekCounter}`,
        value: weekCounter,
        start: current.clone().format("YYYY-MM-DD"),
        end: current.clone().add(6, "days").format("YYYY-MM-DD"),
      });
      current.add(7, "days");
      weekCounter++;
    }

    return result;
  };

  const getDaysInMonth = (year, month) => {
    const momentObj = moment({ year: year, month: month - 1, day: 1 });
    const daysInMonth = momentObj.daysInMonth();
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = moment({ year: year, month: month - 1, day: i });
      daysArray.push({
        value: date.format("DD"),
        day: date.format("ddd").toLowerCase(),
        date: date.format("YYYY-MM-DD"),
        id: i,
      });
    }
    return daysArray;
  };

  const handleShiftGroup = () => {
    try {
      const filteredShifts = shiftListArray.filter(
        (item) => item.value !== values?.weekId
      );
      const newShift = {
        ...values?.week,
        ...values?.shift,
        weekOffDays,
      };
      setShiftListArray([...filteredShifts, newShift]);
    } catch (error) {
      console.error("Error in handleShiftGroup:", error);
    }
  };

  const incrementMonthYear = () => {
    let newMonth = Number(values.month) + 1;
    let newYear = Number(values.year);

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }

    setFieldValue("month", newMonth);
    setFieldValue("year", newYear);
  };

  const decrementMonthYear = () => {
    let newMonth = Number(values.month) - 1;
    let newYear = Number(values.year);

    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setFieldValue("month", newMonth);
    setFieldValue("year", newYear);
  };

  return (
    <div className="w-full p-4">
      <SubCardHeader headerLabel="Weekly" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <FormikInput
            name="weekId"
            size="sm"
            label="Select Week"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={weeks}
            feildName="label"
            showSerch
            selectedOption={values?.weekId}
            selectedOptionDependency="value"
            handleClick={(selected) => {
              setFieldValue("weekId", selected?.value);
              setFieldValue("week", selected);
            }}
          />
          <FormikInput
            name="shiftId"
            size="sm"
            label="Select Shift"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={shiftList}
            feildName="name"
            showSerch
            selectedOption={values?.shiftId}
            selectedOptionDependency="_id"
            handleClick={(selected) => {
              setFieldValue("shiftId", selected?._id);
              setFieldValue("shift", selected);
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
          <div className="flex flex-col w-full max-w-2xl">
            <div className="flex justify-between items-center gap-4">
              <FaChevronLeft onClick={decrementMonthYear} />
              <div className="w-32">
                <FormikInput
                  name="month"
                  showSerch={false}
                  listData={months}
                  feildName="value"
                  handleClick={(selected) =>
                    setFieldValue("month", selected?.id)
                  }
                  selectedOption={values?.month}
                  selectedOptionDependency="id"
                  inputType="dropdown"
                />
              </div>
              <div className="w-32">
                <FormikInput
                  name="year"
                  showSerch={false}
                  listData={years}
                  feildName="value"
                  handleClick={(selected) =>
                    setFieldValue("year", selected?.value)
                  }
                  selectedOption={values?.year}
                  selectedOptionDependency="value"
                  inputType="dropdown"
                />
              </div>
              <FaChevronRight onClick={incrementMonthYear} />
            </div>

            <div className="flex justify-between items-center gap-4 mt-4">
              {rotatedDays.map((day) => (
                <Typography key={day.key} className="capitalize">
                  {day?.key}
                </Typography>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {customisedDays.map((dayObj) => {
                const dayDate = moment(dayObj.date);
                const week = weeks.find((w) =>
                  dayDate.isBetween(
                    moment(w.start).subtract(1, "days"),
                    moment(w.end).add(1, "days"),
                    undefined,
                    "[]"
                  )
                );
                const shiftData = shiftListArray.find(
                  (s) => s.value === week?.value
                );
                const isWeekOff = shiftData?.weekOffDays?.includes(
                  dayObj.day.toLowerCase()
                );

                const bgColor = isWeekOff
                  ? "#FECACA"
                  : shiftData?.bgColor || "#E5E7EB";
                const textColor = isWeekOff
                  ? "#991B1B"
                  : shiftData?.textColor || "#000000";

                return (
                  <div
                    key={dayObj.date}
                    className="w-10 h-10 flex items-center justify-center rounded text-sm font-medium"
                    style={{ backgroundColor: bgColor, color: textColor }}
                    title={shiftData?.name || ""}
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
