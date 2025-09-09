import React from "react";
import CopyOnClick from "../../CopyonClick/CopyOnClick";

const TypeDate = ({ data, header, labels, bg, idx, rowSpan, subIdx, css }) => {
  if (labels?.[header]?.compareTo) {
    let feild = labels?.[header]?.compareTo;
    if (parseInt(data?.[header]) < data?.[feild]) {
      css = "text-red-500 font-medium";
    }
  }
  const date = new Date(data?.[header]);

  // Format the date as 'DD-MM-YYYY'
  const formattedDate = date.toLocaleDateString("en-GB").split("/").join("-");

  return (
    <td
      key={subIdx || idx}
      className={`px-4 py-2 maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover ${css}`}
      rowSpan={rowSpan}
    >
      <CopyOnClick text={formattedDate}>
        <span
          className={`px-2 p-1 rounded-sm ${
            data?.[header] < 0 && "text-red-500"
          }`}
          style={{ background: bg }}
        >
          {labels?.[header]?.prefix} {formattedDate} {labels?.[header]?.postfix}{" "}
          {data?.[labels?.[header]?.Uom]}
        </span>
      </CopyOnClick>
    </td>
  );
};

export default TypeDate;
