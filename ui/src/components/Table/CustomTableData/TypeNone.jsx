import React from "react";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";
import CopyOnClick from "../../CopyonClick/CopyOnClick";

const TypeNone = ({
  data,
  header,
  labels,
  bg,
  idx,
  rowSpan,
  css = "",
  subIdx,
}) => {
  if (labels?.[header]?.compareTo) {
    let feild = labels?.[header]?.compareTo;
    if (parseInt(data?.[header]) < data?.[feild]) {
      css = "text-red-500 font-medium";
    }
  }

  return (
    <td
      key={subIdx || idx}
      className={`  px-4 py-2 maxsm:px-2 maxsm:py-2   bg-tableBg group-hover:bg-tableBgHover font-normal ${css} ${bg}`}
      rowSpan={rowSpan}
    >
      <span
        className={`px-2 p-1  flex items-center justify-center gap-2 rounded-md  ${
          data?.[header] < 0 && "text-red-500"
        }`}
        style={{ background: bg }}
      >
        <CopyOnClick text={data?.[header]}>
          {labels?.[header]?.prefix} {data?.[header] ?? "-"}{" "}
          {labels?.[header]?.postfix} {data?.[labels?.[header]?.Uom]}
          {data?.[labels?.[header]?.extras] && (
            <div className=" font-semibold text-gray-700 max-w-[100px] truncate text-nowrap  overflow-x-hidden">
              {" "}
              {data?.[labels?.[header]?.extras]}
            </div>
          )}
        </CopyOnClick>
      </span>
    </td>
  );
};

export default TypeNone;
