import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useCheckEnabledModule } from '../../hooks/useCheckEnabledModule.js'
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { EmployeeGetAction, EmployeeClientListAction } from "../../redux/Action/Employee/EmployeeAction"
import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";
import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { ShiftGroupCreateAction } from '../../redux/Action/ShiftGroup/ShiftGroupAction';
import { FaXmark } from "react-icons/fa6";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
import { days, months } from '../../constants/Constants';
import { select, Typography } from "@material-tailwind/react";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
import { Button } from "@material-tailwind/react";
import { OverlappingShifts } from "./OverlappingShifts";
dayjs.extend(isLeapYear);

const AssignShift = ({
    closeSidebar,
    selectedfilter,
    selectedShift,
    selectedClient
}) => {
    const dispatch = useDispatch();
    const checkModule = useCheckEnabledModule();
    const [weekOffDays, setWeekOffDays] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [selectedWeeks, setSelectedWeeks] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const { subOrgs } = useSelector((state) => state?.subOrgs);
    const { branchList } = useSelector((state) => state?.branch);
    const { departmentList } = useSelector((state) => state?.department);
    const { designationList } = useSelector((state) => state?.designation);
    const { clientBranchList } = useSelector((state) => state?.clientBranch);
    const { employeeList } = useSelector(state => state.employee || {});
    const [selected, setSelected] = useState({
        subOrgId: "",
        branchId: "",
        departmentId: "",
        designationId: "",
        clientBranchId: "",
    });
    
    const [overlappingShiftIds, setOverlappingShiftIds] = useState([]);
    const [openOverlappingShifts, setOpenOverlappingShifts] = useState(false);

    const getYearsList = () => {
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let i = 0; i <= 3; i++) {
            const year = currentYear + i;
            years.push({
            id: year,
            name: String(year)
            });
        }

        return years;
    }

    useEffect(() => {
    if (!selectedMonths.length) {
        setWeeks([]);
        setSelectedWeeks([]);
        return;
    }

    const newWeeks = [];
    selectedMonths.forEach((monthId) => {
        const monthObj = months.find((m) => m.id === monthId);
        if (!monthObj) return;

        const year = new Date().getFullYear();
        const monthIndex = monthObj.id - 1;

        const firstDay = dayjs(new Date(year, monthIndex, 1));
        const lastDay = dayjs(new Date(year, monthIndex + 1, 0));

        let start = firstDay;
        let weekNumber = 1; // start week counter for this month

        // Handle partial first week
        if (start.day() !== 1) {
            let endOfPartial = start.add(7 - start.day(), "day");
            if (endOfPartial.isAfter(lastDay)) {
                endOfPartial = lastDay;
            }

            newWeeks.push({
                id: `${monthObj.value}-week${weekNumber}`,
                value: `Week ${weekNumber} - (${start.format("D MMM")} to ${endOfPartial.format("D MMM")})`,
            });

            weekNumber++;
            start = endOfPartial.add(1, "day"); // next Monday
        }

        // Full Mon–Sun weeks
        while (start.isBefore(lastDay) || start.isSame(lastDay)) {
            let end = start.add(6, "day");
            if (end.isAfter(lastDay)) {
                end = lastDay;
            }

            newWeeks.push({
                id: `${monthObj.value}-week${weekNumber}`,
                value: `Week ${weekNumber} - (${start.format("D MMM")} to ${end.format("D MMM")})`,
            });

            weekNumber++;
            start = end.add(1, "day"); // move to next Monday
        }
    });

        setWeeks(newWeeks);
    }, [selectedMonths]);


    const getInitials = (name) => {
        if (!name) return '';
        const [first, second] = name.trim().split(/\s+/);
        return (first?.[0] + (second?.[0] || '')).toUpperCase();
    };

    useEffect(() => {
        if (subOrgs.length > 0) {
            setSelected((prev) => ({...prev, subOrgId: subOrgs[0]._id}))
        }
    }, [dispatch, subOrgs])

    useEffect(() => {
        dispatch(SubOrgListAction());
        dispatch(BranchGetAction({}));
    }, [dispatch]);

    useEffect(() => {
        if (selected.subOrgId) {
            dispatch(BranchGetAction({ subOrgId: selected.subOrgId }));
            dispatch(EmployeeGetAction({ orgIds: [selected.subOrgId] }));
        }
    }, [dispatch, selected.subOrgId]);

    useEffect(() => {
        if (selected.branchId) {
            if (selected.subOrgId) {
                dispatch(DepartmentGetAction({ subOrgId: selected.subOrgId, branchIds: [selected.branchId] }));
                dispatch(EmployeeGetAction({ orgIds: [selected.subOrgId], branchIds: [selected.branchId] }));
            } else {
                dispatch(DepartmentGetAction({ branchIds: [selected.branchId] }));
                dispatch(EmployeeGetAction({branchIds: [selected.branchId] }));
            }
        }
    }, [dispatch, selected.branchId]);

    useEffect(() => {
        if (selected.clientBranchId) {
            dispatch(EmployeeClientListAction({ category: "assigned", clientBranchIds: [selected.clientBranchId], clientMappedId: selectedClient.clientMappedId }));
        }
    }, [dispatch, selected.clientBranchId]);

    useEffect(() => {
        if (selected.departmentId) {
            if (selected.subOrgId) {
                dispatch(DesignationGetAction({ orgIds: [selected.subOrgId], branchIds: [selected.branchId], departmentIds: [selected.departmentId] }));
                dispatch(EmployeeGetAction({ orgIds: [selected.subOrgId], branchIds: [selected.branchId], departmentIds: [selected.departmentId] }));
            } else {
                dispatch(DesignationGetAction({ branchIds: [selected.branchId], departmentIds: [selected.departmentId] }));
            dispatch(EmployeeGetAction({ branchIds: [selected.branchId], departmentIds: [selected.departmentId] }));
            }
        }
    }, [dispatch, selected.departmentId]);

    useEffect(() => {
        if (selected.designationId) {
            if (selected.subOrgId) {
                dispatch(EmployeeGetAction({ orgIds: [selected.subOrgId], branchIds: [selected.branchId], departmentIds: [selected.departmentId], designationIds: [selected.designationId] }));
            } else {
                dispatch(EmployeeGetAction({ branchIds: [selected.branchId], departmentIds: [selected.departmentId], designationIds: [selected.designationId] }));
            }
        }
    }, [dispatch, selected.designationId]);

    useEffect(() => {
        if (selectedClient.clientMappedId) {
            dispatch(clientBranchListAction({ clientMappedId: selectedClient.clientMappedId }));
        }
    }, [dispatch, selectedClient]);

    useEffect(() => {
        setSelectedEmployees([]);
    }, [selectedfilter])

    const clearInfoAndCloseSidebar = () => {
        // not clearing org list
        setSelected((prev) => ({...prev, branchId: "", departmentId: "", designationId: "", clientBranchId: "",}))
        setSelectedEmployees([]);
        setSelectedMonths([]);
        setSelectedWeeks([]);
        setWeekOffDays([]);
        closeSidebar()
        setOverlappingShiftIds([])
        setOpenOverlappingShifts(false);
    }

    const handleOverlappingShifts = (overlappingShiftIds) => {
        setOverlappingShiftIds(overlappingShiftIds)
        setOpenOverlappingShifts((prev) => !prev)
    }

    const assignShift = async () => {
        let payload = undefined;
        if (selectedfilter === 'myOrg') {
            payload = {
            shiftId: selectedShift._id,
            subOrgId: selected.subOrgId,
            branchId: selected.branchId,
            departmentId: selected.departmentId,
            designationId: selected.designationId,
            userIds: selectedEmployees,
            year: selectedYear,
            ...(selectedWeeks.length > 0
                ? { weeks: selectedWeeks }
                : selectedMonths.length > 0
                ? { months: selectedMonths }
                : {}),
            weekOff: weekOffDays,
            shiftsToDisable: overlappingShiftIds.map((s) => s._id)
        };
        const response = await dispatch(ShiftGroupCreateAction(payload));
        if (response.type === 'shiftGroupCreate/rejected') {
            if (response.payload.data.data.length > 0) {
                handleOverlappingShifts(response.payload.data.data)
            }
        } else {
            clearInfoAndCloseSidebar();
        }
        
        } else {
            payload = {
                clientMappedId: selectedClient.clientMappedId,
                clientBranchId: selected.clientBranchId,
                userIds: selectedEmployees,
                year: selectedYear,
                ...(selectedWeeks.length > 0
                    ? { weeks: selectedWeeks }
                    : selectedMonths.length > 0
                    ? { months: selectedMonths }
                    : {}),
                weekOff: weekOffDays,
                shiftsToDisable: overlappingShiftIds.map((s) => s._id)
            }
            if (response.type === 'shiftGroupCreate/rejected') {
                if (response.payload.data.data.length > 0) {
                    handleOverlappingShifts(response.payload.data.data)
                }
            } else {
                clearInfoAndCloseSidebar();
            }
        }
    }

    return (
        <div>
            <OverlappingShifts 
                open={openOverlappingShifts} 
                setOpen={setOpenOverlappingShifts}
                shifts={overlappingShiftIds}
                selectedShift={selectedShift}
                assignShift={assignShift}
                clearInfoAndCloseSidebar={clearInfoAndCloseSidebar}
            />
            <div className='gap-2 p-2'>
                <div className="text-center pt-2 ">
                    <div className='flex justify-between px-4 '>
                        <h3 className="text-xl font-bold text-gray-800 m-0">Assign Shift To Employees</h3>
                        <div>
                            <button onClick={clearInfoAndCloseSidebar}
                                className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
                                hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                                <FaXmark className="text-2xl sm:text-lg" />
                            </button>
                        </div>
                    </div>
                    <div className="p-2 ">
                        <div className="px-4 py-2 shadow-hrms rounded-md">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2 items-center">
                                    <div
                                        className="h-7 w-7 rounded-md flex items-center justify-center"
                                        style={{ backgroundColor: selectedShift.bgColor }}
                                    >
                                        <Typography
                                            className="text-xs font-semibold"
                                            style={{ color: selectedShift.textColor }}
                                        >
                                            {getInitials(selectedShift.name)}
                                        </Typography>
                                    </div>
                                    <span className="text-sm">{selectedShift.name}</span>
                                </div>
                                <div>
                                    <span className="text-sm">{selectedShift.startTime}</span> - <span className="text-sm">{selectedShift.endTime}</span>
                                </div>
                                <div>
                                    {selectedfilter === 'clientOrg' && `| ${selectedClient.clientName}`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-2 mt-2 flex flex-col overflow-y-scroll mb-10'>
                        <div className="relative">
                            <SingleSelectDropdown
                                selectedOption={selectedYear}
                                listData={getYearsList()}
                                selectedOptionDependency="id"
                                feildName="name"
                                inputName="Year"
                                handleClick={(data) => setSelectedYear(data.id)}
                                hideLabel
                            />
                        </div>
                        {selectedfilter === "myOrg" ? (
                            <div className="flex flex-col gap-4">
                                {checkModule('suborganization') && 
                                    <div className="relative mt-4">
                                    <SingleSelectDropdown
                                        selectedOption={selected.subOrgId}
                                        listData={subOrgs}
                                        selectedOptionDependency="_id"
                                        feildName="name"
                                        inputName="Organization"
                                        handleClick={(data) =>
                                        setSelected((prev) => ({
                                            ...prev,
                                            subOrgId: data?._id,
                                            branchId: "",
                                            departmentId: "",
                                            designationId: ""
                                        }))
                                        }
                                        hideLabel
                                    />
                                </div>}
                                <div className={`relative ${!checkModule('suborganization') && "mt-4"}`}>
                                    <SingleSelectDropdown
                                        selectedOption={selected.branchId}
                                        listData={branchList}
                                        selectedOptionDependency="_id"
                                        feildName="name"
                                        inputName="Branch"
                                        handleClick={(data) => setSelected((prev) => ({ ...prev, branchId: data?._id }))}
                                        hideLabel
                                    />
                                    {selected.branchId && (
                                        <button
                                        onClick={() =>
                                            setSelected((prev) => ({
                                            ...prev,
                                            branchId: "",
                                            departmentId: "",
                                            designationId: ""
                                            }))
                                        }
                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                        >
                                            <FaXmark size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <SingleSelectDropdown
                                        selectedOption={selected.departmentId}
                                        listData={departmentList}
                                        selectedOptionDependency="_id"
                                        feildName="name"
                                        inputName="Department"
                                        handleClick={(data) => setSelected((prev) => ({ ...prev, departmentId: data?._id }))}
                                        hideLabel
                                    />
                                    {selected.departmentId && (
                                        <button
                                        onClick={() =>
                                            setSelected((prev) => ({
                                            ...prev,
                                            departmentId: "",
                                            }))
                                        }
                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                        >
                                            <FaXmark size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <SingleSelectDropdown
                                        selectedOption={selected.designationId}
                                        listData={designationList}
                                        selectedOptionDependency="_id"
                                        feildName="name"
                                        inputName="Designation"
                                        handleClick={(data) => setSelected((prev) => ({ ...prev, designationId: data?._id }))}
                                        hideLabel
                                    />
                                    {selected.designationId && (
                                        <button
                                        onClick={() =>
                                            setSelected((prev) => ({
                                            ...prev,
                                            designationId: "",
                                            }))
                                        }
                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                        >
                                            <FaXmark size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <MultiSelectDropdown
                                        data={employeeList}
                                        FeildName="name"
                                        Dependency="_id"
                                        InputName="Select Employees"
                                        selectedData={selectedEmployees}
                                        setSelectedData={setSelectedEmployees}
                                        hideLabel
                                        type={"object"}
                                    />
                                    {selectedEmployees?.length > 0 && (
                                        <button
                                            onClick={() => setSelectedEmployees([])}
                                            className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                        >
                                            <FaXmark size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="relative mt-4">
                                    <SingleSelectDropdown
                                        selectedOption={selected.clientBranchId}
                                        listData={clientBranchList}
                                        selectedOptionDependency="_id"
                                        feildName="name"
                                        inputName="Client Branch"
                                        handleClick={(data) => setSelected((prev) => ({ ...prev, clientBranchId: data?._id }))}
                                        hideLabel
                                    />
                                </div>
                                <div className="relative">
                                    <MultiSelectDropdown
                                        data={employeeList}
                                        FeildName="name"
                                        Dependency="_id"
                                        InputName="Select Employees"
                                        selectedData={selectedEmployees}
                                        setSelectedData={setSelectedEmployees}
                                        hideLabel
                                        type={"object"}
                                    />
                                    {selectedEmployees?.length > 0 && (
                                        <button
                                            onClick={() => setSelectedEmployees([])}
                                            className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                        >
                                            <FaXmark size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="relative mt-4">
                            <MultiSelectDropdown
                                data={months}
                                FeildName="value"
                                Dependency="id"
                                InputName="Select Months"
                                selectedData={selectedMonths}
                                setSelectedData={setSelectedMonths}
                                hideLabel
                            />
                            {selectedMonths?.length > 0 && (
                                <button
                                    onClick={() => setSelectedMonths([])}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                >
                                    <FaXmark size={14} />
                                </button>
                            )}
                        </div>
                        
                        <div className="relative mt-4">
                            <MultiSelectDropdown
                                data={weeks}
                                FeildName="value"
                                Dependency="value"
                                InputName="Select Weeks"
                                selectedData={selectedWeeks}
                                setSelectedData={setSelectedWeeks}
                                hideLabel
                            />
                            {selectedWeeks?.length > 0 && (
                                <button
                                    onClick={() => setSelectedWeeks([])}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                >
                                    <FaXmark size={14} />
                                </button>
                            )}
                        </div>
                        
                        <div className="relative mt-4">
                            <MultiSelectDropdown
                                data={days}
                                FeildName="value"
                                displayType
                                Dependency="value"
                                InputName="Select Weekoff"
                                selectedData={weekOffDays}
                                setSelectedData={setWeekOffDays}
                                hideLabel={true}
                            />
                            {weekOffDays?.length > 0 && (
                                <button
                                    onClick={() => setWeekOffDays([])}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500"
                                >
                                    <FaXmark size={14} />
                                </button>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button onClick={assignShift} className="w-full bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex justify-center items-center">Assign Shift</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AssignShift;