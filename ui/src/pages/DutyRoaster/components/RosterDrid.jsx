import React, { forwardRef } from 'react';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';

const RosterGrid = forwardRef(({
  employees, visibleDays, selectedCells,
  onPointerDown, onPointerUp
}, ref) => {
  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="overflow-auto bg-white rounded-lg shadow"
    >
      <div
        className="grid select-none"
        style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, minmax(120px, 1fr))` }}
      >
        {/* Header Row */}
        <div className="p-3 font-bold border">Employee</div>
        {visibleDays.map(d => (
          <div key={d.format()} className="p-3 text-center border">
            <Typography variant="small">{d.format('ddd')}</Typography>
            <Typography variant="tiny" color="gray">{d.format('DD/MM')}</Typography>
          </div>
        ))}

        {/* Data Rows */}
        {employees.map((emp, i) => (
          <React.Fragment key={emp._id}>
            {/* Employee Info Column */}
            <div className="p-3 border bg-blue-gray-50">
              <Typography className="font-medium">{i + 1}. {emp.name?.firstName || emp.name}</Typography>
              <Typography variant="caption" className="text-gray-600">
                {emp.designation?.designationName}
              </Typography>
            </div>

            {/* Shift Cells */}
            {visibleDays.map(day => {
              const dayKey = day.format('YYYY-MM-DD');
              const isSel = selectedCells.some(c => c.empId === emp._id && c.day === dayKey);

              // Find matching shift record for the date
              const matchedShift = emp?.match?.find(shift =>
                moment(shift?._id?.date).format('YYYY-MM-DD') === dayKey
              );
              const matchedShifts = matchedShift?.shifts || [];

              return (
                <div
                  key={dayKey}
                  data-emp-id={emp._id}
                  data-day={dayKey}
                  className={`p-2 border min-h-[80px] cursor-pointer space-y-1 ${isSel ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
                >
                  {matchedShifts.length > 0 ? (
                    matchedShifts.map((shift, idx) => {
                      const { shiftDetails } = shift || {};
                      return (
                        <div
                          key={idx}
                          className="text-xs rounded px-1 py-0.5 text-center"
                          style={{
                            backgroundColor: shiftDetails?.bgColor || '#eee',
                            color: shiftDetails?.textColor || '#000',
                          }}
                        >
                          <div className="font-semibold">{shiftDetails?.name}</div>
                          <div className="text-[10px]">{`${shiftDetails?.startTime}–${shiftDetails?.endTime}`}</div>
                        </div>
                      );
                    })
                  ) : (
                    <Typography variant="caption" color="gray">No Shift</Typography>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

export default RosterGrid;
