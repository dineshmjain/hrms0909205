import { Input, Typography } from "@material-tailwind/react";
import { useField } from "formik";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import { useRef, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

const FormikInput = ({
  label,
  editValue,
  inputType,
  onChange,
  highlight = false,
  floatingLabel = false, // Add this prop
  ...props
}) => {
  const [field, meta, helpers] = useField({
    ...props,
    type: inputType === "checkbox" ? "checkbox" : "text",
  });
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleChange = (value) => {
    helpers.setValue(value);
    onChange?.({ target: { name: props.name, value } });
  };

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="flex flex-col relative">
      {label && inputType !== "checkbox" && !floatingLabel && (
        <Typography
          className={`text-gray-700 text-[14px] mb-1 ${
            !highlight ? "font-medium" : "font-semibold text-md"
          }`}
        >
          {label}
        </Typography>
      )}

      {/* Standard Input */}
      {inputType === "input" && (
        <>
          <Input
            {...field}
            autoComplete="off"
            labelProps={{ className: "hidden" }}
            {...props}
            variant="outlined"
            size="md"
            className="!border !border-gray-400 bg-white text-gray-900 placeholder-gray-600 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md [&::placeholder]:opacity-100 [&::placeholder]:text-gray-600"
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e);
            }}
          />
          {meta.touched && meta.error && (
            <Typography className="text-red-500 text-xs mt-1">
              {meta.error}
            </Typography>
          )}
        </>
      )}
      {floatingLabel && label && (
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none
              ${
                field.value || props.type === "date"
                  ? "-top-[10px] text-[11px] bg-white px-1 text-gray-600"
                  : "top-2.5 text-sm text-gray-600"
              }`}
        >
          {label}
        </label>
      )}

      {/* {meta.touched && meta.error && (
        <Typography className="text-red-500 text-xs mt-1">
          {meta.error}
        </Typography>
      )} */}

      {/* Dropdown */}
      {inputType === "dropdown" && (
        <>
          <SingleSelectDropdown {...field} {...props} />
          {meta.touched && meta.error && (
            <Typography className="text-red-500 text-xs mt-1">
              {meta.error}
            </Typography>
          )}
        </>
      )}

      {/* Multi Dropdown */}
      {inputType === "multiDropdown" && (
        <>
          <MultiSelectDropdown {...field} {...props} />
          {meta.touched && meta.error && (
            <Typography className="text-red-500 text-xs mt-1">
              {meta.error}
            </Typography>
          )}
        </>
      )}

      {/* Edit Mode */}
      {inputType === "edit" && (
        <Typography className="text-gray-800 text-[14px] mb-1 font-semibold">
          {editValue || "-"}
        </Typography>
      )}

      {/* Color Picker */}
      {inputType === "color" && (
        <div className="relative" ref={pickerRef}>
          <div
            className="w-8 h-8 rounded-md border border-gray-300 shadow cursor-pointer"
            style={{ backgroundColor: field.value || "#3b82f6" }}
            onClick={() => setShowPicker((prev) => !prev)}
          ></div>
          {showPicker && (
            <div className="absolute top-14 left-0 z-50 bg-white p-2 rounded-md shadow-lg">
              <HexColorPicker
                color={field.value || "#3b82f6"}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Checkbox */}
      {inputType === "checkbox" && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...field}
            checked={field.value}
            onChange={(e) => {
              helpers.setValue(e.target.checked);
              onChange?.(e);
            }}
            className={`w-6 h-6 accent-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
              props.checkboxClassName || ""
            }`}
          />
          <span className="text-gray-800 text-[15px]">{label}</span>
        </label>
      )}
    </div>
  );
};

export default FormikInput;
