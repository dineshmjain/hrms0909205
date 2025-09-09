// import React, { useState } from "react";
// import {
//   Avatar,
//   Typography,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Button,
// } from "@material-tailwind/react";

// const shiftMap = {
//   A: {
//     label: "Shift A",
//     start: "08:00 AM",
//     end: "02:00 PM",
//     color: "bg-blue-100 text-blue-800",
//   },
//   B: {
//     label: "Shift B",
//     start: "02:00 PM",
//     end: "08:00 PM",
//     color: "bg-green-100 text-green-800",
//   },
//   C: {
//     label: "Shift C",
//     start: "08:00 PM",
//     end: "05:00 AM",
//     crossesMidnight: true,
//     color: "bg-purple-100 text-purple-800",
//   },
//   Off: {
//     label: "Weekly Off",
//     start: "",
//     end: "",
//     color: "bg-gray-100 text-gray-600",
//   },
// };

// const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const clientList = ["ABC Corp", "XYZ Ltd", "NovaTech"];

// const initialEmployees = [
//   {
//     id: 1,
//     name: "Md. Fahim Chowdhury",
//     title: "Software Engineer I",
//     avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Fahim",
//     shifts: {
//       Sun: [{ shift: "A", client: "ABC Corp" }],
//       Mon: [
//         { shift: "A", client: "ABC Corp" },
//         { shift: "B", client: "XYZ Ltd" },
//       ],
//       Tue: [{ shift: "Off", client: "" }],
//     },
//   },
//   {
//     id: 2,
//     name: "Sadia Akter",
//     title: "Software Engineer I",
//     avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sadia",
//     shifts: {
//       Sun: [{ shift: "C", client: "XYZ Ltd" }],
//       Mon: [{ shift: "C", client: "ABC Corp" }],
//       Tue: [{ shift: "A", client: "NovaTech" }],
//     },
//   },
// ];

// export default function DustyRoaster() {
//   const [employees, setEmployees] = useState(initialEmployees);
//   const [open, setOpen] = useState(false);
//   const [selected, setSelected] = useState({ empId: null, day: null });
//   const [newShifts, setNewShifts] = useState([]);

//   const handleCellClick = (empId, day, currentShifts) => {
//     setSelected({ empId, day });
//     setNewShifts(currentShifts || []);
//     setOpen(true);
//   };

//   const addNewShiftEntry = () => {
//     setNewShifts([...newShifts, { shift: "A", client: clientList[0] }]);
//   };

//   const updateShiftEntry = (index, key, value) => {
//     const updated = [...newShifts];
//     updated[index][key] = value;
//     setNewShifts(updated);
//   };

//   const removeShiftEntry = (index) => {
//     setNewShifts(newShifts.filter((_, i) => i !== index));
//   };

//   const handleSave = () => {
//     const updated = employees.map((emp) =>
//       emp.id === selected.empId
//         ? {
//             ...emp,
//             shifts: {
//               ...emp.shifts,
//               [selected.day]: [...newShifts],
//             },
//           }
//         : emp
//     );
//     setEmployees(updated);
//     setOpen(false);
//   };

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg w-full min-h-screen">
//       <Typography variant="h5" className="mb-4">Duty Roster</Typography>

//       <div className="grid grid-cols-[200px_repeat(7,1fr)] border-t border-l text-sm font-medium text-gray-700">
//         <div className="bg-gray-100 p-3 border-b border-r">Employee List</div>
//         {days.map((day) => (
//           <div key={day} className="bg-gray-100 p-3 border-b border-r text-center">
//             {day}
//           </div>
//         ))}

//         {employees.map((emp) => (
//           <React.Fragment key={emp.id}>
//             <div className="flex items-start gap-3 p-2 border-b border-r">
//               <Avatar src={emp.avatar} size="sm" />
//               <div>
//                 <Typography variant="small" className="font-semibold">
//                   {emp.name}
//                 </Typography>
//                 <Typography variant="small" className="text-gray-500">
//                   {emp.title}
//                 </Typography>
//               </div>
//             </div>

//             {days.map((day) => {
//               const shiftsForDay = emp.shifts[day] || [];
//               return (
//                 <div
//                   key={day}
//                   onClick={() => handleCellClick(emp.id, day, shiftsForDay)}
//                   className="border-b border-r p-2 cursor-pointer hover:ring-2 ring-blue-300 min-h-[72px]"
//                 >
//                   {shiftsForDay.length > 0 ? (
//                     shiftsForDay.map((item, i) => {
//                       const shift = shiftMap[item.shift];
//                       return (
//                         <div
//                           key={i}
//                           className={`px-2 py-1 mb-1 rounded text-xs text-center ${shift.color}`}
//                         >
//                           <div className="font-medium">{shift.label}</div>
//                           {shift.start && (
//                             <div className="text-[10px] flex items-center justify-center gap-1">
//                               {shift.start} - {shift.end}
//                               {shift.crossesMidnight && (
//                                 <span
//                                   title="This shift ends the next day"
//                                   className="ml-1 px-1 rounded bg-yellow-100 text-yellow-700 text-[9px] font-medium"
//                                 >
//                                   +1 Day
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                           <div className="text-[10px]">{item.client}</div>
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <div className="text-gray-400 text-xs">No Shift</div>
//                   )}
//                 </div>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </div>

//       <Dialog open={open} handler={() => setOpen(false)} size="lg">
//         <DialogHeader>Edit Shifts & Clients</DialogHeader>
//         <DialogBody>
//           {newShifts.map((entry, index) => (
//             <div key={index} className="flex gap-3 items-center mb-2">
//               <select
//                 value={entry.shift}
//                 onChange={(e) => updateShiftEntry(index, "shift", e.target.value)}
//                 className="border rounded px-2 py-1 text-sm"
//               >
//                 {Object.keys(shiftMap).map((s) => (
//                   <option key={s} value={s}>
//                     {shiftMap[s].label}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={entry.client}
//                 onChange={(e) => updateShiftEntry(index, "client", e.target.value)}
//                 className="border rounded px-2 py-1 text-sm"
//               >
//                 {clientList.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 className="text-red-500 text-sm"
//                 onClick={() => removeShiftEntry(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <Button variant="outlined" size="sm" onClick={addNewShiftEntry}>
//             + Add Shift
//           </Button>
//         </DialogBody>
//         <DialogFooter>
//           <Button variant="text" onClick={() => setOpen(false)} className="mr-2">
//             Cancel
//           </Button>
//           <Button color="blue" onClick={handleSave}>
//             Save
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import {
//     Typography,
//     Dialog,
//     DialogHeader,
//     DialogBody,
//     DialogFooter,
//     Button,
//     Input,
//     Checkbox,
// } from "@material-tailwind/react";
// import { useDispatch, useSelector } from "react-redux";
// import { EmployeeGetAction } from "../../redux/Action/Employee/EmployeeAction";
// import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
// import toast, { Toaster } from "react-hot-toast";
// import { FaCaretLeft, FaTrash, FaUsers } from "react-icons/fa6";
// import { FaInfo } from "react-icons/fa";
// import { RiPoliceBadgeLine } from "react-icons/ri";
// import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
// import { clientListAction } from "../../redux/Action/Client/ClientAction";
// import dayjs from "dayjs";
// import moment from "moment";
// import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

// const getDateRange = (fromDate, toDate) => {
//     const start = dayjs(fromDate).startOf("day");
//     const end = dayjs(toDate).endOf("day");
//     const days = end.diff(start, "day") + 1;
//     return Array.from({ length: days }, (_, i) => start.add(i, "day"));
// };

// export default function DutyRoaster() {
//     const dispatch = useDispatch();
//     const { employeeList = [] } = useSelector((state) => state.employee || {});
//     const { shiftList = [] } = useSelector((state) => state.shift || {});
//     const { clientList } = useSelector((state) => state.client);

//     const [employees, setEmployees] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [newShifts, setNewShifts] = useState([]);
//     const [clientId, setClientId] = useState();
//     const [fromDate, setFromDate] = useState(new Date());
//     const [toDate, setToDate] = useState(moment().add(6, "day"));
//     const [selectedCells, setSelectedCells] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);
//     const [openInfo, setOpenInfo] = useState(false);

//     useEffect(() => {
//         dispatch(EmployeeGetAction());
//         dispatch(ShiftGetAction());
//         dispatch(clientListAction({}));
//     }, [dispatch]);

//     useEffect(() => {
//         setEmployees(employeeList);
//     }, [employeeList]);

//     useEffect(() => {
//         const closePopover = (e) => {
//             if (!e.target.closest(".popover-info")) {
//                 setOpenInfo(false);
//             }
//         };
//         document.addEventListener("mousedown", closePopover);
//         return () => document.removeEventListener("mousedown", closePopover);
//     }, []);

//     const sortedShifts = [
//         ...shiftList,
//         { _id: 0, name: "Week Off", bgColor: "#f3f4f6", textColor: "#000000" },
//     ].sort((a, b) => a?.startTime?.localeCompare(b?.startTime));

//     const shiftMap = Object.fromEntries(sortedShifts.map((s) => [s._id, s]));
//     const visibleDays = getDateRange(fromDate, toDate);

//     const handleSave = () => {
//         const seen = new Set();
//         for (const entry of newShifts) {
//             if (seen.has(entry.shift)) {
//                 toast.error("Duplicate shift assignment not allowed.");
//                 return;
//             }
//             seen.add(entry.shift);
//         }

//         const updated = employees.map((emp) => {
//             const matched = selectedCells.filter((cell) => cell.empId === emp._id);
//             if (!matched.length) return emp;
//             const updatedShifts = { ...emp.shifts };
//             matched.forEach((cell) => {
//                 updatedShifts[cell.day] = [...newShifts];
//             });
//             return { ...emp, shifts: updatedShifts };
//         });

//         setEmployees(updated);
//         setOpen(false);
//         setSelectedCells([]);
//     };
//  const [weekOffset, setWeekOffset] = useState(0);

//   const getWeekRange = (offset) => {
//     const base = moment().add(offset, 'weeks').startOf('week').add(1, 'days'); // startOf('week') is Sunday, add(1) makes it Monday
//     const start = base.clone();
//     const end = base.clone().add(6, 'days');
// setFromDate(start?.format("YYYY-MM-DD"))
// setToDate(end?.format("YYYY-MM-DD"))
//     return `${start.format('MMM D yyyy')} – ${end.format('MMM D yyyy')}`;
//   };

//   const handlePrevWeek = () => setWeekOffset(weekOffset - 1);
//   const handleNextWeek = () => setWeekOffset(weekOffset + 1);

//   const weekRange = getWeekRange(weekOffset);
// // const [visibleDays,setVisibleDays]=useState([])
// //   useEffect(()=>{
// // console.log(weekRange,'==========================week')
// //   },[weekRange])

//     return (
//         <div>

//                <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
//                 <div>
//                     <Typography variant="h5">Duty Roster</Typography>
//                     <Typography variant="small" color="gray">
//                         Manage your employee shifts
//                     </Typography>
//                 </div>
//                 {/* <div className="flex items-center gap-4">
//                     <Input
//                         type="date"
//                         label="From"
//                              variant='outlined'
//                           className="bg-white"
//                         value={dayjs(fromDate).format("YYYY-MM-DD")}
//                         onChange={(e) => setFromDate(new Date(e.target.value))}
//                     />
//                     <Input
//                         type="date"
//                         label="To"
//                         variant='outlined'
//                         className="bg-white"
//                         value={dayjs(toDate).format("YYYY-MM-DD")}
//                         onChange={(e) => setToDate(new Date(e.target.value))}
//                         min={dayjs(fromDate).format("YYYY-MM-DD")}
//                     />
//                 </div> */}
//             </div>
//         <div className="p-6  bg-white shadow-lg rounded-xl">
//             <Toaster />
//                 <div className="flex gap-6 relative justify-center ">
//                     <div className="flex items-center gap-2">
//                         <button onClick={handlePrevWeek}>
//                             <PiCaretLeft className="h-5 w-5" />
//                         </button>
//                         <Typography>{weekRange}</Typography>
//                         <button onClick={handleNextWeek}>
//                             <PiCaretRight className="h-5 w-5" />
//                         </button>
//                     </div>
//                 </div>

//             <div className="flex gap-6 relative mb-6">
//                 <div className="w-64">
//                     <SingleSelectDropdown
//                         listData={clientList}
//                         feildName="name"
//                         inputName="Select Client"
//                         selectedOptionDependency="_id"
//                         selectedOption={clientId}
//                         handleClick={(selected) => setClientId(selected?._id)}
//                         hideLabel
//                         showTip
//                         showSerch
//                     />
//                 </div>

//                 <div className="relative bg-gray-100  rounded-lg flex items-center gap-4 shadow-md">
//   {/* Icon */}
//   <div className="bg-red-200 p-1 rounded-full">
//     <FaUsers className="text-red-500" />
//   </div>

//   {/* Text */}
//   <div>
//     <Typography variant="h6">10 / 25</Typography>
//     <Typography variant="small" color="gray">Total Employees</Typography>
//   </div>

//   {/* Info icon in the top-right corner */}
//   <div className="absolute top-2 right-2">
//     <div
//       className="cursor-pointer bg-blue-200 rounded-full p-1"
//       onMouseOver={() => setOpenInfo(true)}
//       onMouseLeave={() => setOpenInfo(false)}
//     >
//       <FaInfo className="text-blue-500 w-2 h-2" />
//     </div>

//     {/* Info Popover */}
//     {openInfo && (
//       <div className="absolute top-6 right-0 z-50 w-96 bg-white border rounded-lg shadow-xl p-4 popover-info">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {['Supervisor', 'Guards'].map((role) => (
//             <div key={role} className="flex items-center gap-4 border rounded-lg p-4">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <RiPoliceBadgeLine className="text-red-500" />
//               </div>
//               <div>
//                 <Typography variant="small" color="gray" className="mb-1">
//                   {role}
//                 </Typography>
//                 <div className="flex gap-4">
//                   <div>
//                     <Typography className="text-sm">10</Typography>
//                     <Typography className="text-xs" color="gray">Male</Typography>
//                   </div>
//                   <div>
//                     <Typography className="text-sm">10</Typography>
//                     <Typography className="text-xs" color="gray">Female</Typography>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// </div>

//             </div>

//             <Dialog open={open} handler={() => setOpen(false)}>
//                 <DialogHeader>Add/Edit Shifts</DialogHeader>
//                 <DialogBody>
//                     <div className="grid grid-cols-2 gap-4">
//                         {sortedShifts.map((shift) => {
//                             const isSelected = newShifts.some((s) => s.shift === shift._id);
//                             return (
//                                 <div
//                                     key={shift._id}
//                                     className="flex items-center gap-2 p-2 rounded-md"
//                                     style={{ backgroundColor: shift.bgColor, color: shift.textColor }}
//                                 >
//                                     <Checkbox
//                                         label={shift.name}
//                                         checked={isSelected}
//                                         onChange={() => {
//                                             if (shift._id === 0) {
//                                                 setNewShifts([{ shift: 0, client: null }]);
//                                             } else {
//                                                 setNewShifts((prev) => {
//                                                     const idx = prev.findIndex((s) => s.shift === shift._id);
//                                                     if (idx >= 0) return prev.filter((_, i) => i !== idx);
//                                                     return [...prev.filter((s) => s.shift !== 0), { shift: shift._id, client: clientList[0] }];
//                                                 });
//                                             }
//                                         }}
//                                     />
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
//                     <Button onClick={handleSave} color="blue">Save</Button>
//                 </DialogFooter>
//             </Dialog>

//             <div className="overflow-x-auto">
//                 <div className="grid min-w-max" style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}>
//                     <div className="bg-gray-200 p-3 font-semibold">Employee List</div>
//                     {visibleDays.map((day) => (
//                         <div key={day.format("YYYY-MM-DD")} className="bg-gray-200 p-3 text-center text-sm">
//                             <div>{day.format("ddd")}</div>
//                             <div className="text-gray-500">{day.format("DD/MM")}</div>
//                         </div>
//                     ))}
//                     {employees.map((emp) => (
//                         <React.Fragment key={emp._id}>
//                             <div className="p-3 border-t border-r">
//                                 <Typography variant="small" className="font-bold">{emp.name?.firstName || emp.name}</Typography>
//                                 <Typography variant="small" color="gray">{emp.title}</Typography>
//                             </div>
//                             {visibleDays.map((day) => {
//                                 const dayKey = day.format("YYYY-MM-DD");
//                                 const shifts = emp?.shifts?.[dayKey] || [];
//                                 const isSelected = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);
//                                 return (
//                                     <div
//                                         key={dayKey}
//                                         className={`p-2 border-t border-r cursor-pointer min-h-[72px] ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:ring-2 ring-blue-300'}`}
//                                         onMouseDown={() => {
//                                             setIsDragging(true);
//                                             setSelectedCells([{ empId: emp._id, day: dayKey }]);
//                                         }}
//                                         onMouseEnter={() => {
//                                             if (isDragging) {
//                                                 setSelectedCells((prev) => {
//                                                     const exists = prev.some((c) => c.empId === emp._id && c.day === dayKey);
//                                                     return exists ? prev : [...prev, { empId: emp._id, day: dayKey }];
//                                                 });
//                                             }
//                                         }}
//                                         onMouseUp={() => {
//                                             setIsDragging(false);
//                                             setOpen(true);
//                                             setNewShifts([]);
//                                         }}
//                                     >
//                                         {shifts.length > 0 ? (
//                                             shifts.map((shift, i) => (
//                                                 <div
//                                                     key={i}
//                                                     className="text-xs p-1 mb-1 rounded text-center"
//                                                     style={{ backgroundColor: shiftMap[shift.shift]?.bgColor, color: shiftMap[shift.shift]?.textColor }}
//                                                 >
//                                                     <div className="font-semibold">{shiftMap[shift.shift]?.name}</div>
//                                                     <div className="text-[10px]">{shiftMap[shift.shift]?.startTime} - {shiftMap[shift.shift]?.endTime}</div>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <div className="text-gray-400 text-xs">No Shift</div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </React.Fragment>
//                     ))}
//                 </div>
//             </div>
//         </div>
//         </div>
//     );
// }


//  <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="lg">
//                 <DialogHeader>Manage Shifts</DialogHeader>
//                 <DialogBody>
//                     <Toaster />
//                     {newShifts.map((ent, i) => (
//                         <div key={i} className="flex flex-col md:flex-row gap-4 items-start mb-4">
//                             <SingleSelectDropdown
//                                 listData={sortedShifts}
//                                 feildName="name"
//                                 inputName="Select Shift"
//                                 selectedOptionDependency="_id"
//                                 selectedOption={ent.shift}
//                                 handleClick={sel => handleShiftChange(i, sel)}
//                                 hideLabel
//                                 showSerch
//                             />
//                             {ent.shift !== 0 && (
//                                 <>
//                                     <SingleSelectDropdown
//                                         listData={clientList}
//                                         feildName="name"
//                                         inputName="Select Client"
//                                         selectedOptionDependency="clientId"
//                                         selectedOption={ent.client.clientId}
//                                         handleClick={sel => handleClientChange(i, sel)}
//                                         hideLabel
//                                         showSerch
//                                     />
//                                     <MultiSelectDropdown
//                                         data={clientBranchList}
//                                         FeildName="name"
//                                         Dependency="_id"
//                                         InputName="Select Branch"
//                                         selectedData={ent.branches}
//                                         setSelectedData={bs => {
//                                             const upd = [...newShifts];
//                                             upd[i].branches = bs;
//                                             setNewShifts(upd);
//                                         }}
//                                         hideLabel
//                                         showTip
//                                     />
//                                 </>
//                             )}
//                             {newShifts.length > 1 && (
//                                 <IconButton variant="text" color="red" onClick={() => handleRemoveShiftRow(i)}>
//                                     <FaTrash className="h-5 w-5" />
//                                 </IconButton>
//                             )}
//                         </div>
//                     ))}
//                     <Button onClick={handleAddShiftRow} variant="outlined" color="blue" className="flex items-center gap-2">
//                         <FaPlus /> Add Shift
//                     </Button>
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" onClick={() => setOpenDialog(false)}>Cancel</Button>
//                     <Button color="blue" onClick={handleSave}>Save</Button>
//                 </DialogFooter>
//             </Dialog>






// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { Button,Dialog, DialogBody, DialogFooter,DialogHeader,IconButton,Typography} from '@material-tailwind/react';
// import { FaPlus, FaTrash } from 'react-icons/fa';
// import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
// import moment from 'moment';
// import toast, { Toaster } from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import DatePicker from 'react-datepicker';
// import Filter from '../../components/Filter/Filter';
// import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
// import MultiSelectDropdown from '../../components/MultiSelectDropdown/MultiSelectDropdown';
// import { clientListAction, clientDepartmentAction,clientDesignationAction} from '../../redux/Action/Client/ClientAction';
// import { clientBranchListAction } from '../../redux/Action/ClientBranch/ClientBranchAction';
// import { EmployeeClientListAction, EmployeeGetAction } from '../../redux/Action/Employee/EmployeeAction';
// import { ShiftGetAction } from '../../redux/Action/Shift/ShiftAction';

// const DustyRoaster = () => {
//     const dispatch = useDispatch();
//     const gridRef = useRef(null);
//     // UI State
//     const [showFilters, setShowFilters] = useState(window.innerWidth > 640);
//     const [selectedFilterType, setFilterType] = useState('myOrg');
//     const [weekOffset, setWeekOffset] = useState(0);
//     const [showPicker, setShowPicker] = useState(false);
//     //filteres for Shift Dailog 
//     const [shiftFor, setShiftFor] = useState("myOrg")
//     const [shiftForList, setShiftForList] = useState([{ id: "myOrg", name: "My Organization" }, { id: "clientOrg", name: "Client Organization" }])
//     const { shiftList = [] } = useSelector(state => state.shift || {});
//     // Selection / Dialog State
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedCells, setSelectedCells] = useState([]);
//     const [selectionRect, setSelectionRect] = useState(null);
//     // Dropdown States
//     const [clientId, setClientId] = useState({ clientId: '', clientMappedId: '' });
//     const [clientBranchId, setClientBranchId] = useState();
//     const [newShifts, setNewShifts] = useState([{ shift: '', client: {}, branches: [] }]);
//     const [clientSelectedDeps, setClientSelectedDeps] = useState([]);
//     const [clientSelectedDesigs, setClientSelectedDesigs] = useState([]);
//     const [selectedEmployees, setSelectedEmployees] = useState([])
//     const [employees, setEmployees] = useState([])
//     // Redux Data
//     const { clientList = [] } = useSelector(state => state.client || {});
//     const { clientDepartments } = useSelector((state) => state?.client)
//     const { clientDesignations } = useSelector((state) => state?.client)
//     const { clientBranchList = [] } = useSelector(state => state.clientBranch || {});
//     const { employeeList = [] } = useSelector(state => state.employee || {});

//     // Dates
//     const fromDate = moment().startOf('week').add(1 + weekOffset * 7, 'days');
//     const toDate = moment().startOf('week').add(7 + weekOffset * 7, 'days');

//     const visibleDays = useMemo(() => {
//         const days = toDate.diff(fromDate, 'day') + 1;
//         return Array.from({ length: days }, (_, i) => moment(fromDate).add(i, 'days'));
//     }, [fromDate, toDate]);

//     const sortedShifts = useMemo(() => {
//         const dt = shiftList.map((d) => ({  ...d, name: `${d.name} (${d.startTime} - ${d.endTime})`,}));
//  dt.push({ _id: 0, name: 'Week Off', bgColor: '#f3f4f6', textColor: '#000' });
//         return dt.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
//     }, [shiftList]);

//     const shiftMap = useMemo(() => Object.fromEntries(sortedShifts.map(s => [s._id, s])), [sortedShifts]);

//     // Fetch Clients on Load if Filter is Client Org
//     useEffect(() => {
//         if (selectedFilterType === 'clientOrg') {
//             dispatch(clientListAction({})).then(r => {
//                 const first = r.payload.data?.[0];
//                 if (first) setClientId({ clientId: first.clientId, clientMappedId: first?._id });
//             });
//         }
//     }, [dispatch, selectedFilterType]);

//     useEffect(() => {
//         if (clientId) {
//             dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }))
//                 .then(r => {
//                     const first = r.payload.data?.[0];
//                     if (first) setClientBranchId(first._id);
//                 });
//         }
//     }, [dispatch, clientId]);

//     useEffect(() => {
//         if (clientBranchId) {
//             dispatch(clientDepartmentAction({ clientId: clientId.clientId, clientBranch: [clientBranchId] })).then(({ payload }) => {
//                 const temp = payload.data.map((r) => r?._id)
//                 console.log(temp, 'temp d')
//                 setClientSelectedDeps(temp)
//             });
//         }
//     }, [dispatch, clientBranchId]);
//     useEffect(() => {
//         if (clientId && clientSelectedDeps) {
//             dispatch(clientDesignationAction({ clientId: clientId?.clientId, clientBranch: [clientBranchId] })).then(({ payload }) => {
//                 const temp = payload.data.map((r) => r?._id)
//                 console.log(temp, 'temp d')
//                 setClientSelectedDesigs(temp)
//             });
//         }
//     }, [dispatch, clientId, clientSelectedDeps]);
//     useEffect(() => {
//         dispatch(EmployeeClientListAction({
//             clientId: clientId?.clientId,  clientBranch: [clientBranchId],  department: clientSelectedDeps,  designation: clientSelectedDesigs,  category: 'assigned'
//         }));
//     }, [clientId, clientBranchId, clientSelectedDeps, clientSelectedDesigs])

//     // Grid Selection Handlers
//     const isIntersecting = (r1, r2) =>
//         r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;

//     const onPointerDown = e => {
//         if (e.button !== 0 || !gridRef.current) return;
//         const rect = gridRef.current.getBoundingClientRect();
//         setSelectionRect(new DOMRect(e.clientX - rect.left, e.clientY - rect.top, 0, 0));
//     };

//     const onPointerMove = e => {
//         if (!selectionRect || !gridRef.current) return;
//         const rect = gridRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;
//         setSelectionRect(new DOMRect(
//             Math.min(x, selectionRect.x), Math.min(y, selectionRect.y), Math.abs(x - selectionRect.x), Math.abs(y - selectionRect.y)
//         ));
//     };

//     const onPointerUp = () => {
//         if (!selectionRect || !gridRef.current) return;

//         const selected = [];
//         const rectParent = gridRef.current.getBoundingClientRect();

//         gridRef.current.querySelectorAll('[data-emp-id]').forEach(cell => {
//             const cr = cell.getBoundingClientRect();
//             const rel = new DOMRect(cr.left - rectParent.left, cr.top - rectParent.top, cr.width, cr.height);
//             if (isIntersecting(selectionRect, rel)) {
//                 selected.push({
//                     empId: cell.getAttribute('data-emp-id'),
//                     day: cell.getAttribute('data-day')
//                 });
//             }
//         });

//         setSelectedCells(selected);
//         setSelectionRect(null);
//         setOpenDialog(true);
//         setNewShifts([{ shift: '', client: {}, branches: [] }]);
//     };

//     const handleDateChange = (date) => {
//         if (!date) return;
//         const selectedWeek = moment(date).startOf('isoWeek');
//         const currentWeek = moment().startOf('isoWeek');
//         const diffWeeks = selectedWeek.diff(currentWeek, 'week');
//         setWeekOffset(diffWeeks);
//     };

//     // Dialog Handlers
//     const handleShiftChange = (index, sel) => {
//         const updated = [...newShifts];
//         updated[index].shift = sel._id;
//         setNewShifts(updated);
//     };

//     const handleClientChange = (index, sel) => {
//         const updated = [...newShifts];
//         updated[index].client = sel;
//         updated[index].branches = [];
//         dispatch(clientBranchListAction({ clientMappedId: sel?._id }));
//         dispatch(ShiftGetAction({ orgId: sel?.clientId }));
//         setNewShifts(updated);
//     };


//     const handleAddShiftRow = () => {
//         setNewShifts([
//             ...newShifts,
//             { shift: sortedShifts[0]._id, client: clientList[0] || {}, branches: [] }
//         ]);
//     };

//     const handleRemoveShiftRow = (idx) => {
//         setNewShifts(newShifts.filter((_, i) => i !== idx));
//     };

//     const handleSave = () => {
//         const seen = new Set(newShifts.map(e => e.shift));
//         if (seen.size < newShifts.length) {
//             toast.error('Duplicate shift assignment not allowed.');
//             return;
//         }

//         const updatedEmployees = employeeList.map(emp => {

//             const cells = selectedCells.filter(c => c.empId === emp._id);
//             if (!cells.length) return emp;
//             const updatedShifts = { ...(emp.shifts || {}) };
//             cells.forEach(c => {
//                 updatedShifts[c.day] = [{
//                     ...newShifts, clientBranchId: emp.clientBranchId
//                 }];
//             });
//             return { ...emp, shifts: updatedShifts };
//         });
//         const filteredEmployeesShifts = updatedEmployees.filter((d) => d?.shifts)

//         const dates = selectedCells.map((d) => d.day).sort((a, b) => new Date(a) - new Date(b))
//         const startDate = dates?.[0]
//         const endDate = dates?.[dates?.length - 1]
//         const employeeIds = [...new Set(selectedCells.map((d) => d.empId))]
//         console.log(filteredEmployeesShifts, 'while save')



//         // Dispatch updated shifts here if needed
//         setOpenDialog(false);
//         setSelectedCells([]);
//         setNewShifts([{ shift: '', client: {}, branches: [] }]);
//     };
//     console.log(clientDepartments, clientDesignations, employeeList, 'client d')

//     useEffect(() => {
//         const filteredEmployees = employeeList.filter((data) =>
//             selectedEmployees.includes(data._id)
//         );
//         setEmployees(filteredEmployees)
//     }, [selectedEmployees, employeeList]);
//     return (
//         <div className="relative">
//             {/* Shift Assignment Dialog */}
//             <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="lg">
//                 <DialogHeader>Manage Shifts</DialogHeader>
//                 <DialogBody>
//                     <Toaster />
//                     {newShifts.map((ent, i) => (
//                         <div key={i} className="flex flex-col md:flex-row gap-4 items-start mb-4 flex-wrap">

//                             <SingleSelectDropdown inputName="Select For"
//                                 listData={shiftForList}
//                                 feildName="name"
//                                 selectedOptionDependency="id"
//                                 selectedOption={shiftFor}
//                                 handleClick={(se) => {
//                                     setShiftFor(se?.id)
//                                 }}

//                                 hideLabel />
//                             <SingleSelectDropdown
//                                 listData={clientList} feildName={'name'} inputName={'Select Client'}
//                                 selectedOptionDependency={'clientId'}
//                                 selectedOption={clientId.clientId}
//                                 // handleClick={(sel) => setClientId({ clientId: sel.clientId, clientMappedId: sel?._id })}
//                                 handleClick={(sel) => {
//                                     handleClientChange(i, sel)
//                                 }}
//                                 hideLabel showSerch showTip
//                             />
//                             <SingleSelectDropdown

//                                 listData={clientBranchList} feildName={'name'} inputName={'Select Client'}
//                                 selectedOptionDependency={'_id'}
//                                 selectedOption={clientBranchId}

//                                 handleClick={(sel) => {
//                                     handleClientChange(i, sel)
//                                 }}
//                                 hideLabel showSerch showTip
//                             />
//                             <SingleSelectDropdown
//                                 listData={sortedShifts}
//                                 feildName="name"
//                                 inputName="Select Shift"
//                                 selectedOptionDependency="_id"
//                                 selectedOption={ent.shift}
//                                 handleClick={sel => handleShiftChange(i, sel)}
//                                 hideLabel
//                                 showSerch
//                             />
//                             {newShifts.length > 1 && (
//                                 <IconButton variant="text" color="red" onClick={() => handleRemoveShiftRow(i)}>
//                                     <FaTrash className="h-5 w-5" />
//                                 </IconButton>
//                             )}


//                         </div>
//                     ))}
//                     <Button onClick={handleAddShiftRow} variant="outlined" color="blue" className="flex items-center gap-2">
//                         <FaPlus /> Add Shift
//                     </Button>
//                 </DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" onClick={() => setOpenDialog(false)}>Cancel</Button>
//                     <Button color="blue" onClick={handleSave}>Save</Button>
//                 </DialogFooter>
//             </Dialog>

//             {/* Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <Typography variant="h5">Duty Roster</Typography>
//                 <Typography variant="small" color="gray">Manage your employee shifts</Typography>
//             </div>

//             {/* Filters */}
//             <div className="bg-white p-3 rounded shadow mb-4">
//                 <div className="flex gap-2 mb-3">
//                     {['myOrg', 'clientOrg'].map(type => (
//                         <button
//                             key={type}
//                             className={`px-3 py-1 border rounded ${selectedFilterType === type ? 'bg-blue-500 text-white' : ''}`}
//                             onClick={() => setFilterType(type)}
//                         >
//                             {type === 'myOrg' ? 'My Organization' : 'Client Organization'}
//                         </button>
//                     ))}
//                 </div>
//                 {selectedFilterType === 'clientOrg' ? (
//                     <div className="flex gap-4 flex-wrap">
//                         <SingleSelectDropdown {...{
//                             listData: clientList, feildName: 'name', inputName: 'Select Client',
//                             selectedOptionDependency: 'clientId', selectedOption: clientId.clientId,
//                             handleClick: sel => setClientId({ clientId: sel.clientId, clientMappedId: sel?._id }), hideLabel: true, showTip: true, showSerch: true
//                         }} />
//                         <SingleSelectDropdown {...{
//                             listData: clientBranchList, feildName: 'name', inputName: 'Select Branch',
//                             selectedOptionDependency: '_id', selectedOption: clientBranchId,
//                             handleClick: sel => setClientBranchId(sel._id), hideLabel: true, showTip: true, showSerch: true
//                         }} />
//                         {clientBranchId && (
//                             <>
//                                 <MultiSelectDropdown

//                                     data={clientDepartments}
//                                     selectedData={clientSelectedDeps}
//                                     Dependency={"_id"}
//                                     FeildName='name'
//                                     InputName={"Selecte Department"}
//                                     setSelectedData={setClientSelectedDeps}
//                                     hideLabel={true}
//                                 />
//                                 <MultiSelectDropdown

//                                     data={clientDesignations}
//                                     selectedData={clientSelectedDesigs}
//                                     Dependency={"_id"}
//                                     FeildName='name'
//                                     InputName={"Selecte Designation"}
//                                     setSelectedData={setClientSelectedDesigs}
//                                     hideLabel={true}
//                                 />
//                                 <MultiSelectDropdown

//                                     data={employeeList}
//                                     selectedData={selectedEmployees}
//                                     Dependency={"_id"}
//                                     FeildName='name'
//                                     InputName={"Selecte Employees"}
//                                     setSelectedData={setSelectedEmployees}
//                                     hideLabel={true}
//                                     type={"object"}


//                                 />
//                             </>
//                         )}
//                     </div>
//                 ) : (
//                     <Filter pageName="employee" showFilters={showFilters} />
//                 )}
//             </div>

//             {/* Week Navigator */}
//             <div className="flex justify-center items-center gap-4 mb-2">
//                 <IconButton variant="text" onClick={() => setWeekOffset(w => w - 1)}>
//                     <PiCaretLeftBold />
//                 </IconButton>
//                 <div onClick={() => setShowPicker(p => !p)} className="cursor-pointer">
//                     <Typography>
//                         {`${fromDate.format("MMM D, YYYY")} – ${toDate.format("MMM D, YYYY")}`}
//                     </Typography>
//                 </div>
//                 <IconButton variant="text" onClick={() => setWeekOffset(w => w + 1)}>
//                     <PiCaretRightBold />
//                 </IconButton>
//             </div>
//             {showPicker && (
//                 <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-white shadow-lg rounded p-2">
//                     <DatePicker
//                         selected={fromDate.toDate()}
//                         onChange={handleDateChange}
//                         dateFormat="yyyy-'W'ww"
//                         className="border p-2 rounded"
//                         inline
//                     />
//                 </div>
//             )}

//             {/* Grid */}
//             <div
//                 ref={gridRef}
//                 className="overflow-auto relative bg-white rounded shadow"
//                 style={{ touchAction: 'none' }}
//                 onPointerDown={onPointerDown}
//                 onPointerMove={onPointerMove}
//                 onPointerUp={onPointerUp}
//             >
//                 {selectionRect && (
//                     <div
//                         className="absolute bg-blue-200 opacity-40 border border-blue-400 pointer-events-none"
//                         style={{
//                             left: selectionRect.x,
//                             top: selectionRect.y,
//                             width: selectionRect.width,
//                             height: selectionRect.height
//                         }}
//                     />
//                 )}
//                 <div className="grid min-w-max select-none" style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}>
//                     <div className="p-3 font-bold border">Employee</div>
//                     {visibleDays.map(d => (
//                         <div key={d.format()} className="p-3 text-center border">
//                             <div>{d.format('ddd')}</div>
//                             <div className="text-sm text-gray-600">{d.format('DD/MM')}</div>
//                         </div>
//                     ))}
//                     {employees.map(emp => (
//                         <React.Fragment key={emp._id}>

//                             <div className="p-3 border bg-blue-gray-50">
//                                 <Typography className={"text-md text-gray-900"}>
//                                     {emp.name?.firstName || emp.name}
//                                 </Typography>
//                                 <Typography className={"text-xs text-gray-700"}>
//                                     {emp.designation?.designationName}
//                                 </Typography>




//                             </div>
//                             {visibleDays.map(day => {
//                                 const dayKey = day.format('YYYY-MM-DD');
//                                 const shifts = emp.shifts?.[dayKey] || [];
//                                 const isSel = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);

//                                 return (
//                                     <div
//                                         key={dayKey}
//                                         data-emp-id={emp._id}
//                                         data-day={dayKey}
//                                         className={`p-2 select-none border cursor-pointer min-h-[80px] ${isSel ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
//                                     >
//                                         {shifts.length ? shifts.map((s, i) => (
//                                             <div
//                                                 key={i}
//                                                 className="text-xs mb-1 rounded px-1"
//                                                 style={{
//                                                     backgroundColor: shiftMap[s.shift]?.bgColor,
//                                                     color: shiftMap[s.shift]?.textColor
//                                                 }}
//                                             >
//                                                 <div className="font-semibold">{shiftMap[s.shift]?.name}</div>
//                                                 <div className="text-[10px]">{`${shiftMap[s.shift]?.startTime}–${shiftMap[s.shift]?.endTime}`}</div>
//                                             </div>
//                                         )) : (
//                                             <div className="text-gray-400 text-xs">No Shift</div>
//                                         )}
//                                     </div>
//                                 );
//                             })}
//                         </React.Fragment>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DustyRoaster;
// import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Typography } from '@material-tailwind/react';
// import { FaPlus, FaTrash } from 'react-icons/fa';
// import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
// import moment from 'moment';
// import toast, { Toaster } from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import DatePicker from 'react-datepicker';

// import { clientListAction, clientDepartmentAction, clientDesignationAction } from '../../redux/Action/Client/ClientAction';
// import { clientBranchListAction } from '../../redux/Action/ClientBranch/ClientBranchAction';
// import { EmployeeClientListAction } from '../../redux/Action/Employee/EmployeeAction';
// import { ShiftCreateAction, ShiftCreatebyDateAction, ShiftGetAction, ShiftListbyDateAction } from '../../redux/Action/Shift/ShiftAction';
// import RosterGrid from './components/RosterDrid';
// import ShiftDialog from './components/ShiftDialog';
// import FilterPanel from './components/FilterPanel';

// const DustyRoster = () => {
//     const dispatch = useDispatch();
//     const gridRef = useRef(null);

//     const [weekOffset, setWeekOffset] = useState(0);
//     const [showPicker, setShowPicker] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [selectedCells, setSelectedCells] = useState([]);
//     const [newShifts, setNewShifts] = useState([{ shift: '', client: {}, branches: [] }]);

//     // Filter State
//     const [filterType, setFilterType] = useState('myOrg');
//     const [clientId, setClientId] = useState({ clientId: '', clientMappedId: '' });
//     const [clientBranchId, setClientBranchId] = useState(null);
//     const [clientSelectedDeps, setClientSelectedDeps] = useState([]);
//     const [clientSelectedDesigs, setClientSelectedDesigs] = useState([]);
//     const [selectedEmployees, setSelectedEmployees] = useState([]);
//     const [employees, setEmployees] = useState([]);

//     // Redux State
//     const { shiftList = [] } = useSelector(s => s.shift || {});
//     const { clientList = [], clientDepartments = [], clientDesignations = [] } = useSelector(s => s.client || {});
//     const { clientBranchList = [] } = useSelector(s => s.clientBranch || {});
//     const { employeeList = [] } = useSelector(s => s.employee || {});
//     const { shiftByDates = [] } = useSelector(state => state?.shift)
//     // Date utilities
//     const fromDate = moment().startOf('isoWeek').add(weekOffset, 'weeks');
//     const toDate = moment(fromDate).endOf('isoWeek');
//     const visibleDays = useMemo(() => {
//         const days = toDate.diff(fromDate, 'days') + 1;
//         return Array.from({ length: days }, (_, i) => moment(fromDate).add(i, 'days'));
//     }, [fromDate, toDate]);

//     // Prepare shift data
//     const sortedShifts = useMemo(() => {
//         const list = shiftList.map(d => ({
//             ...d,
//             name: `${d.name} (${d.startTime} - ${d.endTime})`
//         }));
//         list.push({ _id: 0, name: 'Week Off', bgColor: '#f3f4f6', textColor: '#000' });
//         return list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
//     }, [shiftList]);

//     const shiftMap = useMemo(() => Object.fromEntries(sortedShifts.map(s => [s._id, s])), [sortedShifts]);

//     // Fetching data effects
//     useEffect(() => {
//         if (filterType === 'clientOrg') {
//             dispatch(clientListAction({}))
//                 .then(r => {
//                     const first = r.payload.data?.[0];
//                     if (first) setClientId({ clientId: first.clientId, clientMappedId: first._id });
//                 });
//         }
//     }, [dispatch, filterType]);

//     useEffect(() => {
//         if (clientId.clientMappedId) {
//             dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }))
//                 .then(r => {
//                     const first = r.payload.data?.[0];
//                     if (first) setClientBranchId(first._id);
//                 });
//         }
//     }, [dispatch, clientId]);

//     useEffect(() => {
//         if (clientBranchId) {
//             dispatch(clientDepartmentAction({ clientId: clientId.clientId, clientBranch: [clientBranchId] }))
//                 .then(r => setClientSelectedDeps(r.payload.data.map(d => d._id)));

//             dispatch(clientDesignationAction({ clientId: clientId.clientId, clientBranch: [clientBranchId] }))
//                 .then(r => setClientSelectedDesigs(r.payload.data.map(d => d._id)));
//         }
//     }, [dispatch, clientId, clientBranchId]);

//     useEffect(() => {
//         dispatch(EmployeeClientListAction({
//             clientId: clientId.clientId,
//             clientBranch: clientBranchId ? [clientBranchId] : [],
//             department: clientSelectedDeps,
//             designation: clientSelectedDesigs,
//             category: 'assigned'
//         })).then(({ payload }) => {
//             console.log(payload?.data?.data, 'emps')
//             setSelectedEmployees(payload?.data?.data.map((d) => d._id))
//         })
//     }, [dispatch, clientId, clientBranchId, clientSelectedDeps, clientSelectedDesigs]);

//     useEffect(() => {
//         setEmployees(employeeList.filter(e => selectedEmployees.includes(e._id)));
//     }, [employeeList, selectedEmployees]);

//     useEffect(() => {
//         if (selectedEmployees.length) {
//             getEmployeeShiftbyDate();
//         }
//     }, [selectedEmployees.length])
//     const getEmployeeShiftbyDate = () => {
//         const params = {
//             startDate: fromDate.format('YYYY-MM-DD'),
//             endDate: toDate.format('YYYY-MM-DD'),
//             employeeIds: selectedEmployees,
//             //    groupBy:"employeeIds",
//             limit: 10,
//             page: 1
//         }
//         console.log(params)
//         dispatch(ShiftListbyDateAction({ ...params })).then(({ payload }) => {
//             console.log(payload?.data, 'date wise data')


//             const merged = employees.map(emp => {
//                 const match = payload?.data.find(
//                     item => item._id?.employeeId === emp._id
//                 );
//                 const { _id, ...matchRest } = match || {};

//                 return {
//                     ...emp,
//                     ...matchRest
//                 };

//             });
//             setEmployees(merged)
//         })

//     }
//     const [dragStart, setDragStart] = useState(null);
//     const [dragRect, setDragRect] = useState(null);
//     // Grid selection logic
//     const isIntersecting = (r1, r2) =>
//         r1.x < r2.x + r2.width &&
//         r1.x + r1.width > r2.x &&
//         r1.y < r2.y + r2.height &&
//         r1.y + r1.height > r2.y;

//     // Pointer down
//     const onPointerDown = (e) => {
//         if (e.button !== 0) return;
//         const rect = gridRef.current.getBoundingClientRect();
//         setDragStart({
//             x: e.clientX - rect.left,
//             y: e.clientY - rect.top,
//         });
//         setDragRect(null);
//         setSelectedCells([]);
//     };

//     // Pointer move
//     const onPointerMove = (e) => {
//         if (!dragStart) return;
//         const rect = gridRef.current.getBoundingClientRect();
//         const currentX = e.clientX - rect.left;
//         const currentY = e.clientY - rect.top;

//         setDragRect({
//             x: Math.min(dragStart.x, currentX),
//             y: Math.min(dragStart.y, currentY),
//             width: Math.abs(currentX - dragStart.x),
//             height: Math.abs(currentY - dragStart.y),
//         });
//     };

//     // Pointer up
//     const onPointerUp = (e) => {
//         if (!dragStart || !dragRect) {
//             setDragStart(null);
//             return;
//         }
//         const rect = gridRef.current.getBoundingClientRect();
//         const selected = [];

//         gridRef.current.querySelectorAll("[data-emp-id]").forEach((cell) => {
//             const cr = cell.getBoundingClientRect();
//             const rel = {
//                 x: cr.left - rect.left,
//                 y: cr.top - rect.top,
//                 width: cr.width,
//                 height: cr.height,
//             };
//             if (isIntersecting(dragRect, rel)) {
//                 selected.push({
//                     empId: cell.getAttribute("data-emp-id"),
//                     day: cell.getAttribute("data-day"),
//                 });
//             }
//         });

//         setSelectedCells(selected);
//         setDragStart(null);
//         setDragRect(null);
//         if (selected.length) setOpenDialog(true);
//     };

//     // Attach listeners
//     useEffect(() => {
//         window.addEventListener("pointermove", onPointerMove);
//         window.addEventListener("pointerup", onPointerUp);
//         return () => {
//             window.removeEventListener("pointermove", onPointerMove);
//             window.removeEventListener("pointerup", onPointerUp);
//         };
//     }, [dragStart, dragRect]);

//     const handleSave = () => {
//         const shiftsUsed = newShifts.map(s => s.shift);
//         if (new Set(shiftsUsed).size !== newShifts.length) {
//             toast.error("Duplicate shift assignment not allowed.");
//             return;
//         }

//         if (!selectedCells.length || !newShifts.length) {
//             toast.error("No cells or shifts selected.");
//             return;
//         }

//         // Build start/end date
//         const days = [...new Set(selectedCells.map(c => c.day))].sort();
//         const startDate = moment.min(days.map(d => moment(d))).format("YYYY-MM-DD");
//         const endDate = moment.max(days.map(d => moment(d))).format("YYYY-MM-DD");

//         // Get employee IDs
//         const employeeIds = [...new Set(selectedCells.map(c => c.empId))];

//         // Build shifts array
//         const shifts = newShifts.map(ns => {
//             console.log(ns, 'ech r')
//             return ({
//                 // prevShiftId: ns.prevShiftId || ns.shift,
//                 // newShiftId: ns.shift,
//                 clientId: ns.client.clientId,
//                 clientMappedId: ns.client._id,
//                 clientBranchId: ns.clientBranchId,
//                 currentShiftId: ns.shift
//             })
//         });

//         const payload = {
//             startDate,
//             endDate,
//             employeeIds,
//             shifts
//         };

//         console.log("Saving payload:", payload);
//         dispatch(ShiftCreatebyDateAction(payload))
//         setOpenDialog(false);
//         setNewShifts([{ shift: "", client: {}, branches: [] }]);
//     };

//     const [shiftFor, setShiftFor] = useState("myOrg")
//     const [shiftForList, setShiftForList] = useState([{ id: "myOrg", name: "My Organization" }, { id: "clientOrg", name: "Client Organization" }])
//     const handleClientBranch = (i, sel) => {
//         console.log(i, sel, 'bran')
//         dispatch(clientBranchListAction({ clientMappedId: sel._id }))
//     }
//     const handleClientShifts = (i, sel, row) => {
//         console.log(i, sel, row)
//         dispatch(ShiftGetAction({ orgId: row?.client?.clientId }))
//     }

//     console.log(employees, 'employeeeeeeeeeeeeeeeeeeeee')




//     return (
//         <div className="p-4">
//             {/* Shift Dialog */}
//             <ShiftDialog
//                 open={openDialog}
//                 onClose={() => setOpenDialog(false)}
//                 newShifts={newShifts}
//                 setNewShifts={setNewShifts}
//                 sortedShifts={sortedShifts}
//                 clientList={clientList}
//                 dispatch={dispatch}
//                 onSave={handleSave}
//                 shiftFor={shiftFor}
//                 shiftForList={shiftForList}
//                 setShiftFor={setShiftFor}
//                 clientBranchList={clientBranchList}
//                 handleClientBranch={handleClientBranch}
//                 handleClientShifts={handleClientShifts}
//             />

//             {/* Header */}
//             <div className="flex justify-between mb-4">
//                 <Typography variant="h5">Duty Roster</Typography>
//                 <Typography variant="small" color="gray">Manage your employee shifts</Typography>
//             </div>

//             {/* Filters */}
//             <FilterPanel
//                 filterType={filterType}
//                 setFilterType={setFilterType}
//                 clientList={clientList}
//                 clientBranchList={clientBranchList}
//                 clientDepartments={clientDepartments}
//                 clientDesignations={clientDesignations}
//                 employeeList={employeeList}

//                 selections={{
//                     clientId, setClientId,
//                     clientBranchId, setClientBranchId,
//                     clientSelectedDeps, setClientSelectedDeps,
//                     clientSelectedDesigs, setClientSelectedDesigs,
//                     selectedEmployees, setSelectedEmployees,

//                 }}
//             />

//             {/* Week Navigator */}
//             <div className="flex justify-center items-center gap-4 mb-4">
//                 <IconButton variant="text" onClick={() => setWeekOffset(o => o - 1)}><PiCaretLeftBold /></IconButton>
//                 <div onClick={() => setShowPicker(p => !p)}>
//                     <Typography>{fromDate.format('MMM D, YYYY')} – {toDate.format('MMM D, YYYY')}</Typography>
//                 </div>
//                 <IconButton variant="text" onClick={() => setWeekOffset(o => o + 1)}><PiCaretRightBold /></IconButton>
//             </div>
//             {showPicker && (
//                 <div className="absolute z-10 p-2 bg-white shadow-lg rounded">
//                     <DatePicker
//                         selected={fromDate.toDate()}
//                         onChange={date => {
//                             const diff = moment(date).startOf('isoWeek').diff(moment().startOf('isoWeek'), 'weeks');
//                             setWeekOffset(diff);
//                         }}
//                         inline
//                         dateFormat="yyyy-'W'ww"
//                     />
//                 </div>
//             )}

//             {/* Grid */}
//             <RosterGrid
//                 ref={gridRef}
//                 employees={employees}
//                 visibleDays={visibleDays}
//                 shiftMap={shiftMap}
//                 selectedCells={selectedCells}
//                 onPointerDown={onPointerDown}
//                 onPointerUp={onPointerUp}
//                 dragRect={dragRect}
//             />
//         </div>
//     );
// };

// export default DustyRoster;