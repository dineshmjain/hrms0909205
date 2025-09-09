import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Base tooltip styles
import "tippy.js/animations/shift-away.css"; // Optional: animation style

const TooltipMaterial = ({ className = "", children, content, ...rest }) => {
  return (
    <Tippy content={content} animation="shift-away" theme="custom" {...rest}>
      <span className={`inline-block  ${className}`}>{children}</span>
    </Tippy>
  );
};

export default TooltipMaterial;