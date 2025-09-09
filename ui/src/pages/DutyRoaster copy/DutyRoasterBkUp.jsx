// // import React, { useEffect, useState } from "react";
// // import {
// //     Typography,
// //     Dialog,
// //     DialogHeader,
// //     DialogBody,
// //     DialogFooter,
// //     Button,
// //     Checkbox,
// //     IconButton,
// // } from "@material-tailwind/react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { EmployeeGetAction } from "../../redux/Action/Employee/EmployeeAction";
// // import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
// // import { clientListAction } from "../../redux/Action/Client/ClientAction";
// // import toast, { Toaster } from "react-hot-toast";
// // import { FaUsers, FaInfo, FaTrash } from "react-icons/fa";
// // import { RiPoliceBadgeLine } from "react-icons/ri";
// // import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
// // import dayjs from "dayjs";
// // import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
// // import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
// // import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
// // import { FaPlus } from "react-icons/fa6";

// // const getDateRange = (fromDate, toDate) => {
// //     const start = dayjs(fromDate).startOf("day");
// //     const end = dayjs(toDate).endOf("day");
// //     const days = end.diff(start, "day") + 1;
// //     return Array.from({ length: days }, (_, i) => start.add(i, "day"));
// // };

// // export default function DutyRoaster() {
// //     const dispatch = useDispatch();
// //     const { employeeList = [] } = useSelector((state) => state.employee || {});
// //     const { shiftList = [] } = useSelector((state) => state.shift || {});
// //     const { clientList } = useSelector((state) => state.client || {});

// //     const [employees, setEmployees] = useState([]);
// //     const [open, setOpen] = useState(false);
// //     const [newShifts, setNewShifts] = useState([]);
// //     const [clientId, setClientId] = useState();
// //     const [selectedCells, setSelectedCells] = useState([]);
// //     const [isDragging, setIsDragging] = useState(false);
// //     const [openInfo, setOpenInfo] = useState(false);
// //     const [fromDate, setFromDate] = useState(dayjs().startOf("week").add(1, "day")); // Monday
// //     const [toDate, setToDate] = useState(dayjs().startOf("week").add(7, "day"));     // Sunday
// //     const [weekOffset, setWeekOffset] = useState(0);
// //     const [clientBranchId, setClientBranchId] = useState()
// //     const [clientBranches, setClientBranches] = useState([])
// //     const [selectionRect, setSelectionRect] = useState(null)
// //     const { clientBranchList, loading, totalRecord } = useSelector(
// //         (state) => state?.clientBranch
// //     );
// //     useEffect(() => {
// //         dispatch(EmployeeGetAction());
// //         dispatch(ShiftGetAction());
// //         dispatch(clientListAction({})).then(({ payload }) => {
// //             setClientId(payload?.data?.[0]?.clientId)
// //         })
// //     }, [dispatch]);

// //     useEffect(() => {
// //         setEmployees(employeeList);
// //     }, [employeeList]);

// //     useEffect(() => {
// //         console.log("clientId==============================", clientId)
// //         dispatch(clientBranchListAction({ clientId: clientId })).then(({ payload }) => {
// //             console.log(payload?.data?.[0]?._id, 'dd')
// //             setClientBranchId(payload?.data?.[0]?._id)
// //         })
// //     }, [clientId, dispatch])

// //     useEffect(() => {
// //         const start = dayjs().add(weekOffset, "week").startOf("week").add(1, "day");
// //         const end = start.add(6, "day");
// //         setFromDate(start);
// //         setToDate(end);
// //     }, [weekOffset]);

// //     useEffect(() => {
// //         const closePopover = (e) => {
// //             if (!e.target.closest(".popover-info")) setOpenInfo(false);
// //         };
// //         document.addEventListener("mousedown", closePopover);
// //         return () => document.removeEventListener("mousedown", closePopover);
// //     }, []);

// //     const sortedShifts = [
// //         ...shiftList,
// //         { _id: 0, name: "Week Off", bgColor: "#f3f4f6", textColor: "#000000" },
// //     ].sort((a, b) => a?.startTime?.localeCompare(b?.startTime));

// //     const shiftMap = Object.fromEntries(sortedShifts.map((s) => [s._id, s]));
// //     const visibleDays = getDateRange(fromDate, toDate);

// //     const handleSave = () => {
// //         const seen = new Set();
// //         for (const entry of newShifts) {
// //             if (seen.has(entry.shift)) {
// //                 toast.error("Duplicate shift assignment not allowed.");
// //                 return;
// //             }
// //             seen.add(entry.shift);
// //         }

// //         const updated = employees.map((emp) => {
// //             const matched = selectedCells.filter((cell) => cell.empId === emp._id);
// //             if (!matched.length) return emp;
// //             const updatedShifts = { ...emp.shifts };
// //             matched.forEach((cell) => {
// //                 updatedShifts[cell.day] = [...newShifts];
// //             });
// //             return { ...emp, shifts: updatedShifts };
// //         });

// //         setEmployees(updated);
// //         setOpen(false);
// //         setSelectedCells([]);
// //         setNewShifts([]);
// //     };

// //     const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
// //     const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

// //     const weekRange = `${fromDate.format("MMM D, YYYY")} – ${toDate.format("MMM D, YYYY")}`;

// //     const handleShiftChange = (index, selShift) => {
// //         const updated = [...newShifts];
// //         updated[index].shift = selShift._id;
// //         if (selShift._id === 0) {
// //             updated[index].client = null;
// //         } else if (!updated[index].client && clientList.length > 0) {
// //             updated[index].client = clientList[0];
// //         }
// //         setNewShifts(updated);
// //     };

// //     const handleClientChange = (index, selClient) => {
// //         const updated = [...newShifts];
// //         updated[index].client = selClient;
// //         setNewShifts(updated);
// //     };

// //     const handleBranchChange = (index, selectedBranches) => {

// //         console.log(index, selectedBranches)
// //         const updated = [...newShifts];
// //         updated[index].branches = selectedBranches;

// //         console.log(updated, 'd')
// //         setNewShifts(updated);
// //     };

// //     const handleRemove = (index) => {
// //         const updated = newShifts.filter((_, i) => i !== index);
// //         setNewShifts(updated);
// //     };

// //     const handleAdd = () => {
// //         setNewShifts([
// //             ...newShifts,
// //             {
// //                 shift: sortedShifts[0]?._id || "",
// //                 client: clientList[0] || null,
// //                 branches: [],
// //             },
// //         ]);
// //     };

// //     return (
// //         <div>
// //             <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
// //                 <div>
// //                     <Typography variant="h5">Duty Roster</Typography>
// //                     <Typography variant="small" color="gray">Manage your employee shifts</Typography>
// //                 </div>
// //             </div>

// //             <div className="p-6 bg-white shadow-lg rounded-xl">
// //                 <Toaster />
// //                 <div className="flex gap-6 justify-center mb-6">
// //                     <div className="flex items-center gap-2">
// //                         <button onClick={handlePrevWeek}><PiCaretLeft className="h-5 w-5 text-md font-bold text-gray-500" /></button>
// //                         <Typography className="text-md font-semibold">{weekRange}</Typography>
// //                         <button onClick={handleNextWeek}><PiCaretRight className="h-5 w-5 text-md font-bold text-gray-500" /></button>
// //                     </div>
// //                 </div>

// //                 {/* <div className="flex gap-6 mb-6">
// //           <div className="w-48 gap-2 flex flex-col">
// //             <SingleSelectDropdown
// //               listData={clientList}
// //               feildName="name"
// //               inputName="Select Client"
// //               selectedOptionDependency="_id"
// //               selectedOption={clientId}
// //               handleClick={(selected) => setClientId(selected?._id)}
// //               hideLabel
// //               showTip
// //               showSerch
// //             />
// //              <SingleSelectDropdown
// //               listData={clientList}
// //               feildName="name"
// //               inputName="Select Branch"
// //               selectedOptionDependency="_id"
// //               selectedOption={clientId}
// //               handleClick={(selected) => setClientId(selected?._id)}
// //               hideLabel
// //               showTip
// //               showSerch
// //             />
// //           </div>

// //           <div className="relative bg-gray-100 rounded-lg flex items-center gap-4 shadow-md p-2">
// //             <div className="bg-red-200 p-1 rounded-full">
// //               <FaUsers className="text-red-500" />
// //             </div>
// //             <div>
// //               <Typography variant="h6">10 / 25</Typography>
// //               <Typography variant="small" color="gray">Total Employees</Typography>
// //             </div>

// //             <div className="absolute top-2 right-2">
// //               <div
// //                 className="cursor-pointer bg-blue-200 rounded-full p-1"
// //                 onMouseOver={() => setOpenInfo(true)}
// //                 onMouseLeave={() => setOpenInfo(false)}
// //               >
// //                 <FaInfo className="text-blue-500 w-2 h-2" />
// //               </div>

// //               {openInfo && (
// //                 <div className="absolute top-6 right-0 z-50 w-96 bg-white border rounded-lg shadow-xl p-4 popover-info">
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //                     {["Supervisor", "Guards"].map((role) => (
// //                       <div key={role} className="flex items-center gap-4 border rounded-lg p-4">
// //                         <div className="bg-red-100 p-3 rounded-full">
// //                           <RiPoliceBadgeLine className="text-red-500" />
// //                         </div>
// //                         <div>
// //                           <Typography variant="small" color="gray" className="mb-1">{role}</Typography>
// //                           <div className="flex gap-4">
// //                             <div><Typography className="text-sm">10</Typography><Typography className="text-xs" color="gray">Male</Typography></div>
// //                             <div><Typography className="text-sm">10</Typography><Typography className="text-xs" color="gray">Female</Typography></div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div> */}
// //                 <div>
// //                     <div
// //                         className="grid min-w-max py-2"
// //                         style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}
// //                     >
// //                         <div className=" text-center text-sm space-y-2">
// //                             <SingleSelectDropdown
// //                                 listData={clientList}
// //                                 feildName="name"
// //                                 inputName="Select Client"
// //                                 selectedOptionDependency="clientId"
// //                                 selectedOption={clientId}
// //                                 handleClick={(selected) => setClientId(selected?.clientId)}
// //                                 hideLabel
// //                                 showTip
// //                                 showSerch
// //                             />
// //                             <SingleSelectDropdown
// //                                 listData={clientBranchList}
// //                                 feildName="name"
// //                                 inputName="Select Branch"
// //                                 selectedOptionDependency="_id"
// //                                 selectedOption={clientBranchId}
// //                                 handleClick={(selected) => setClientBranchId(selected?._id)}
// //                                 hideLabel
// //                                 showTip
// //                                 showSerch
// //                             />
// //                         </div>

// //                         {visibleDays.map((day, index) => (
// //                             <div key={index} className="p-3 text-center text-sm">
// //                                 <div className="relative bg-gray-100 rounded-lg flex items-start shadow-md p-2">
// //                                     <div className="bg-red-200 p-1 rounded-full">
// //                                         <FaUsers className="text-red-500" />
// //                                     </div>
// //                                     <div>
// //                                         <Typography variant="h6">10 / 25</Typography>
// //                                         <Typography variant="small" color="gray">
// //                                             Total Employees
// //                                         </Typography>
// //                                     </div>
// //                                     <div className="absolute top-2 right-2">
// //                                         <div
// //                                             className="cursor-pointer bg-blue-200 rounded-full p-1"
// //                                             onMouseOver={() => setOpenInfo(true)}
// //                                             onMouseLeave={() => setOpenInfo(false)}
// //                                         >
// //                                             <FaInfo className="text-blue-500 w-2 h-2" />
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>

// //                 </div>

// //                 <Dialog open={open} handler={() => setOpen(false)} size="lg">
// //                     <DialogHeader>Manage Shifts</DialogHeader>
// //                     <DialogBody>
// //                         <Toaster />
// //                         <div className="flex flex-col gap-6">
// //                             {newShifts.map((entry, index) => (
// //                                 <div
// //                                     key={index}
// //                                     className="flex flex-col md:flex-row gap-4 items-start "
// //                                 >
// //                                     {/* Shift Dropdown */}
// //                                     <SingleSelectDropdown
// //                                         listData={sortedShifts}
// //                                         feildName="name"
// //                                         inputName="Select Shift"
// //                                         selectedOptionDependency="_id"
// //                                         selectedOption={entry.shift}
// //                                         handleClick={(sel) => handleShiftChange(index, sel)}
// //                                         hideLabel
// //                                         showSerch
// //                                     />

// //                                     {/* Client Dropdown */}
// //                                     {entry.shift !== 0 && (
// //                                         <SingleSelectDropdown
// //                                             listData={clientList}
// //                                             feildName="name"
// //                                             inputName="Select Client"
// //                                             selectedOptionDependency="clientId"
// //                                             selectedOption={entry.client?.clientId}
// //                                             handleClick={(sel) => handleClientChange(index, sel)}
// //                                             hideLabel
// //                                             showSerch
// //                                         />
// //                                     )}

// //                                     {/* Branches Dropdown */}
// //                                     {entry.shift !== 0 && (
// //                                         <MultiSelectDropdown
// //                                             data={clientBranchList}
// //                                             FeildName="name"
// //                                             Dependency="_id"
// //                                             InputName="Select Branch"
// //                                             selectedData={entry.branches || []}
// //                                             setSelectedData={(selectedBranches) => {
// //                                                 const updated = [...newShifts];
// //                                                 updated[index].branches = selectedBranches;
// //                                                 setNewShifts(updated);
// //                                             }}
// //                                             showTip
// //                                             hideLabel
// //                                         />
// //                                     )}

// //                                     {/* Remove Button */}
// //                                     {newShifts.length > 1 && (
// //                                         <IconButton
// //                                             variant="text"
// //                                             color="red"
// //                                             onClick={() => handleRemove(index)}
// //                                         >
// //                                             <FaTrash className="h-5 w-5" />
// //                                         </IconButton>
// //                                     )}
// //                                 </div>
// //                             ))}

// //                             {/* Add New Shift */}
// //                             <Button
// //                                 variant="outlined"
// //                                 color="blue"
// //                                 onClick={handleAdd}
// //                                 className="flex items-center gap-2 w-fit"
// //                             >
// //                                 <FaPlus className="h-5 w-5" /> Add Shift
// //                             </Button>
// //                         </div>
// //                     </DialogBody>

// //                     <DialogFooter>
// //                         <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
// //                         <Button onClick={handleSave} color="blue">Save</Button>
// //                     </DialogFooter>
// //                 </Dialog>

// //                 <div className="overflow-x-auto rounded-md shadow-md ">
// //                     <div className="grid min-w-max" style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}>
// //                         <Typography className="bg-background p-3 text-[16px] font-semibold">Employee List</Typography>
// //                         {visibleDays.map((day) => (
// //                             <div key={day.format("YYYY-MM-DD")} className="bg-background p-3 text-center text-sm">
// //                                 <Typography className="text-md text-[16px]">{day.format("ddd")}</Typography>
// //                                 <Typography className="text-gray-600 text-[14px]">{day.format("DD/MM")}</Typography>
// //                             </div>
// //                         ))}
// //                         {employees.map((emp) => (
// //                             <React.Fragment key={emp._id}>
// //                                 <div className="p-3 border-t border-r">
// //                                     <Typography variant="small" className="font-bold">{emp.name?.firstName || emp?.name}</Typography>
// //                                     <Typography variant="small" color="gray">{emp.title}</Typography>
// //                                 </div>
// //                                 {visibleDays.map((day) => {
// //                                     const dayKey = day.format("YYYY-MM-DD");
// //                                     const shifts = emp?.shifts?.[dayKey] || [];

// //                                     const isSelected = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);
// //                                     return (
// //                                         <div
// //                                             key={dayKey}

// //                                             className={`p-2 border-t border-r cursor-pointer min-h-[72px] ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:ring-2 ring-blue-300'}`}
// //                                             onMouseDown={() => {
// //                                                 setIsDragging(true);
// //                                                 setSelectedCells([{ empId: emp._id, day: dayKey }]);
// //                                             }}
// //                                             onMouseEnter={() => {
// //                                                 if (isDragging) {
// //                                                     setSelectedCells((prev) => {
// //                                                         const exists = prev.some((c) => c.empId === emp._id && c.day === dayKey);
// //                                                         return exists ? prev : [...prev, { empId: emp._id, day: dayKey }];
// //                                                     });
// //                                                 }
// //                                             }}
// //                                             onMouseUp={() => {
// //                                                 setIsDragging(false);
// //                                                 setOpen(true);
// //                                                 setNewShifts([]);
// //                                             }}

// //                                             onPointerDown={e => {
// //                                                 if (e.button !== 0) return

// //                                                 const containerRect = e.currentTarget.getBoundingClientRect()

// //                                                 setSelectionRect(
// //                                                     new DOMRect(
// //                                                         e.clientX - containerRect.x,
// //                                                         e.clientY - containerRect.y,
// //                                                         0,
// //                                                         0,
// //                                                     ),
// //                                                 )
// //                                             }}
// //                                             onPointerMove={e => {
// //                                                 if (selectionRect == null) return

// //                                                 const containerRect =
// //                                                     e.currentTarget.getBoundingClientRect()

// //                                                 const x = e.clientX - containerRect.x
// //                                                 const y = e.clientY - containerRect.y

// //                                                 const nextSelectionRect = new DOMRect(
// //                                                     Math.min(x, selectionRect.x),
// //                                                     Math.min(y, selectionRect.y),
// //                                                     Math.abs(x - selectionRect.x),
// //                                                     Math.abs(y - selectionRect.y),
// //                                                 )

// //                                                 setSelectionRect(nextSelectionRect)
// //                                             }}
// //                                         >
// //                                             {shifts.length > 0 ? (
// //                                                 shifts.map((shift, i) => (
// //                                                     <div key={i} className="text-xs p-1 mb-1 rounded text-center"
// //                                                         style={{ backgroundColor: shiftMap[shift.shift]?.bgColor, color: shiftMap[shift.shift]?.textColor }}>
// //                                                         <div className="font-semibold">{shiftMap[shift.shift]?.name}</div>
// //                                                         <div className="text-[10px]">{shiftMap[shift.shift]?.startTime} - {shiftMap[shift.shift]?.endTime}</div>
// //                                                         <div>{shift?.client?.name}</div>
// //                                                     </div>
// //                                                 ))
// //                                             ) : (
// //                                                 <div className="text-gray-500 text-xs">No Shift</div>
// //                                             )}
// //                                         </div>
// //                                     );
// //                                 })}
// //                             </React.Fragment>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }


// //26/06/25


// import React, { useEffect, useState } from "react";
// import {
//     Typography,
//     Dialog,
//     DialogHeader,
//     DialogBody,
//     DialogFooter,
//     Button,
//     Checkbox,
//     IconButton,
// } from "@material-tailwind/react";
// import { useDispatch, useSelector } from "react-redux";
// import { EmployeeGetAction } from "../../redux/Action/Employee/EmployeeAction";
// import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
// import { clientListAction } from "../../redux/Action/Client/ClientAction";
// import toast, { Toaster } from "react-hot-toast";
// import { FaUsers, FaInfo, FaTrash } from "react-icons/fa";
// import { RiPoliceBadgeLine } from "react-icons/ri";
// import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
// import dayjs from "dayjs";
// import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
// import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
// import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
// import { FaPlus } from "react-icons/fa6";

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
//     const { clientList } = useSelector((state) => state.client || {});

//     const [employees, setEmployees] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [newShifts, setNewShifts] = useState([]);
//     const [clientId, setClientId] = useState();
//     const [selectedCells, setSelectedCells] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);
//     const [openInfo, setOpenInfo] = useState(false);
//     const [fromDate, setFromDate] = useState(dayjs().startOf("week").add(1, "day")); // Monday
//     const [toDate, setToDate] = useState(dayjs().startOf("week").add(7, "day"));     // Sunday
//     const [weekOffset, setWeekOffset] = useState(0);
//     const [clientBranchId, setClientBranchId] = useState()
//     const [clientBranches, setClientBranches] = useState([])
//     const [selectionRect, setSelectionRect] = useState(null)
//     const { clientBranchList, loading, totalRecord } = useSelector(
//         (state) => state?.clientBranch
//     );
//     useEffect(() => {
//         dispatch(EmployeeGetAction());
//         dispatch(ShiftGetAction());
//         dispatch(clientListAction({})).then(({ payload }) => {
//             setClientId(payload?.data?.[0]?.clientId)
//         })
//     }, [dispatch]);

//     useEffect(() => {
//         setEmployees(employeeList);
//     }, [employeeList]);

//     useEffect(() => {
//         console.log("clientId==============================", clientId)
//         dispatch(clientBranchListAction({ clientId: clientId })).then(({ payload }) => {
//             console.log(payload?.data?.[0]?._id, 'dd')
//             setClientBranchId(payload?.data?.[0]?._id)
//         })
//     }, [clientId, dispatch])

//     useEffect(() => {
//         const start = dayjs().add(weekOffset, "week").startOf("week").add(1, "day");
//         const end = start.add(6, "day");
//         setFromDate(start);
//         setToDate(end);
//     }, [weekOffset]);

//     useEffect(() => {
//         const closePopover = (e) => {
//             if (!e.target.closest(".popover-info")) setOpenInfo(false);
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
//         setNewShifts([]);
//     };

//     const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
//     const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

//     const weekRange = `${fromDate.format("MMM D, YYYY")} – ${toDate.format("MMM D, YYYY")}`;

//     const handleShiftChange = (index, selShift) => {
//         const updated = [...newShifts];
//         updated[index].shift = selShift._id;
//         if (selShift._id === 0) {
//             updated[index].client = null;
//         } else if (!updated[index].client && clientList.length > 0) {
//             updated[index].client = clientList[0];
//         }
//         setNewShifts(updated);
//     };

//     const handleClientChange = (index, selClient) => {
//         const updated = [...newShifts];
//         updated[index].client = selClient;
//         setNewShifts(updated);
//     };

//     const handleBranchChange = (index, selectedBranches) => {

//         console.log(index, selectedBranches)
//         const updated = [...newShifts];
//         updated[index].branches = selectedBranches;

//         console.log(updated, 'd')
//         setNewShifts(updated);
//     };

//     const handleRemove = (index) => {
//         const updated = newShifts.filter((_, i) => i !== index);
//         setNewShifts(updated);
//     };

//     const handleAdd = () => {
//         setNewShifts([
//             ...newShifts,
//             {
//                 shift: sortedShifts[0]?._id || "",
//                 client: clientList[0] || null,
//                 branches: [],
//             },
//         ]);
//     };

//     return (
//         <div>
//             <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
//                 <div>
//                     <Typography variant="h5">Duty Roster</Typography>
//                     <Typography variant="small" color="gray">Manage your employee shifts</Typography>
//                 </div>
//             </div>

//             <div className="p-6 bg-white shadow-lg rounded-xl">
//                 <Toaster />
//                 <div className="flex gap-6 justify-center mb-6">
//                     <div className="flex items-center gap-2">
//                         <button onClick={handlePrevWeek}><PiCaretLeft className="h-5 w-5 text-md font-bold text-gray-500" /></button>
//                         <Typography className="text-md font-semibold">{weekRange}</Typography>
//                         <button onClick={handleNextWeek}><PiCaretRight className="h-5 w-5 text-md font-bold text-gray-500" /></button>
//                     </div>
//                 </div>

//                 {/* <div className="flex gap-6 mb-6">
//           <div className="w-48 gap-2 flex flex-col">
//             <SingleSelectDropdown
//               listData={clientList}
//               feildName="name"
//               inputName="Select Client"
//               selectedOptionDependency="_id"
//               selectedOption={clientId}
//               handleClick={(selected) => setClientId(selected?._id)}
//               hideLabel
//               showTip
//               showSerch
//             />
//              <SingleSelectDropdown
//               listData={clientList}
//               feildName="name"
//               inputName="Select Branch"
//               selectedOptionDependency="_id"
//               selectedOption={clientId}
//               handleClick={(selected) => setClientId(selected?._id)}
//               hideLabel
//               showTip
//               showSerch
//             />
//           </div>

//           <div className="relative bg-gray-100 rounded-lg flex items-center gap-4 shadow-md p-2">
//             <div className="bg-red-200 p-1 rounded-full">
//               <FaUsers className="text-red-500" />
//             </div>
//             <div>
//               <Typography variant="h6">10 / 25</Typography>
//               <Typography variant="small" color="gray">Total Employees</Typography>
//             </div>

//             <div className="absolute top-2 right-2">
//               <div
//                 className="cursor-pointer bg-blue-200 rounded-full p-1"
//                 onMouseOver={() => setOpenInfo(true)}
//                 onMouseLeave={() => setOpenInfo(false)}
//               >
//                 <FaInfo className="text-blue-500 w-2 h-2" />
//               </div>

//               {openInfo && (
//                 <div className="absolute top-6 right-0 z-50 w-96 bg-white border rounded-lg shadow-xl p-4 popover-info">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {["Supervisor", "Guards"].map((role) => (
//                       <div key={role} className="flex items-center gap-4 border rounded-lg p-4">
//                         <div className="bg-red-100 p-3 rounded-full">
//                           <RiPoliceBadgeLine className="text-red-500" />
//                         </div>
//                         <div>
//                           <Typography variant="small" color="gray" className="mb-1">{role}</Typography>
//                           <div className="flex gap-4">
//                             <div><Typography className="text-sm">10</Typography><Typography className="text-xs" color="gray">Male</Typography></div>
//                             <div><Typography className="text-sm">10</Typography><Typography className="text-xs" color="gray">Female</Typography></div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div> */}
//                 <div>
//                     <div
//                         className="grid min-w-max py-2"
//                         style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}
//                     >
//                         <div className=" text-center text-sm space-y-2">
//                             <SingleSelectDropdown
//                                 listData={clientList}
//                                 feildName="name"
//                                 inputName="Select Client"
//                                 selectedOptionDependency="clientId"
//                                 selectedOption={clientId}
//                                 handleClick={(selected) => setClientId(selected?.clientId)}
//                                 hideLabel
//                                 showTip
//                                 showSerch
//                             />
//                             <SingleSelectDropdown
//                                 listData={clientBranchList}
//                                 feildName="name"
//                                 inputName="Select Branch"
//                                 selectedOptionDependency="_id"
//                                 selectedOption={clientBranchId}
//                                 handleClick={(selected) => setClientBranchId(selected?._id)}
//                                 hideLabel
//                                 showTip
//                                 showSerch
//                             />
//                         </div>

//                         {visibleDays.map((day, index) => (
//                             <div key={index} className="p-3 text-center text-sm">
//                                 <div className="relative bg-gray-100 rounded-lg flex items-start shadow-md p-2">
//                                     <div className="bg-red-200 p-1 rounded-full">
//                                         <FaUsers className="text-red-500" />
//                                     </div>
//                                     <div>
//                                         <Typography variant="h6">10 / 25</Typography>
//                                         <Typography variant="small" color="gray">
//                                             Total Employees
//                                         </Typography>
//                                     </div>
//                                     <div className="absolute top-2 right-2">
//                                         <div
//                                             className="cursor-pointer bg-blue-200 rounded-full p-1"
//                                             onMouseOver={() => setOpenInfo(true)}
//                                             onMouseLeave={() => setOpenInfo(false)}
//                                         >
//                                             <FaInfo className="text-blue-500 w-2 h-2" />
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                 </div>

//                 <Dialog open={open} handler={() => setOpen(false)} size="lg">
//                     <DialogHeader>Manage Shifts</DialogHeader>
//                     <DialogBody>
//                         <Toaster />
//                         <div className="flex flex-col gap-6">
//                             {newShifts.map((entry, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex flex-col md:flex-row gap-4 items-start "
//                                 >
//                                     {/* Shift Dropdown */}
//                                     <SingleSelectDropdown
//                                         listData={sortedShifts}
//                                         feildName="name"
//                                         inputName="Select Shift"
//                                         selectedOptionDependency="_id"
//                                         selectedOption={entry.shift}
//                                         handleClick={(sel) => handleShiftChange(index, sel)}
//                                         hideLabel
//                                         showSerch
//                                     />

//                                     {/* Client Dropdown */}
//                                     {entry.shift !== 0 && (
//                                         <SingleSelectDropdown
//                                             listData={clientList}
//                                             feildName="name"
//                                             inputName="Select Client"
//                                             selectedOptionDependency="clientId"
//                                             selectedOption={entry.client?.clientId}
//                                             handleClick={(sel) => handleClientChange(index, sel)}
//                                             hideLabel
//                                             showSerch
//                                         />
//                                     )}

//                                     {/* Branches Dropdown */}
//                                     {entry.shift !== 0 && (
//                                         <MultiSelectDropdown
//                                             data={clientBranchList}
//                                             FeildName="name"
//                                             Dependency="_id"
//                                             InputName="Select Branch"
//                                             selectedData={entry.branches || []}
//                                             setSelectedData={(selectedBranches) => {
//                                                 const updated = [...newShifts];
//                                                 updated[index].branches = selectedBranches;
//                                                 setNewShifts(updated);
//                                             }}
//                                             showTip
//                                             hideLabel
//                                         />
//                                     )}

//                                     {/* Remove Button */}
//                                     {newShifts.length > 1 && (
//                                         <IconButton
//                                             variant="text"
//                                             color="red"
//                                             onClick={() => handleRemove(index)}
//                                         >
//                                             <FaTrash className="h-5 w-5" />
//                                         </IconButton>
//                                     )}
//                                 </div>
//                             ))}

//                             {/* Add New Shift */}
//                             <Button
//                                 variant="outlined"
//                                 color="blue"
//                                 onClick={handleAdd}
//                                 className="flex items-center gap-2 w-fit"
//                             >
//                                 <FaPlus className="h-5 w-5" /> Add Shift
//                             </Button>
//                         </div>
//                     </DialogBody>

//                     <DialogFooter>
//                         <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
//                         <Button onClick={handleSave} color="blue">Save</Button>
//                     </DialogFooter>
//                 </Dialog>

//                 <div className="overflow-x-auto rounded-md shadow-md ">
//                     <div className="grid min-w-max" style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}>
//                         <Typography className="bg-background p-3 text-[16px] font-semibold">Employee List</Typography>
//                         {visibleDays.map((day) => (
//                             <div key={day.format("YYYY-MM-DD")} className="bg-background p-3 text-center text-sm">
//                                 <Typography className="text-md text-[16px]">{day.format("ddd")}</Typography>
//                                 <Typography className="text-gray-600 text-[14px]">{day.format("DD/MM")}</Typography>
//                             </div>
//                         ))}
//                         {employees.map((emp) => (
//                             <React.Fragment key={emp._id}>
//                                 <div className="p-3 border-t border-r">
//                                     <Typography variant="small" className="font-bold">{emp.name?.firstName || emp?.name}</Typography>
//                                     <Typography variant="small" color="gray">{emp.title}</Typography>
//                                 </div>
//                                 {visibleDays.map((day) => {
//                                     const dayKey = day.format("YYYY-MM-DD");
//                                     const shifts = emp?.shifts?.[dayKey] || [];

//                                     const isSelected = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);
//                                     return (
//                                         <div
//                                             key={dayKey}

//                                             className={`p-2 border-t border-r cursor-pointer min-h-[72px] ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:ring-2 ring-blue-300'}`}
//                                             onMouseDown={() => {
//                                                 setIsDragging(true);
//                                                 setSelectedCells([{ empId: emp._id, day: dayKey }]);
//                                             }}
//                                             onMouseEnter={() => {
//                                                 if (isDragging) {
//                                                     setSelectedCells((prev) => {
//                                                         const exists = prev.some((c) => c.empId === emp._id && c.day === dayKey);
//                                                         return exists ? prev : [...prev, { empId: emp._id, day: dayKey }];
//                                                     });
//                                                 }
//                                             }}
//                                             onMouseUp={() => {
//                                                 setIsDragging(false);
//                                                 setOpen(true);
//                                                 setNewShifts([]);
//                                             }}

//                                             onPointerDown={e => {
//                                                 if (e.button !== 0) return

//                                                 const containerRect = e.currentTarget.getBoundingClientRect()

//                                                 setSelectionRect(
//                                                     new DOMRect(
//                                                         e.clientX - containerRect.x,
//                                                         e.clientY - containerRect.y,
//                                                         0,
//                                                         0,
//                                                     ),
//                                                 )
//                                             }}
//                                             onPointerMove={e => {
//                                                 if (selectionRect == null) return

//                                                 const containerRect =
//                                                     e.currentTarget.getBoundingClientRect()

//                                                 const x = e.clientX - containerRect.x
//                                                 const y = e.clientY - containerRect.y

//                                                 const nextSelectionRect = new DOMRect(
//                                                     Math.min(x, selectionRect.x),
//                                                     Math.min(y, selectionRect.y),
//                                                     Math.abs(x - selectionRect.x),
//                                                     Math.abs(y - selectionRect.y),
//                                                 )

//                                                 setSelectionRect(nextSelectionRect)
//                                             }}
//                                         >
//                                             {shifts.length > 0 ? (
//                                                 shifts.map((shift, i) => (
//                                                     <div key={i} className="text-xs p-1 mb-1 rounded text-center"
//                                                         style={{ backgroundColor: shiftMap[shift.shift]?.bgColor, color: shiftMap[shift.shift]?.textColor }}>
//                                                         <div className="font-semibold">{shiftMap[shift.shift]?.name}</div>
//                                                         <div className="text-[10px]">{shiftMap[shift.shift]?.startTime} - {shiftMap[shift.shift]?.endTime}</div>
//                                                         <div>{shift?.client?.name}</div>
//                                                     </div>
//                                                 ))
//                                             ) : (
//                                                 <div className="text-gray-500 text-xs">No Shift</div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </React.Fragment>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Typography
} from '@material-tailwind/react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';

import OrganizationFilter from '../../components/Filter/organizationFilter';
import Filter from '../../components/Filter/Filter';
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../../components/MultiSelectDropdown/MultiSelectDropdown';

import {
    clientListAction,
    clientDepartmentAction,
    clientDesignationAction
} from '../../redux/Action/Client/ClientAction';
import { clientBranchListAction } from '../../redux/Action/ClientBranch/ClientBranchAction';
import { EmployeeClientListAction, EmployeeGetAction } from '../../redux/Action/Employee/EmployeeAction';
import { ShiftGetAction } from '../../redux/Action/Shift/ShiftAction';

const DustyRoaster = () => {
    const dispatch = useDispatch();
    const gridRef = useRef(null);

    // UI State
    const [showFilters, setShowFilters] = useState(window.innerWidth > 640);
    const [selectedFilterType, setFilterType] = useState('myOrg');
    const [weekOffset, setWeekOffset] = useState(0);
    const [showPicker, setShowPicker] = useState(false);

    //filteres for Shift Dailog 
    const [shiftFor, setShiftFor] = useState("myOrg")
    const [shiftForList, setShiftForList] = useState([{ id: "myOrg", name: "My Organization" }, { id: "clientOrg", name: "Client Organization" }])
    const { shiftList = [] } = useSelector(state => state.shift || {});

    // Selection / Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);
    const [selectionRect, setSelectionRect] = useState(null);

    // Dropdown States
    const [clientId, setClientId] = useState({ clientId: '', clientMappedId: '' });
    const [clientBranchId, setClientBranchId] = useState();
    const [newShifts, setNewShifts] = useState([{ shift: '', client: {}, branches: [] }]);
    const [clientSelectedDeps, setClientSelectedDeps] = useState([]);
    const [clientSelectedDesigs, setClientSelectedDesigs] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([])
    const [employees, setEmployees] = useState([])
    // Redux Data

    const { clientList = [] } = useSelector(state => state.client || {});
    const { clientDepartments } = useSelector((state) => state?.client)
    const { clientDesignations } = useSelector((state) => state?.client)
    const { clientBranchList = [] } = useSelector(state => state.clientBranch || {});
    const { employeeList = [] } = useSelector(state => state.employee || {});

    // Dates
    const fromDate = moment().startOf('week').add(1 + weekOffset * 7, 'days');
    const toDate = moment().startOf('week').add(7 + weekOffset * 7, 'days');

    const visibleDays = useMemo(() => {
        const days = toDate.diff(fromDate, 'day') + 1;
        return Array.from({ length: days }, (_, i) => moment(fromDate).add(i, 'days'));
    }, [fromDate, toDate]);

    const sortedShifts = useMemo(() => {
        const dt = shiftList.map((d) => ({
            ...d,
            name: `${d.name} (${d.startTime} - ${d.endTime})`,
        }));

        dt.push({ _id: 0, name: 'Week Off', bgColor: '#f3f4f6', textColor: '#000' });

        return dt.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    }, [shiftList]);

    const shiftMap = useMemo(() => Object.fromEntries(sortedShifts.map(s => [s._id, s])), [sortedShifts]);

    // Fetch Clients on Load if Filter is Client Org
    useEffect(() => {
        if (selectedFilterType === 'clientOrg') {
            dispatch(clientListAction({})).then(r => {
                const first = r.payload.data?.[0];
                if (first) setClientId({ clientId: first.clientId, clientMappedId: first?._id });
            });
        }
    }, [dispatch, selectedFilterType]);

    useEffect(() => {
        if (clientId) {
            dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }))
                .then(r => {
                    const first = r.payload.data?.[0];
                    if (first) setClientBranchId(first._id);
                });
        }
    }, [dispatch, clientId]);

    useEffect(() => {
        if (clientBranchId) {
            dispatch(clientDepartmentAction({ clientId: clientId.clientId, clientBranch: [clientBranchId] })).then(({ payload }) => {
                const temp = payload.data.map((r) => r?._id)
                console.log(temp, 'temp d')
                setClientSelectedDeps(temp)
            });
        }
    }, [dispatch, clientBranchId]);
    useEffect(() => {
        if (clientId && clientSelectedDeps) {


            dispatch(clientDesignationAction({ clientId: clientId?.clientId, clientBranch: [clientBranchId] })).then(({ payload }) => {
                const temp = payload.data.map((r) => r?._id)
                console.log(temp, 'temp d')
                setClientSelectedDesigs(temp)
            });
        }
    }, [dispatch, clientId, clientSelectedDeps]);
    useEffect(() => {
        dispatch(EmployeeClientListAction({
            clientId: clientId?.clientId,
            clientBranch: [clientBranchId],
            department: clientSelectedDeps,
            designation: clientSelectedDesigs,
            category: 'assigned'
        }));
    }, [clientId, clientBranchId, clientSelectedDeps, clientSelectedDesigs])

    // Grid Selection Handlers
    const isIntersecting = (r1, r2) =>
        r1.x < r2.x + r2.width && r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;

    const onPointerDown = e => {
        if (e.button !== 0 || !gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        setSelectionRect(new DOMRect(e.clientX - rect.left, e.clientY - rect.top, 0, 0));
    };

    const onPointerMove = e => {
        if (!selectionRect || !gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionRect(new DOMRect(
            Math.min(x, selectionRect.x),
            Math.min(y, selectionRect.y),
            Math.abs(x - selectionRect.x),
            Math.abs(y - selectionRect.y)
        ));
    };

    const onPointerUp = () => {
        if (!selectionRect || !gridRef.current) return;

        const selected = [];
        const rectParent = gridRef.current.getBoundingClientRect();

        gridRef.current.querySelectorAll('[data-emp-id]').forEach(cell => {
            const cr = cell.getBoundingClientRect();
            const rel = new DOMRect(cr.left - rectParent.left, cr.top - rectParent.top, cr.width, cr.height);
            if (isIntersecting(selectionRect, rel)) {
                selected.push({
                    empId: cell.getAttribute('data-emp-id'),
                    day: cell.getAttribute('data-day')
                });
            }
        });

        setSelectedCells(selected);
        setSelectionRect(null);
        setOpenDialog(true);
        setNewShifts([{ shift: '', client: {}, branches: [] }]);
    };

    const handleDateChange = (date) => {
        if (!date) return;
        const selectedWeek = moment(date).startOf('isoWeek');
        const currentWeek = moment().startOf('isoWeek');
        const diffWeeks = selectedWeek.diff(currentWeek, 'week');
        setWeekOffset(diffWeeks);
    };

    // Dialog Handlers
    const handleShiftChange = (index, sel) => {
        const updated = [...newShifts];
        updated[index].shift = sel._id;
        setNewShifts(updated);
    };

    const handleClientChange = (index, sel) => {
        const updated = [...newShifts];
        updated[index].client = sel;
        updated[index].branches = [];
        dispatch(clientBranchListAction({ clientMappedId: sel?._id }));
        dispatch(ShiftGetAction({ orgId: sel?.clientId }));
        setNewShifts(updated);
    };

    // const handleBranchChange = (index, sel) => {
    //     const updated = [...newShifts];
    //     updated[index].client = sel;
    //     updated[index].branches = [];
    //     updated[index].shifts=[]
    //    setNewShifts(updated);

    // };

    const handleAddShiftRow = () => {
        setNewShifts([
            ...newShifts,
            { shift: sortedShifts[0]._id, client: clientList[0] || {}, branches: [] }
        ]);
    };

    const handleRemoveShiftRow = (idx) => {
        setNewShifts(newShifts.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
        const seen = new Set(newShifts.map(e => e.shift));
        if (seen.size < newShifts.length) {
            toast.error('Duplicate shift assignment not allowed.');
            return;
        }

        const updatedEmployees = employeeList.map(emp => {

            const cells = selectedCells.filter(c => c.empId === emp._id);
            if (!cells.length) return emp;
            const updatedShifts = { ...(emp.shifts || {}) };
            cells.forEach(c => {
                updatedShifts[c.day] = [{
                    ...newShifts, clientBranchId: emp.clientBranchId
                }];
            });
            return { ...emp, shifts: updatedShifts };
        });
        const filteredEmployeesShifts = updatedEmployees.filter((d) => d?.shifts)

        const dates = selectedCells.map((d) => d.day).sort((a, b) => new Date(a) - new Date(b))
        const startDate = dates?.[0]
        const endDate = dates?.[dates?.length - 1]
        const employeeIds = [...new Set(selectedCells.map((d) => d.empId))]
        console.log(filteredEmployeesShifts, 'while save')



        // Dispatch updated shifts here if needed
        setOpenDialog(false);
        setSelectedCells([]);
        setNewShifts([{ shift: '', client: {}, branches: [] }]);
    };
    console.log(clientDepartments, clientDesignations, employeeList, 'client d')

    useEffect(() => {
        const filteredEmployees = employeeList.filter((data) =>
            selectedEmployees.includes(data._id)
        );
        setEmployees(filteredEmployees)
    }, [selectedEmployees, employeeList]);
    return (
        <div className="relative">
            {/* Shift Assignment Dialog */}
            <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="lg">
                <DialogHeader>Manage Shifts</DialogHeader>
                <DialogBody>
                    <Toaster />
                    {newShifts.map((ent, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-4 items-start mb-4 flex-wrap">

                            <SingleSelectDropdown inputName="Select For"
                                listData={shiftForList}
                                feildName="name"
                                selectedOptionDependency="id"
                                selectedOption={shiftFor}
                                handleClick={(se) => {
                                    setShiftFor(se?.id)
                                }}

                                hideLabel />
                            <SingleSelectDropdown
                                listData={clientList} feildName={'name'} inputName={'Select Client'}
                                selectedOptionDependency={'clientId'}
                                selectedOption={clientId.clientId}
                                // handleClick={(sel) => setClientId({ clientId: sel.clientId, clientMappedId: sel?._id })}
                                handleClick={(sel) => {
                                    handleClientChange(i, sel)
                                }}
                                hideLabel showSerch showTip
                            />
                            <SingleSelectDropdown
                                // {...{
                                //     listData: clientBranchList, feildName: 'name', inputName: 'Select Branch',
                                //     selectedOptionDependency: '_id', selectedOption: clientBranchId,
                                //     handleClick: sel => setClientBranchId(sel._id), hideLabel: true, showTip: true, showSerch: true
                                // }} 

                                listData={clientBranchList} feildName={'name'} inputName={'Select Client'}
                                selectedOptionDependency={'_id'}
                                selectedOption={clientBranchId}
                                // handleClick={(sel) => setClientBranchId(sel._id)}
                                handleClick={(sel) => {
                                    handleClientChange(i, sel)
                                }}
                                hideLabel showSerch showTip
                            />
                            <SingleSelectDropdown
                                listData={sortedShifts}
                                feildName="name"
                                inputName="Select Shift"
                                selectedOptionDependency="_id"
                                selectedOption={ent.shift}
                                handleClick={sel => handleShiftChange(i, sel)}
                                hideLabel
                                showSerch
                            />
                            {newShifts.length > 1 && (
                                <IconButton variant="text" color="red" onClick={() => handleRemoveShiftRow(i)}>
                                    <FaTrash className="h-5 w-5" />
                                </IconButton>
                            )}

                            {/* <SingleSelectDropdown
                                listData={sortedShifts}
                                feildName="name"
                                inputName="Select Shift"
                                selectedOptionDependency="_id"
                                selectedOption={ent.shift}
                                handleClick={sel => handleShiftChange(i, sel)}
                                hideLabel
                                showSerch
                            />
                            {ent.shift !== 0 && (
                                <>
                                    <SingleSelectDropdown
                                        listData={clientList}
                                        feildName="name"
                                        inputName="Select Client"
                                        selectedOptionDependency="clientId"
                                        selectedOption={ent.client.clientId}
                                        handleClick={sel => handleClientChange(i, sel)}
                                        hideLabel
                                        showSerch
                                    />
                                    <MultiSelectDropdown
                                        data={clientBranchList}
                                        FeildName="name"
                                        Dependency="_id"
                                        InputName="Select Branch"
                                        selectedData={ent.branches}
                                        setSelectedData={bs => {
                                            const upd = [...newShifts];
                                            upd[i].branches = bs;
                                            setNewShifts(upd);
                                        }}
                                        hideLabel
                                        showTip
                                    />
                                </>
                            )}
                            {newShifts.length > 1 && (
                                <IconButton variant="text" color="red" onClick={() => handleRemoveShiftRow(i)}>
                                    <FaTrash className="h-5 w-5" />
                                </IconButton>
                            )} */}
                        </div>
                    ))}
                    <Button onClick={handleAddShiftRow} variant="outlined" color="blue" className="flex items-center gap-2">
                        <FaPlus /> Add Shift
                    </Button>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button color="blue" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </Dialog>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h5">Duty Roster</Typography>
                <Typography variant="small" color="gray">Manage your employee shifts</Typography>
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded shadow mb-4">
                <div className="flex gap-2 mb-3">
                    {['myOrg', 'clientOrg'].map(type => (
                        <button
                            key={type}
                            className={`px-3 py-1 border rounded ${selectedFilterType === type ? 'bg-blue-500 text-white' : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type === 'myOrg' ? 'My Organization' : 'Client Organization'}
                        </button>
                    ))}
                </div>
                {selectedFilterType === 'clientOrg' ? (
                    <div className="flex gap-4 flex-wrap">
                        <SingleSelectDropdown {...{
                            listData: clientList, feildName: 'name', inputName: 'Select Client',
                            selectedOptionDependency: 'clientId', selectedOption: clientId.clientId,
                            handleClick: sel => setClientId({ clientId: sel.clientId, clientMappedId: sel?._id }), hideLabel: true, showTip: true, showSerch: true
                        }} />
                        <SingleSelectDropdown {...{
                            listData: clientBranchList, feildName: 'name', inputName: 'Select Branch',
                            selectedOptionDependency: '_id', selectedOption: clientBranchId,
                            handleClick: sel => setClientBranchId(sel._id), hideLabel: true, showTip: true, showSerch: true
                        }} />
                        {clientBranchId && (
                            <>
                                <MultiSelectDropdown
                                    //  {...{
                                    //     data: clientDepartments, selectedData: clientSelectedDeps,
                                    //     Dependency: "_id", FeildName: "name", InputName: "Select Department",
                                    //     setSelectedData: setClientSelectedDeps, hideLabel: true
                                    // }}
                                    data={clientDepartments}
                                    selectedData={clientSelectedDeps}
                                    Dependency={"_id"}
                                    FeildName='name'
                                    InputName={"Selecte Department"}
                                    setSelectedData={setClientSelectedDeps}
                                    hideLabel={true}
                                />
                                <MultiSelectDropdown
                                    //  {...{
                                    //     data: clientDesignations, selectedData: clientSelectedDesigs,
                                    //     Dependency: "_id", FeildName: "name", InputName: "Select Designation",
                                    //     setSelectedData: setClientSelectedDesigs, hideLabel: true
                                    // }}

                                    data={clientDesignations}
                                    selectedData={clientSelectedDesigs}
                                    Dependency={"_id"}
                                    FeildName='name'
                                    InputName={"Selecte Designation"}
                                    setSelectedData={setClientSelectedDesigs}
                                    hideLabel={true}
                                />
                                <MultiSelectDropdown
                                    //  {...{
                                    //     data: employeeList, selectedData: selectedEmployees,
                                    //     Dependency: "_id", FeildName: "name.firstName", InputName: "Select Employees",
                                    //     setSelectedData: setSelectedEmployees, hideLabel: true,

                                    // }}

                                    data={employeeList}
                                    selectedData={selectedEmployees}
                                    Dependency={"_id"}
                                    FeildName='name'
                                    InputName={"Selecte Employees"}
                                    setSelectedData={setSelectedEmployees}
                                    hideLabel={true}
                                    type={"object"}


                                />
                            </>
                        )}
                    </div>
                ) : (
                    <Filter pageName="employee" showFilters={showFilters} />
                )}
            </div>

            {/* Week Navigator */}
            <div className="flex justify-center items-center gap-4 mb-2">
                <IconButton variant="text" onClick={() => setWeekOffset(w => w - 1)}>
                    <PiCaretLeftBold />
                </IconButton>
                <div onClick={() => setShowPicker(p => !p)} className="cursor-pointer">
                    <Typography>
                        {`${fromDate.format("MMM D, YYYY")} – ${toDate.format("MMM D, YYYY")}`}
                    </Typography>
                </div>
                <IconButton variant="text" onClick={() => setWeekOffset(w => w + 1)}>
                    <PiCaretRightBold />
                </IconButton>
            </div>
            {showPicker && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-white shadow-lg rounded p-2">
                    <DatePicker
                        selected={fromDate.toDate()}
                        onChange={handleDateChange}
                        dateFormat="yyyy-'W'ww"
                        className="border p-2 rounded"
                        inline
                    />
                </div>
            )}

            {/* Grid */}
            <div
                ref={gridRef}
                className="overflow-auto relative bg-white rounded shadow"
                style={{ touchAction: 'none' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                {selectionRect && (
                    <div
                        className="absolute bg-blue-200 opacity-40 border border-blue-400 pointer-events-none"
                        style={{
                            left: selectionRect.x,
                            top: selectionRect.y,
                            width: selectionRect.width,
                            height: selectionRect.height
                        }}
                    />
                )}
                <div className="grid min-w-max select-none" style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 3fr)` }}>
                    <div className="p-3 font-bold border">Employee</div>
                    {visibleDays.map(d => (
                        <div key={d.format()} className="p-3 text-center border">
                            <div>{d.format('ddd')}</div>
                            <div className="text-sm text-gray-600">{d.format('DD/MM')}</div>
                        </div>
                    ))}
                    {employees.map(emp => (
                        <React.Fragment key={emp._id}>

                            <div className="p-3 border bg-blue-gray-50">
                                <Typography className={"text-md text-gray-900"}>
                                    {emp.name?.firstName || emp.name}
                                </Typography>
                                <Typography className={"text-xs text-gray-700"}>
                                    {emp.designation?.designationName}
                                </Typography>




                            </div>
                            {visibleDays.map(day => {
                                const dayKey = day.format('YYYY-MM-DD');
                                const shifts = emp.shifts?.[dayKey] || [];
                                const isSel = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);

                                return (
                                    <div
                                        key={dayKey}
                                        data-emp-id={emp._id}
                                        data-day={dayKey}
                                        className={`p-2 select-none border cursor-pointer min-h-[80px] ${isSel ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
                                    >
                                        {shifts.length ? shifts.map((s, i) => (
                                            <div
                                                key={i}
                                                className="text-xs mb-1 rounded px-1"
                                                style={{
                                                    backgroundColor: shiftMap[s.shift]?.bgColor,
                                                    color: shiftMap[s.shift]?.textColor
                                                }}
                                            >
                                                <div className="font-semibold">{shiftMap[s.shift]?.name}</div>
                                                <div className="text-[10px]">{`${shiftMap[s.shift]?.startTime}–${shiftMap[s.shift]?.endTime}`}</div>
                                            </div>
                                        )) : (
                                            <div className="text-gray-400 text-xs">No Shift</div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DustyRoaster;
