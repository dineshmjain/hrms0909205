import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { Typography } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CustomField from "../../components/input/CustomFeild";
import { HolidayEditAction } from "../../redux/Action/Holiday/holiday";
import { toast } from "react-hot-toast";

const Edit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [isEdit, setIsEdit] = useState(true);

  const [holidayData, setHolidayData] = useState([
    {
      key: "name",
      label: "Name",
      value: state?.name || "",
      type: "text",
      input: "input",
      required: true,
    },
    {
      key: "description",
      label: "Description",
      value: state?.description || "",
      type: "text",
      input: "input",
      required: false,
    },
    {
      key: "holidayType",
      label: "Holiday Type",
      value: state?.holidayType || "",
      type: "text",
      input: "dropdown",
      required: true,
      data: [
        { label: "Public Holiday", value: "public" },
        { label: "Restricted Holiday", value: "restricted" },
        { label: "Optional Holiday", value: "optional"}
      ],
      labelFeild: "label",
      valueFeild: "value",
    },
    {
      key: "date",
      label: "Date",
      value: state?.date?.slice(0, 10) || "",
      type: "date",
      input: "input",
      required: true,
    },
    {
      key: "duration",
      label: "Duration",
      value: state?.duration || "",
      type: "text",
      input: "dropdown",
      required: true,
      data: [
        { label: "Full Day", value: "Full Day" },
        { label: "Half Day", value: "Half Day" },
      ],
      labelFeild: "label",
      valueFeild: "value",
    },
  ]);

  const handleChange = (key, newValue) => {
    setHolidayData((prev) =>
      prev.map((field) =>
        field.key === key ? { ...field, value: newValue } : field
      )
    );
  };

  const handleSave = async () => {
    try {
      const errors = [];
      const formData = holidayData.reduce((acc, field) => {
        if (field.required && !field.value) {
          errors.push(`${field.label} is required.`);
        }
        acc[field.key] = field.value;
        return acc;
      }, {});

      if (errors.length > 0) {
        toast.error(errors.join("\n"));
        return;
      }

      const result = await dispatch(
        HolidayEditAction({ ...formData, _id: state?._id })
      );

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success(
          result?.payload?.message || "Holiday updated successfully!"
        );
        navigate("/holidays");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong while submitting.");
    }
  };

  const handleClickEdit = () => {
    setIsEdit(false);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 p-2 w-full h-[100vh] bg-white border-1 border-gray-50 rounded-md">
      <Header
        buttonTitle="Save"
        isBackHandler={true}
        isEditAvaliable={isEdit}
        isButton={true}
        handleClick={handleSave}
        handleEdit={handleClickEdit}
        handleBack={() => navigate("/holidays")}
        headerLabel="Holiday"
        subHeaderLabel="Edit Holiday"
      />

      <div className="flex flex-wrap gap-6 p-2 ml-2">
        {holidayData.map((field) => (
          <div className="min-w-[220px] max-w-[250px] flex-1" key={field.key}>
            <Typography className="text-gray-600 text-sm mb-1 font-medium">
              {field.label}
            </Typography>
            {isEdit ? (
              <Typography>
                {field.input === "dropdown"
                  ? field?.data?.find((d) => d.value === field.value)?.label
                  : field?.value}
              </Typography>
            ) : (
              <CustomField field={field} handleChange={handleChange} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Edit;
