import * as React from "react";
const SVGComponent = (props) => (
  <svg
    fill="#000000"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    id="user"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <path
      id="secondary"
      d="M9,15h6a5,5,0,0,1,5,5v0a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1v0a5,5,0,0,1,5-5Z"
      style={{
        fill: "none",
        stroke: "#076da8ff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1.5,
      }}
    />
    <circle
      id="primary"
      cx={12}
      cy={7}
      r={4}
      style={{
        fill: "none",
        stroke: "#085581",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1.5,
      }}
    />
  </svg>
);
export default SVGComponent;
