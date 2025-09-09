import React from "react";

const TableBodySkeleton = ({ rows = 5, cols = 4, cellHeight = "h-5" }) => {
  return (
    <tbody>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="border-t">
          {[...Array(cols)].map((_, colIndex) => (
            <td key={colIndex} className="p-3">
              <div
                className={`bg-gray-300 rounded ${cellHeight} w-full animate-pulse `}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBodySkeleton;
