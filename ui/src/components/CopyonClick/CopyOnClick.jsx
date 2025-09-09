import React, { useState } from "react";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";

const CopyOnClick = ({ text, children }) => {
  const [tooltipText, setTooltipText] = useState("Click to copy");

const handleCopy = (e) => {
  e.stopPropagation();

  // Create a hidden textarea with the text to copy
  const textarea = document.createElement("textarea");
  textarea.value = text; // make sure 'text' is accessible in scope
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  textarea.select();
  textarea.setSelectionRange(0, 99999); // for mobile

  try {
    const success = document.execCommand("copy");
    if (success) {
      setTooltipText("Copied!");
      setTimeout(() => setTooltipText("Click to copy"), 1000);
      console.log("Copied to clipboard:", text);
    } else {
      console.error("execCommand failed");
    }
  } catch (err) {
    console.error("Copy failed:", err);
  }

  document.body.removeChild(textarea);
};




  return (
    <div onClick={handleCopy}>
      <TooltipMaterial content={tooltipText} key={tooltipText} delay={100}>
        {children}
      </TooltipMaterial>
    </div>
  );
};

export default CopyOnClick;
