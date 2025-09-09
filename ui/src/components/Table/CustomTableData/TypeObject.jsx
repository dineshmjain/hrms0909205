import React from "react";
import CopyOnClick from "../../CopyonClick/CopyOnClick";

const TypeObject = ({
  data,
  header,
  labels,
  bg,
  idx,
  rowSpan,
  css,
  subIdx,
}) => {
  const labelConfig = labels?.[header];
  const value = getNestedValue(
    data,
    labelConfig?.objectName,
    labelConfig?.keyName || header
  );

  return (
    <td
      className={`px-6 py-4   maxsm:px-2 maxsm:py-2 bg-tableBg group-hover:bg-tableBgHover font-normal ${css} `}
      key={`${subIdx || idx}_${header}`}
      rowSpan={rowSpan}
    >
      {/* <CopyOnClick text={data?.[labels?.[header]?.objectName]?.[header]}>
        <span
          className={`px-2 p-1 rounded-sm ${
            data?.[header] < 0 && "text-red-500"
          }`}
          style={{ background: bg }}
        >
          {labels?.[header]?.prefix}{" "}
          {data?.[labels?.[header]?.objectName]?.[header] ?? "-"}{" "}
          {labels?.[header]?.postfix} {data?.[labels?.[header]?.Uom]}
        </span>
      </CopyOnClick> */}
      <CopyOnClick text={value}>
        <span
          className={`px-2 p-1 rounded-sm ${value < 0 ? "text-red-500" : ""}`}
          style={{ background: bg }}
        >
          {labelConfig?.prefix} {value ?? "-"} {labelConfig?.postfix}{" "}
          {labelConfig?.Uom}
        </span>
      </CopyOnClick>
    </td>
  );
};
const getNestedValue = (data, objectPath, key) => {
  if (!objectPath) return data?.[key] ?? "-";

  return (
    objectPath.split(".").reduce((acc, cur) => acc?.[cur], data)?.[key] ?? "-"
  );
};

export default TypeObject;
