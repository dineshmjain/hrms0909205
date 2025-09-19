import { Typography } from "@material-tailwind/react";
import WeekOffCard from "./WeekOffCard";
import ShiftCard from "./ShiftCard";

const EmployeeShiftGrid = ({
  visibleDays,
  holidayColumnColors,
  shiftByDates,
  selectedCells,
  setSelectedCells,
  setIsWeekOff,
  checkIsShiftAlreadyExists,
  manageSwap,
  dragRect,
  gridRef,
  onPointerDown
}) => {
  return (
    <div>
      {/* Header row */}
      <div className="relative bg-white rounded-lg shadow-inner">
        <div className="grid grid-cols-[160px_repeat(7,minmax(100px,1fr))] border-b border-gray-300 bg-white">
          <div className="p-2 font-semibold text-gray-700">Employee</div>
          {visibleDays.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const color = holidayColumnColors[dateStr];
            return (
              <div
                key={dateStr}
                className="p-2 text-center font-medium relative h-2"
                style={{
                  backgroundColor: color?.bg || "transparent",
                  color: color?.text || "#374151"
                }}
              >
                {day.format("ddd D")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div
        ref={gridRef}
        onPointerDown={onPointerDown}
        className="relative overflow-auto h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] 
                   bg-white rounded-lg shadow-inner 
                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {/* Drag rectangle overlay */}
        {dragRect && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-200/30 pointer-events-none z-50"
            style={{
              left: `${dragRect.x}px`,
              top: `${dragRect.y}px`,
              width: `${dragRect.width}px`,
              height: `${dragRect.height}px`
            }}
          />
        )}

        {/* Employee rows */}
        {shiftByDates?.data?.map((emp) => (
          <div
            key={emp._id}
            className="grid grid-cols-[200px_repeat(7,minmax(100px,1fr))] border-b border-gray-300"
          >
            {/* Employee name */}
            <div className="p-2 text-gray-800 font-semibold text-sm">
              {emp.name.firstName} {emp.name.lastName}
            </div>

            {/* Day cells */}
            {visibleDays.map((day) => {
              const dateStr = day.format("YYYY-MM-DD");
              const color = holidayColumnColors[dateStr];
              const shifts = emp.dates?.[dateStr] || [];

              const isSelected = selectedCells.some(
                (cell) => cell.empId === emp._id && cell.day === dateStr
              );

              return (
                <div
                  key={dateStr}
                  style={{
                    backgroundColor: color?.bg || "white",
                    color: color?.text || "#111827"
                  }}
                  className={`p-2 -ml-1 items-center text-center border-l border-gray-300 
                              cursor-pointer select-none 
                              ${isSelected ? "bg-blue-100 border-blue-300" : ""}`}
                  data-emp-id={emp._id}
                  data-shift-id={shifts.length}
                  data-empshift={JSON.stringify(emp)}
                  data-day={dateStr}
                  onClick={() => {
                    setIsWeekOff(false);
                    setSelectedCells((prev) => {
                      const exists = prev.find(
                        (cell) => cell.empId === emp._id && cell.day === dateStr
                      );
                      return exists
                        ? prev.filter(
                            (cell) =>
                              !(cell.empId === emp._id && cell.day === dateStr)
                          )
                        : [...prev, { empId: emp._id, day: dateStr }];
                    });
                    checkIsShiftAlreadyExists(emp, dateStr);
                  }}
                >
                  {/* Render shifts */}
                  {shifts.length > 0 ? (
                    <div className="flex flex-col gap-1 items-center justify-center">
                      {shifts.map((shift) => {
                        {console.log('sss', shift)}
                        const shiftRef =
                          shiftByDates.references.shiftId?.[shift.shiftId] || {};
                        const clientRef =
                          shift.clientMappedId &&
                          shiftByDates.references.clientId?.[shift.clientMappedId];
                        const clientBranch =
                          clientRef?.branch?.[shift.clientBranchId];
                        const subOrg =
                          shift.orgId &&
                          shift.subOrgId &&
                          shiftByDates.references.orgId?.[shift.subOrgId];
                        const subOrgBranch = subOrg?.branch?.[shift.branchId];

                        // console.log('hello',shiftByDates.references.orgId?.[shift.subOrgId])
                        console.log('hello', shift.subOrgId)

                        const startTime = shift.startTime || shiftRef.startTime;
                        const endTime = shift.endTime || shiftRef.endTime;

                        const leaveRef =
                          shiftByDates.references.leaves?.[shift.userLeaveId];
                        const holidayRef =
                          shiftByDates.references.holidays?.[shift.holidayId];

                        // Leaves
                        if (leaveRef) {
                          return (
                            <div
                              key={shift._id}
                              className="flex flex-col px-3 py-2 rounded-lg w-full shadow 
                                         border-l-4 border-[#4C9AFF] bg-blue-50 text-left"
                            >
                              <div className="text-[#00264D] font-semibold text-sm">
                                {leaveRef.policyName}
                              </div>
                              <div className="text-[#4C9AFF] text-xs mt-1">
                                Applied For {leaveRef.type} day
                              </div>
                            </div>
                          );
                        }

                        // Week off / normal shift / holiday
                        return (
                          <div key={shift._id}>
                            {shift?.shiftId === "WO" ? (
                              <WeekOffCard
                                emp={emp}
                                dateStr={dateStr}
                                shiftByDates={shiftByDates}
                                manageSwap={manageSwap}
                              />
                            ) : (
                              <>
                                {shift?.shiftId && (
                                  <ShiftCard
                                    emp={emp}
                                    dateStr={dateStr}
                                    shiftRef={shiftRef}
                                    clientRef={clientRef}
                                    clientBranch={clientBranch}
                                    subOrg={subOrg}
                                    subOrgBranch={subOrgBranch}
                                    shiftByDates={shiftByDates}
                                    manageSwap={manageSwap}
                                    startTime={startTime}
                                    endTime={endTime}
                                  />
                                )}
                                {shift?.holidayId && (
                                  <Typography className="text-[#660000]">
                                    {holidayRef.name}
                                  </Typography>
                                )}
                              </>
                            )}
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
  );
};

export default EmployeeShiftGrid;
