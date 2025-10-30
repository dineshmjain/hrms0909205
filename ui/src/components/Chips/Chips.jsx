import React from "react";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial.jsx";

// Utility function to check luminance
const adjustColorBrightness = (hex, amount) => {
  let color = hex?.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const rgb = color
    .match(/.{2}/g)
    .map((c) => Math.max(0, Math.min(255, parseInt(c, 16) + amount)));

  return `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};

// Utility to determine text luminance adjustment
const getTextColor = (hex) => {
  const luminance = getLuminance(hex);
  const adjustment = luminance > 0.5 ? -150 : 150; // Larger adjustment for brightness
  return adjustColorBrightness(hex, adjustment);
};

// Utility to calculate luminance
const getLuminance = (hex) => {
  const rgb = hex
    ?.replace("#", "")
    .match(/.{2}/g)
    .map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.5152 * g + 0.0722 * b;
};

const Chips = ({ color="#000000", text, css, isLoading,textColor, toolTipText}) => {
  textColor = textColor || getTextColor(color);

  return (
    <>
      {toolTipText?.length > 0 ? (
        <TooltipMaterial content={toolTipText}>
          <div
            className={`px-2 py-1 rounded-md font-normal h-fit cursor-pointer text-nowrap truncate  maxsm:text-xs    w-fit capitalize ${css} ${
              isLoading ? "animate-pulse" : ""
            }`}
            style={{ backgroundColor: color, color: textColor }}
          >
            {text}
          </div>
        </TooltipMaterial>
      ) : (
        <div
          className={`px-2 py-1 rounded-md font-normal h-fit cursor-pointer text-nowrap truncate maxsm:text-xs w-fit capitalize ${css} ${
            isLoading ? "animate-pulse" : ""
          }`}
          style={{ backgroundColor: color, color: textColor }}
        >
          {text}
        </div>
      )}
    </>
  );
};

export default Chips;
