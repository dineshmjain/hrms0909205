
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';

import {
    clientListAction,
    clientDepartmentAction,
    clientDesignationAction
} from '../../redux/Action/Client/ClientAction';
import { clientBranchListAction } from '../../redux/Action/ClientBranch/ClientBranchAction';
import { EmployeeClientListAction } from '../../redux/Action/Employee/EmployeeAction';
import { ShiftCreatebyDateAction, ShiftGetAction, ShiftListbyDateAction } from '../../redux/Action/Shift/ShiftAction';

import RosterGrid from './components/RosterDrid';
import ShiftDialog from './components/ShiftDialog';
import FilterPanel from './components/FilterPanel';

const DustyRoster = () => {
    const dispatch = useDispatch();
    const gridRef = useRef(null);

    const [weekOffset, setWeekOffset] = useState(0);
    const [showPicker, setShowPicker] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);
    const [newShifts, setNewShifts] = useState([{ shift: '', client: {}, branches: [] }]);

    const [filterType, setFilterType] = useState('myOrg');
    const [clientId, setClientId] = useState({ clientId: '', clientMappedId: '' });
    const [clientBranchId, setClientBranchId] = useState(null);
    const [clientSelectedDeps, setClientSelectedDeps] = useState([]);
    const [clientSelectedDesigs, setClientSelectedDesigs] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const fromDate = useMemo(() => moment().startOf('isoWeek').add(weekOffset, 'weeks'), [weekOffset]);
    const toDate = useMemo(() => moment(fromDate).endOf('isoWeek'), [fromDate]);
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);
const [totalPages, setTotalPages] = useState(1);

    const visibleDays = useMemo(() => {
        const days = toDate.diff(fromDate, 'days') + 1;
        return Array.from({ length: days }, (_, i) => moment(fromDate).add(i, 'days'));
    }, [fromDate, toDate]);

    const { shiftList = [] } = useSelector(s => s.shift || {});
    const { clientList = [], clientDepartments = [], clientDesignations = [] } = useSelector(s => s.client || {});
    const { clientBranchList = [] } = useSelector(s => s.clientBranch || {});
    const { employeeList = [] } = useSelector(s => s.employee || {});

    const sortedShifts = useMemo(() => {
        const list = shiftList.map(d => ({
            ...d,
            name: `${d.name} (${d.startTime} - ${d.endTime})`
        }));
        list.push({ _id: 0, name: 'Week Off', bgColor: '#f3f4f6', textColor: '#000' });
        return list.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
    }, [shiftList]);

    const shiftMap = useMemo(() => Object.fromEntries(sortedShifts.map(s => [s._id, s])), [sortedShifts]);

    const filteredEmployees = useMemo(() => {
        return  (selectedEmployees.length !==0 ?employeeList.filter(e => selectedEmployees.includes(e._id)):employeeList);
    }, [employeeList, selectedEmployees]);

    useEffect(() => {
        const loadClients = async () => {
            if (filterType === 'clientOrg') {
                const res = await dispatch(clientListAction({}));
                const first = res.payload.data?.[0];
                if (first) setClientId({ clientId: first.clientId, clientMappedId: first._id });
            }
        };
        loadClients();
    }, [dispatch, filterType]);

    useEffect(() => {
        const loadBranches = async () => {
            if (clientId.clientMappedId) {
                const res = await dispatch(clientBranchListAction({ clientMappedId: clientId.clientMappedId }));
                const first = res.payload.data?.[0];
                if (first) setClientBranchId(first._id);
            }
        };
        loadBranches();
    }, [dispatch, clientId]);

    useEffect(() => {
        const loadDepsDesigs = async () => {
            if (clientBranchId) {
                const depRes = await dispatch(clientDepartmentAction({ clientMappedId: clientId.clientMappedId, clientBranchIds: [clientBranchId] }));
                const desigRes = await dispatch(clientDesignationAction({ clientMappedId: clientId.clientMappedId, clientBranchIds: [clientBranchId] }));
                setClientSelectedDeps(depRes.payload.data.map(d => d._id));
                setClientSelectedDesigs(desigRes.payload.data.map(d => d._id));
            }
        };
        loadDepsDesigs();
    }, [dispatch, clientId, clientBranchId]);

    useEffect(() => {

        loadEmployees();
    }, [dispatch, clientId, clientBranchId, clientSelectedDeps, clientSelectedDesigs]);
    const loadEmployees = async () => {
        const res = await dispatch(EmployeeClientListAction({
            // clientId: clientId.clientId,
            clientMappedId:clientId?.clientMappedId,
            clientBranchIds: clientBranchId ? [clientBranchId] : [],
            // department: clientSelectedDeps,
            // designation: clientSelectedDesigs,
            category: 'assigned'
        }));
        //   setSelectedEmployees(res.payload.data.data.map(d => d._id));
    };
    useEffect(() => {
        if (selectedEmployees.length > 0) {

            getShifts();
        }
        else {
            setEmployees([])
        }
    }, [dispatch, fromDate, toDate, selectedEmployees, filteredEmployees]);
    // const getShifts = async () => {
    //     const res = await dispatch(ShiftListbyDateAction({
    //         startDate: fromDate.format('YYYY-MM-DD'),
    //         endDate: toDate.format('YYYY-MM-DD'),
    //         employeeIds: selectedEmployees,
    //         limit: 10,
    //         page: 1
    //     }));
    //     const shiftData = res.payload?.data || [];
    //     const merged = filteredEmployees.map(emp => {
    //         const match = shiftData.find(item => item._id?.employeeId === emp._id);
    //         const { _id, ...matchRest } = match || {};
    //         return { ...emp, ...matchRest };
    //     });
    //     setEmployees(merged);
    // };
    
    
    const getShifts = async () => {
    const res = await dispatch(ShiftListbyDateAction({
        startDate: fromDate.format('YYYY-MM-DD'),
        endDate: toDate.format('YYYY-MM-DD'),
        employeeIds: selectedEmployees,
        limit,
        page
    }));

    const shiftData = res.payload?.data || [];
    const merged = filteredEmployees.map(emp => {
    
        const match = shiftData.filter(item => item._id?.employeeId === emp._id);
      
        return { ...emp, match }
       
    });

    setEmployees(merged);
    console.log(merged,'emp id')
    // Optional: if backend gives total count
    const count = res.payload?.total || shiftData.length;
    setTotalPages(Math.ceil(count / limit));
};

    const [employees, setEmployees] = useState([]);
    const [dragStart, setDragStart] = useState(null);
    const [dragRect, setDragRect] = useState(null);

    const isIntersecting = (r1, r2) =>
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y;

    const onPointerDown = (e) => {
        if (e.button !== 0) return;
        const rect = gridRef.current.getBoundingClientRect();
        setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setDragRect(null);
        setSelectedCells([]);
    };

    const onPointerMove = useCallback((e) => {
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
    }, [dragStart]);

   const onPointerUp = useCallback(() => {
    if (!dragStart || !dragRect) return setDragStart(null);
    const rect = gridRef.current.getBoundingClientRect();
    const selected = [];

    gridRef.current.querySelectorAll('[data-emp-id]').forEach(cell => {
        const cr = cell.getBoundingClientRect();
        const rel = {
            x: cr.left - rect.left,
            y: cr.top - rect.top,
            width: cr.width,
            height: cr.height
        };
        if (isIntersecting(dragRect, rel)) {
            selected.push({ empId: cell.getAttribute('data-emp-id'), day: cell.getAttribute('data-day') });
        }
    });

    setSelectedCells(selected);
    setDragStart(null);
    setDragRect(null);

    const shifts = selected.map(({ empId, day }) => {
        const employee = employees.find(e => e._id === empId);
        const shiftData = employee?.shifts?.filter((s) => moment(s.date).format('YYYY-MM-DD') === day);
        return shiftData?.map((shift) => ({
            shift: shift?.currentShiftId,
            client: {
                clientId: employee?.clientId,
                _id: shift?.clientMappedId
            },
            clientBranchId: shift?.clientBranchId,
            branches: []
        }));
    }).flat().filter(Boolean);

    setNewShifts(shifts.length ? shifts : [{ shift: '', client: {}, branches: [] }]);
    if (selected.length) setOpenDialog(true);
}, [dragStart, dragRect, employees]);


    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove, onPointerUp]);

    const handleSave = () => {
        if (!selectedCells.length || !newShifts.length) {
            toast.error('No cells or shifts selected.');
            return;
        }
        const shiftsUsed = newShifts.map(s => s.shift);
        if (new Set(shiftsUsed).size !== newShifts.length) {
            toast.error('Duplicate shift assignment not allowed.');
            return;
        }
        const days = [...new Set(selectedCells.map(c => c.day))].sort();
        const startDate = moment.min(days.map(d => moment(d))).format('YYYY-MM-DD');
        const endDate = moment.max(days.map(d => moment(d))).format('YYYY-MM-DD');
        const employeeIds = [...new Set(selectedCells.map(c => c.empId))];
        const shifts = newShifts.map(ns => ({
            clientId: ns.client.clientId,
            clientMappedId: ns.client._id,
            clientBranchId: ns.clientBranchId,
            currentShiftId: ns.shift
        }));
        dispatch(ShiftCreatebyDateAction({ startDate, endDate, employeeIds, shifts })).then(({ payload }) => {
            getShifts()
        })
        setOpenDialog(false);
        setNewShifts([{ shift: '', client: {}, branches: [] }]);
    };
    const [shiftFor, setShiftFor] = useState("myOrg")
    return (
        <div className="p-4">
            <ShiftDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                newShifts={newShifts}
                setNewShifts={setNewShifts}
                sortedShifts={sortedShifts}

                clientList={clientList}
                dispatch={dispatch}
                onSave={handleSave}
                shiftFor={shiftFor}
                setShiftFor={setShiftFor}
                shiftForList={[{ id: 'myOrg', name: 'My Organization' }, { id: 'clientOrg', name: 'Client Organization' }]}
                clientBranchList={clientBranchList}
                handleClientBranch={(i, sel) => dispatch(clientBranchListAction({ clientMappedId: sel._id }))}
                handleClientShifts={(i, sel, row) => dispatch(ShiftGetAction({ orgId: row?.client?.clientId }))}
            />

            <div className="flex justify-between mb-4">
                <Typography variant="h5">Duty Roster</Typography>
                <Typography variant="small" color="gray">Manage your employee shifts</Typography>
            </div>

            <FilterPanel
                filterType={filterType}
                setFilterType={setFilterType}
                clientList={clientList}
                clientBranchList={clientBranchList}
                clientDepartments={clientDepartments}
                clientDesignations={clientDesignations}
                employeeList={employeeList}
                selections={{ clientId, setClientId, clientBranchId, setClientBranchId, clientSelectedDeps, setClientSelectedDeps, clientSelectedDesigs, setClientSelectedDesigs, selectedEmployees, setSelectedEmployees }}
            />

            <div className="flex justify-center items-center gap-4 mb-4">
                <IconButton variant="text" onClick={() => setWeekOffset(o => o - 1)}><PiCaretLeftBold /></IconButton>
                <div onClick={() => setShowPicker(p => !p)}>
                    <Typography>{fromDate.format('MMM D, YYYY')} – {toDate.format('MMM D, YYYY')}</Typography>
                </div>
                <IconButton variant="text" onClick={() => setWeekOffset(o => o + 1)}><PiCaretRightBold /></IconButton>
            </div>

            {showPicker && (
                <div className="absolute z-10 p-2 bg-white shadow-lg rounded justify-center">
                    <DatePicker
                        selected={fromDate.toDate()}
                        onChange={date => {
                            const diff = moment(date).startOf('isoWeek').diff(moment().startOf('isoWeek'), 'weeks');
                            setWeekOffset(diff);
                        }}
                        inline
                        dateFormat="yyyy-'W'ww"
                    />
                </div>
            )}

            <RosterGrid
                ref={gridRef}
                employees={employees}
                visibleDays={visibleDays}
                shiftMap={shiftMap}
                selectedCells={selectedCells}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                dragRect={dragRect}
            />
            <div className="flex justify-between items-center mt-4">
  <div>
    <label className="mr-2">Rows per page:</label>
    <select
      value={limit}
      onChange={(e) => {
        setLimit(Number(e.target.value));
        setPage(1); // reset to page 1
      }}
      className="border px-2 py-1 rounded"
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </div>

  <div className="flex gap-2 items-center">
    <button
      disabled={page === 1}
      onClick={() => setPage(p => Math.max(1, p - 1))}
      className="border px-3 py-1 rounded disabled:opacity-50"
    >
      Prev
    </button>
    <span>
      Page {page} of {totalPages}
    </span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      className="border px-3 py-1 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

        </div>
    );
};

export default DustyRoster;