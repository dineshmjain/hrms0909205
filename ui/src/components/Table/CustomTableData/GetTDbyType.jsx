import React from "react";
import TypeObject from "./TypeObject";
import TypeImage from "./TypeImage";
import TypeDate from "./TypeDate";
import TypeTime from "./TypeTime";
import TypeCount from "./TypeCount";
import TypeFn from "./TypeFn";
import TypeChip from "./TypeChip";
import TypeNone from "./TypeNone";


const GetTDbyType = ({
  data,
  labels,
  bg,
  header,
  idx,
  rowSpan,
  css,
  mainData,
  subIdx,
  lockedIndex,
}) => {
  const isLocked = lockedIndex?.includes(header)
    ? ` z-10 sticky left-0 right-0  `
    : "   ";

  switch (labels?.[header]?.type) {
    case "object":
      return (
        <TypeObject
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
    case "image":
      return (
        <TypeImage
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
    case "date":
      return (
        <TypeDate
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
    case "time":
      return (
        <TypeTime
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
    case "count":
      return (
        <TypeCount
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
    case "function":
      return (
        <TypeFn
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          mainData={mainData}
          subIdx={subIdx}
        />
      );
    case "chip":
      console.log({data, labels, bg, header, idx, rowSpan, css, isLocked,mainData,subIdx});
      
      return (
        <TypeChip
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          mainData={mainData}
          subIdx={subIdx}
        />
      );
    default:
      return (
        <TypeNone
          data={data}
          labels={labels}
          bg={bg}
          header={header}
          idx={idx}
          rowSpan={rowSpan}
          css={css + " " + isLocked}
          subIdx={subIdx}
        />
      );
  }
};

export default GetTDbyType;
