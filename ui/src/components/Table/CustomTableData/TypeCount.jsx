import React from "react";

const TypeCount = ({ data, header, labels, bg, idx, rowSpan,css="",subIdx }) => {

  if (labels?.[header]?.compareTo) {
    let feild = labels?.[header]?.compareTo;
    if (parseInt(data?.[header]) < data?.[feild]) {
      css = "text-red-500 font-medium";
    }
  }

  return (
    <td
      key={subIdx || idx}
      className={`px-4 py-2 maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover ${css}`}
      rowSpan={rowSpan}
    >
      <span
        className={`px-2 p-1 rounded-sm ${
          data?.[header] < 0 && "text-red-500"
        }`}
        style={{ background: bg }}
      >
        {labels?.[header]?.prefix} {data?.[header]?.length} {labels?.[header]?.postfix}{" "}
        {data?.[labels?.[header]?.Uom]}
      </span>
    </td>
  );
};

export default TypeCount;
