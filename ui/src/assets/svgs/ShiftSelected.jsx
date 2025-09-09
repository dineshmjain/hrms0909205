import * as React from "react";
const SVGComponent = (props) => (
  <svg
    fill="#000000"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    id="clock"
    data-name="Flat Line"
    xmlns="http://www.w3.org/2000/svg"
    className="icon flat-line"
    {...props}
  >
    <circle
      id="secondary"
      cx={12}
      cy={12}
      r={9}
      style={{
        fill: "#f04f31",
        strokeWidth: 2,
      }}
    />
    <polyline
      id="primary"
      points="12 7 12 12 14 15"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <circle
      id="primary-2"
      data-name="primary"
      cx={12}
      cy={12}
      r={9}
      style={{
        fill: "none",
        stroke: "#085581",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </svg>
);
export default SVGComponent;
