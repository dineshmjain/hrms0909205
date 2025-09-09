import React from "react";
import Chips from "../../Chips/Chips";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";

const TypeChip = ({
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
      className={`px-4 py-2 maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover ${css} ${bg}`}
      rowSpan={rowSpan}
    >
      <span
        className={`px-2   flex items-center justify-center gap-2 rounded-md  `}
      >
        {/* <span
        className="p-1 rounded-md px-2"
          style={{ background: labels?.[header]?.colorData?.[data?.[header]] }}
        >
          {labels?.[header]?.prefix} {data?.[header] ?? "-"}{" "}
          {labels?.[header]?.postfix} {data?.[labels?.[header]?.Uom]}
        </span> */}

        <Chips
          text={data?.[header] ?? "-"}
          css={'capitalize'}
          color={labels?.[header]?.colorData?.[data?.[header]] || labels?.[header]?.colorData?.['anyColor']}
          textColor={labels?.[header]?.textColor?.[data?.[header]] || labels?.[header]?.textColor?.['anyColor']}
          toolTipText={data[header+'Error'] || null}
        />

        {data?.[labels?.[header]?.extras] && (
          <div className=" font-semibold text-gray-700 max-w-[100px] truncate text-nowrap  overflow-x-hidden">
            {" "}
            {data?.[labels?.[header]?.extras]}
          </div>
        )}
      </span>
    </td>
  );
};

export default TypeChip;
