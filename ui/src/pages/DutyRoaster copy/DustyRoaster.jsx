import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Dialog, DialogBody, DialogHeader, IconButton, Typography } from '@material-tailwind/react';
import { PiCaretLeftBold, PiCaretRightBold, PiPlusBold, PiTrashFill } from 'react-icons/pi';

import FilterPanel from './components/FilterPanel';
import { useSelector } from 'react-redux';
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
import { subOrgListApi } from '../../apis/Organization/Organization';
import { BranchGetApi } from '../../apis/Branch/Branch';
import { ShiftGetApi } from '../../apis/Shift/Shift';
import { clientListApi } from '../../apis/Client/Client';
import { clientBranchListApi } from '../../apis/Client/ClientBranch';
import { removeEmptyStrings } from '../../constants/reusableFun';
import { ShiftCreatebyDateAction, ShiftListbyDateAction } from '../../redux/Action/Shift/ShiftAction';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import TooltipMaterial from '../../components/TooltipMaterial/TooltipMaterial';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuSkipBack, LuSkipForward } from 'react-icons/lu';
import ShiftDialog from './components/ShiftDialog';

const isIntersecting = (r1, r2) =>
  r1.x < r2.x + r2.width &&
  r1.x + r1.width > r2.x &&
  r1.y < r2.y + r2.height &&
  r1.y + r1.height > r2.y;

const DustyRoaster = () => {
  const [filterType, setFilterType] = useState('myOrg');
  const { user } = useSelector((state) => state?.user)
  const [openDialog, setOpenDialog] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedFilterType, setFilterSelectedType] = useState('myOrg');
  const [finalFilterData, setFinalFilterData] = useState([]);
  const { employeeList } = useSelector((state) => state?.employee);
  const [employees, setEmployees] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [dragRect, setDragRect] = useState(null);
  const [clientList, setClientList] = useState([])
  const [branchList, setBranchList] = useState([])
  const [shiftList, setShiftList] = useState([])
  const [subOrgList, setSubOrgList] = useState([])
  const [forList, setForList] = useState([{ id: 1, name: 'My Organization', value: "myOrg" }, { id: 2, name: 'Client Organization', value: "clientOrg" }])
  const pickerRef = useRef(null);
  const gridRef = useRef(null);
  const { shiftByDates, totalRecord, nextPage, loading } = useSelector((state) => state?.shift)
  const [selectedEmployees, setSelectedEmployees] = useState([])

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersData, setFiltersData] = useState({})
  const dispatch = useDispatch()
  const [forId, setForId] = useState("myOrg")
  const [inputPageValue, setInputPageValue] = useState(1)
  const fromDate = useMemo(
    () => moment().startOf('isoWeek').add(weekOffset, 'weeks'),
    [weekOffset]
  );
  const toDate = useMemo(() => moment(fromDate).endOf('isoWeek'), [fromDate]);

  const visibleDays = useMemo(() => {
    const days = toDate.diff(fromDate, 'days') + 1;
    return Array.from({ length: days }, (_, i) =>
      moment(fromDate).add(i, 'days')
    );
  }, [fromDate, toDate]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const rect = gridRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragRect(null);
    setSelectedCells([]);
  };

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
    [dragStart]
  );

  const onPointerUp = useCallback(() => {
    if (!dragStart || !dragRect) return setDragStart(null);
    const rect = gridRef.current.getBoundingClientRect();
    const selected = [];

    gridRef.current.querySelectorAll('[data-emp-id]').forEach((cell) => {
      const cr = cell.getBoundingClientRect();
      const rel = {
        x: cr.left - rect.left,
        y: cr.top - rect.top,
        width: cr.width,
        height: cr.height,
      };
      if (isIntersecting(dragRect, rel)) {
        selected.push({
          empId: cell.getAttribute('data-emp-id'),
          day: cell.getAttribute('data-day'),
        });
      }
    });

    setSelectedCells(selected);
    setDragStart(null);
    setDragRect(null);

    if (selected.length) setOpenDialog(true);
  }, [dragStart, dragRect]);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);
  const memoizedFiltersData = useMemo(() => filtersData)
  const timeoutRef = useRef();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      getShifts();
    }, 200); // debounce delay

    return () => clearTimeout(timeoutRef.current);
  }, [filterType, weekOffset, page]);


  useEffect(() => {
    if (totalRecord != null && limit > 0) {
      setTotalPages(Math.ceil(totalRecord / limit));
    }
  }, [totalRecord, limit]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [shiftForms, setShiftForms] = useState(
    [{ forId: '', orgId: '', clientId: '', clientBranchId: '', shiftId: '', branches: [], shifts: [],startTime:'',endTime:'' }]

  );
  console.log(shiftForms)

  const doTimeRangesOverlap = (startA, endA, startB, endB) => {
    return startA < endB && startB < endA;
  };

  // Convert "HH:mm" to minutes for easier comparison
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const updateShiftForm = (index, field, value) => {
    setShiftForms((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      console.log(updated, 'updated shift form', field, value)
      if (field === 'forId' && value === 'clientOrg') {
        getClientsForDialog(value, updated[index], index);
      }
      if (field === 'forId' && value === 'myOrg') {
        getOrgsForDialog(value, updated[index], index);
      }
      // Update branches/shifts if necessary
      if (field === 'orgId' || field === 'clientId') {
        getBranchList(value, updated[index], index);
      }

      if (field === 'branchId' || field === 'clientBranchId') {
        getshiftList(value, updated[index], index);
      }

      // If shift is being updated, validate against other shifts
      if (field === 'shiftId') {
        const currentForm = updated[index];
        const selectedShift = currentForm.shifts?.find(s => s._id === value);

        if (selectedShift) {
          const newStart = timeToMinutes(selectedShift.startTime);
          const newEnd = timeToMinutes(selectedShift.endTime);

          for (let i = 0; i < updated.length; i++) {
            if (i === index) continue;

            const otherForm = updated[i];
            const otherShift = otherForm.shifts?.find(s => s._id === otherForm.shiftId);
            if (!otherShift) continue;

            const otherStart = timeToMinutes(otherShift.startTime);
            const otherEnd = timeToMinutes(otherShift.endTime);

            if (doTimeRangesOverlap(newStart, newEnd, otherStart, otherEnd)) {
              toast.error(`Shift time overlaps with another shift for ${otherForm.shiftName}`);
              // Revert the change
              updated[index][field] = '';
              break;
            }
          }
        }
      }

      return updated;
    });
  };
  const getClientsForDialog = async (id, forData, index) => {
    try {
      const response = await clientListApi({});
      console.log(response?.data, 'client =================================================list')
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["clientList"] = response?.data;
        return updated;
      });
    }
    catch (err) {
      console.log(err)
    }

  }

  const getOrgsForDialog = async (id, forData, index) => {
    try {
      const response = await subOrgListApi({});
      console.log(response?.data, 's =================================================list')
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["subOrgList"] = response?.data;
        return updated;
      });
    }
    catch (err) {
      console.log(err)
    }

  }

  const removeShiftForm = (index) => {
    setShiftForms((prev) => prev.filter((_, i) => i !== index));
  };
  const getBranchList = async (id, forData, index) => {
    try {
      console.log(forData, 'upd')
      const params = user?.modules?.['suborganization'].r ? forData?.forId == "clientOrg" ? { 'clientMappedId': forData?.clientMappedId } : { 'subOrgId': id } : {}
      console.log(params, "+++++++++++++++++++++++++++++++++++++++++++++++++")

      const response = forData?.forId == "myOrg" ? await BranchGetApi(params) : await clientBranchListApi(params)
      console.log(response?.data, params, "+++++++++++++++++++++++++++++++++++++++++++++++++")
      setBranchList(response?.data)
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["branches"] = response?.data;
        return updated;
      });

    }
    catch (err) {
      console.log(err)
    }
  }
  const getshiftList = async (id, forData, index) => {
    try {
      console.log(forData, 'upd')
      const params = forData?.forId == "clientOrg" ? { 'orgId': forData?.clientId } : {}
      const response = await ShiftGetApi(params)
      console.log(response?.data)
      let baseData = response?.data?.map((data) => { return ({ ...data, mname: `${data?.name} ${data?.startTime} ${data?.endTime}` }) })
      // setShiftList(baseData)
      setShiftForms((prev) => {
        const updated = [...prev];
        updated[index]["shifts"] = baseData;
        return updated;
      });

    }
    catch (err) {
      console.log(err)
    }
  }
  const handleShiftAssign = () => {
    const employeeIds = [...new Set(selectedCells.map(c => c.empId))];
    const selectedDates = selectedCells.map(c => c.day);
    console.log(employeeIds, selectedDates, 'selectedCells')
    const sortedDates = selectedDates.sort((a, b) => new Date(a) - new Date(b));
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    console.log(startDate, endDate, 'sortedDates')
    let filteredData = removeEmptyStrings(shiftForms)
    console.log(filteredData)
    filteredData = filteredData?.map((data) => {
      const { shifts, branches, forId, shiftId, clientList,subOrgList, shiftName,startTime,endTime, ...rest } = data

      return { ...rest, currentShiftId: data?.shiftId }
    })

    const uniqueCells = selectedCells.filter(
      (cell, index, self) =>
        index === self.findIndex((c) => c.empId === cell.empId && c.day === cell.day)
    );
    console.log(filteredData, employeeIds, 'recived')


    const finalData = { startDate: startDate, endDate: endDate, shifts: filteredData, employeeIds: employeeIds }
    console.log(finalData)

    dispatch(ShiftCreatebyDateAction({ ...finalData })).then(({ payload }) => {
      getShifts()
    })

    setOpenDialog(false);
    setShiftForms([{ clientId: '', clientBranchId: '', shiftId: '' }]);
  };



  useEffect(() => {
    console.log(forId, 'type Selected', user)
    if (user?.modules?.['suborganization']?.r && forId == "myOrg") {
      console.log("sub Orgs ")
      getSubOrgList()
    }
    if (forId == "clientOrg") {
      console.log("client s ")
      getClients()
    }
  }, [forId])
  console.log(forId, "================`=========================== typ Of forId in shift Dialog")
  const getSubOrgList = async () => {
    try {
      const response = await subOrgListApi({})
      console.log(response?.data, 'd')
      setSubOrgList(response?.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  const getClients = async () => {
    try {
      const response = await clientListApi({})
      console.log(response?.data, 'client =================================================list')
      setClientList(response?.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  console.log("shiftForms==========================================================", shiftByDates)
  const getShifts = async () => {
    let baseParams = {
      startDate: fromDate.format('YYYY-MM-DD'),
      endDate: toDate.format('YYYY-MM-DD'),
      limit,
      page,
      ...filtersData,
      orgIds: user?.modules?.['suborganization']?.r ?  typeof  filtersData?.orgIds =='string' [filtersData?.orgIds]: '',
    };

    let cleanedParams = removeEmptyStrings(baseParams);

    if (filterType === 'clientOrg') {
      delete cleanedParams.branchIds;
      delete cleanedParams.orgIds;
      cleanedParams.clientMappedIds = filtersData?.clientMappedIds;
    } else {
      delete cleanedParams.clientMappedIds;
      delete cleanedParams.clientBranchIds;
    }

    console.log(cleanedParams, '*****************************************************Final Params');
    if (cleanedParams?.orgIds || cleanedParams?.branchIds || cleanedParams?.clientMappedIds || cleanedParams?.clientBranchIds) {

      dispatch(ShiftListbyDateAction(cleanedParams));
    }
  };

  const searchFunction = () => {
    getShifts()
  }
  //statrt and end
  const start = totalRecord === 0 ? 0 : page * limit;
  const end = totalRecord === 0 ? 0 : Math.min(totalRecord, (page + 1) * limit);

  const pageData = shiftByDates?.data || [];
  return (
    <div className="flex flex-col gap-4">
      <ShiftDialog setForId={setForId} subOrgList={subOrgList} handleShiftAssign={handleShiftAssign} openDialog={openDialog} setOpenDialog={setOpenDialog} forList={forList} setShiftForms={setShiftForms} shiftForms={shiftForms} updateShiftForm={updateShiftForm} />
      {/* Header */}
      <div><Typography variant="h4" color="blue-gray" className="text-xl">  Duty Roster </Typography>
        <Typography variant="small" color="gray"> Manage your employee shifts</Typography>
      </div>
       <div className="bg-white p-4 shadow-hrms rounded-md">
        <div className="text-gray-700 font-semibold mb-2 text-[14px]">
          Filters
        </div>
      <FilterPanel setPage={setPage} page={page} filterType={filterType} setFilterType={setFilterType} finalFilterData={finalFilterData} setFinalFilterData={setFinalFilterData} filtersData={filtersData} setFiltersData={setFiltersData} search={searchFunction} />
      </div>
      <div className="bg-white p-4 rounded-md shadow-md relative">
        <div className="flex justify-center items-center gap-4">
          <IconButton size="sm" variant="filled" className="bg-primary" onClick={() => setWeekOffset((o) => o - 1)}>
            <PiCaretLeftBold className="text-white" />
          </IconButton>

          <div onClick={() => setShowPicker((p) => !p)} className="cursor-pointer px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 bg-white shadow-sm"
          >
            <Typography variant="small" color="gray">
              {fromDate.format('MMM D, YYYY')} – {toDate.format('MMM D, YYYY')}
            </Typography>
          </div>

          <IconButton size="sm" variant="filled" className="bg-primary" onClick={() => setWeekOffset((o) => o + 1)}>
            <PiCaretRightBold className="text-white" />
          </IconButton>
        </div>

        {showPicker && (
          <div ref={pickerRef} className="absolute top-14 left-1/2 transform -translate-x-1/2 z-20 bg-white shadow-2xl rounded-lg p-2 border">
            <DatePicker
              selected={fromDate.toDate()}
              onChange={(date) => {
                const diff = moment(date).startOf('isoWeek').diff(moment().startOf('isoWeek'), 'weeks');
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
              <div key={day.format('YYYY-MM-DD')} className="p-2 text-center font-medium text-gray-700">
                {day.format('ddd D')}
              </div>
            ))}
          </div>

          {shiftByDates?.data?.map((emp) => (
            <div
              key={emp._id}
              className="grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] border-b border-gray-200"
            >
              <div className="p-2 text-gray-800">
                {emp.name.firstName} {emp.name.lastName}
              </div>

              {visibleDays.map((day) => {
                const dateStr = day.format('YYYY-MM-DD');
                const shifts = emp.dates && emp.dates[dateStr] ? emp.dates[dateStr] : [];
                const isSelected = selectedCells.some(
                  (cell) => cell.empId === emp._id && cell.day === dateStr
                );

                return (
                  <div
                    key={dateStr}
                    data-emp-id={emp._id}
                    onClick={() => {
                      setOpenDialog(true)
                      setSelectedCells((prev) => {
                        const existing = prev.find(cell => cell.empId === emp._id && cell.day === dateStr);
                        if (existing) {
                          return prev.filter(cell => !(cell.empId === emp._id && cell.day === dateStr));
                        } else {
                          return [...prev, { empId: emp._id, day: dateStr }];
                        }
                      })
                    }}
                    data-day={dateStr}
                    className={`p-2 text-center border-l border-gray-100 cursor-pointer select-none ${isSelected ? 'bg-blue-100 border-blue-300' : ''
                      }`}
                  >
                    {shifts.length > 0 ? (
                      <div className="flex flex-col gap-1 items-center">
                        {shifts.map((shift) => {
                          console.log(shift, filterType, 'trei')
                          const shiftRef = shiftByDates.references.shiftId[shift.shiftId] || {};
                          const clientRef = shift.clientMappedId && shiftByDates.references.clientId[shift.clientMappedId];
                          const clientBranch = clientRef?.branch?.[shift.clientBranchId];
                          const subOrg = shift.orgId && shift.subOrgId && shiftByDates.references.orgId[shift.subOrgId];
                          const subOrgBranch = subOrg?.branch?.[shift.branchId];
                          const isSameOrg = filterType === 'myOrg'
                            ? filtersData?.orgIds?.includes(shift.subOrgId || shift.orgId)
                            : filtersData?.clientMappedIds?.includes(shift.clientMappedId);

                          console.log(isSameOrg, 'isSameOrg')
                          return (
                            <div
                              key={shift._id}
                              className="text-xs font-medium px-3 py-1 rounded w-full text-left shadow-md"
                              style={{
                                backgroundColor: isSameOrg ? shiftRef.bgColor : '#e0e0e0',
                                color: isSameOrg ? shiftRef.textColor : '#000',
                              }}
                            >
                              <div className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between">{shiftRef.name || ''}
                                <div>
                                  {shiftRef.startTime || ''} - {shiftRef.endTime || ''}
                                </div>
                              </div>
                              <div
                                className="font-normal mt-1 space-y-0.5 flex flex-wrap gap-1 justify-between"
                                style={{ color: isSameOrg ? (shiftRef.textColor || '#000') + '77' : '#00000077' }}
                              >
                                {clientRef?.name && <div>{clientRef.name}</div>}
                                {clientBranch?.name && <div>{clientBranch.name}</div>}
                                {subOrg?.name && <div>{subOrg.name}</div>}
                                {subOrgBranch?.name && <div>{subOrgBranch.name}</div>}
                              </div>
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

      <div className="flex gap-2 w-full items-center justify-between maxsm:flex-col bg-white p-2 rounded-md shadow-hrms">
        <div className="text-sm text-gray-700">
          {loading
            ? "Loading Data..."
            : `Showing Data from ${start} - ${end} of ${totalRecord}`}
        </div>

        <div className="flex gap-2 flex-wrap justify-end maxsm:w-full maxsm:justify-start">
          <TooltipMaterial content="First Page">
            <button
              disabled={page === 0}
              className="pagination-btn"
              onClick={() => setPage(0)}
            >
              <LuSkipBack className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          <TooltipMaterial content="Previous Page">
            <button
              disabled={page === 0}
              className="pagination-btn"
              onClick={() => setPage(page - 1)}
            >
              <IoIosArrowBack className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          <TooltipMaterial content="Page No">
            <input
              type="number"
              className="text-center h-8 rounded-md bg-popLight px-2 shadow-hrms hover:shadow-md"
              min={1}
              max={totalPages}
              value={inputPageValue}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);

                if (!val || isNaN(val)) {
                  setInputPageValue("");
                  return;
                }

                if (val >= 1 && val <= totalPages) {
                  setInputPageValue(val);
                  setPage(val - 1);
                } else {
                  setInputPageValue(page + 1);
                  toast.error(`Page number must be between 1 and ${totalPages}`);
                }
              }}
            />
          </TooltipMaterial>

          <TooltipMaterial content="Next Page">
            <button
              // disabled={page >= totalPages}
              className="pagination-btn"
              onClick={() => { setPage(page + 1) }}
            >
              <IoIosArrowForward className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          <TooltipMaterial content="Last Page">
            <button
              // disabled={page >= totalPages - 1}
              className="pagination-btn"
              onClick={() => setPage(totalPages)}
            >
              <LuSkipForward className="w-4 h-4" />
            </button>
          </TooltipMaterial>

          <TooltipMaterial content="Rows per page">
            <select
              name="NumberOfRows"
              className="bg-popLight rounded-md h-8 px-2"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(0); // reset to first page on limit change
              }}
            >
              <option value={10} disabled={totalRecord < 10}>10</option>
              <option value={25} disabled={totalRecord < 25}>25</option>
              <option value={50} disabled={totalRecord < 50}>50</option>
              <option value={100} disabled={totalRecord < 100}>100</option>
            </select>
          </TooltipMaterial>
        </div>
      </div>


    </div>
  );
};

export default DustyRoaster;