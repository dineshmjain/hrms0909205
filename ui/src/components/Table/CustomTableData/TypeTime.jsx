import moment from "moment";
import React from "react";
import CopyOnClick from "../../CopyonClick/CopyOnClick";

const TypeTime = ({ data, header, labels, bg, idx, rowSpan, subIdx, css }) => {
  if (labels?.[header]?.compareTo) {
    let feild = labels?.[header]?.compareTo;
    if (parseInt(data?.[header]) < data?.[feild]) {
      css = "text-red-500 font-medium";
    }
  }

  const getTime = (time, givenformat) => {
    return time ? moment(data?.[header])?.format(givenformat) : "-";
  };

  const format = labels?.[header]?.format || "hh:mm A";
  return (
    <td
      key={subIdx || idx}
      className={`px-4 py-2 maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover ${css}`}
      rowSpan={rowSpan}
    >
      <CopyOnClick text={getTime(data?.[header], format)}>
        <span
          className={`px-2 p-1 rounded-sm ${
            data?.[header] < 0 && "text-red-500"
          }`}
          style={{ background: bg }}
        >
          {labels?.[header]?.prefix} {getTime(data?.[header], format)}{" "}
          {labels?.[header]?.postfix} {data?.[labels?.[header]?.Uom]}
        </span>
      </CopyOnClick>
    </td>
  );
};

export default TypeTime;
