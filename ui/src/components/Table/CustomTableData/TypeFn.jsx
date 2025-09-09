import React from "react";
import CopyOnClick from "../../CopyonClick/CopyOnClick";

const TypeFn = ({
  data,
  header,
  labels,
  bg,
  idx,
  rowSpan,
  css = "",
  mainData,
  subIdx,
}) => {
  if (labels?.[header]?.compareTo) {
    let feild = labels?.[header]?.compareTo;
    if (parseInt(data?.[header]) < data?.[feild]) {
      css = "text-red-500 font-medium";
    }
  }

  let dataToShow = labels?.[header]?.data(data, idx, mainData, subIdx) || "";

  return (
    <td
      key={subIdx || idx}
      className={`  maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover font-normal ${css}`}
      rowSpan={rowSpan}
    >
      <span
        className={` rounded-sm ${data?.[header] < 0 && "text-red-500"}`}
        style={{ background: bg }}
      >
        {dataToShow}
      </span>
    </td>
  );
};

export default TypeFn;
