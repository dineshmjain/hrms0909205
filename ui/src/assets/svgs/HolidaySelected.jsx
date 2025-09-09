import * as React from "react";
const SVGComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={256}
    height={256}
    fill="none"
    viewBox="0 0 256 256"
    {...props}
  >
    <path stroke="#085581" strokeWidth={16} d="M32 32h192" />
    <path
      stroke="#085581"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M16 48v176M240 48v176M32 32c-8.837 0-16 7.163-16 16m208-16c8.837 0 16 7.163 16 16"
    />
    <path stroke="#085581" strokeWidth={16} d="M224 240H32" />
    <path
      stroke="#f04f31"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={16}
      d="M224 240c4.243 0 8.313-1.686 11.314-4.686 3-3.001 4.686-7.071 4.686-11.314M32 240a16.001 16.001 0 0 1-16-16M128 48V16m32 32V16m32 32V16M96 48V16M64 48V16M16 96h224"
    />
    <path
      stroke="#f04f31"
      fill="#f04f31"
      strokeLinejoin="round"
      strokeWidth={5}
      d="M125.141 124.286c.782-2.23 3.936-2.23 4.718 0l7.916 22.581a7.502 7.502 0 0 0 7.079 5.019h24.759c2.468 0 3.443 3.196 1.397 4.574l-19.362 13.037a7.5 7.5 0 0 0-2.888 8.702l7.546 21.527c.796 2.27-1.76 4.244-3.755 2.901l-20.862-14.048a7.5 7.5 0 0 0-8.378 0l-20.862 14.048c-1.995 1.343-4.55-.631-3.755-2.901l7.546-21.527a7.5 7.5 0 0 0-2.888-8.702L83.99 156.46c-2.046-1.378-1.07-4.574 1.397-4.574h24.759a7.502 7.502 0 0 0 7.079-5.019l7.916-22.581Z"
    />
  </svg>
);
export default SVGComponent;
