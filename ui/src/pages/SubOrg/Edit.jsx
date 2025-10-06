import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import { Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { getTypeOfIndustyAction } from "../../redux/Action/Global/GlobalAction";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CustomField from "../../components/input/CustomFeild";
import {
  SubOrgCreateAction,
  SubOrgEditAction,
} from "../../redux/Action/SubOrgAction/SubOrgAction";
import { toast } from "react-hot-toast"; // <-- make sure toast is installed and imported
import TabSection from "../../components/TabSection/TabSection";
import MultiMappingTable from "../../components/MappingTable/MultiMappingTable";

const Edit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { typeOfIndustries } = useSelector((state) => state?.global);

  const location = useLocation();
  const { state } = location;
  const [params, setParams] = useSearchParams({ tab: "mapping" });
  const tab = params.get("tab");

  console.log(state, "edit");
  const [isEdit, setIsEdit] = useState(true);
  const [basicData, setBasicData] = useState([
    {
      key: "name",
      label: "Name",
      value: state ? state?.name : "",
      type: "text",
      input: "input",
      required: true,
    },
    {
      key: "orgTypeId",
      label: "Business Type",
      value: state ? state?.orgTypeId : "",
      type: "text",
      input: "dropdown",
      required: true,
      labelFeild: "name",
      valueFeild: "_id",
      data: typeOfIndustries,
    },
  ]);

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/suborganization/edit?tab=${targetTab}`, { state });
  };
  const handleChange = (key, newValue) => {
    setBasicData((prev) =>
      prev.map((field) =>
        field.key === key ? { ...field, value: newValue } : field
      )
    );
  };

  const handleSave = async () => {
    try {
      const errors = [];
      const formData = basicData.reduce((acc, field) => {
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
        SubOrgEditAction({ ...formData, _id: state?._id })
      );

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success(
          result?.payload?.message || "Org created successfully!"
        );
        navigate("/suborganization");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Something went wrong while submitting.");
    }
  };

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  useEffect(() => {
    if (typeOfIndustries?.length) {
      setBasicData((prev) =>
        prev.map((field) =>
          field.key === "orgTypeId"
            ? { ...field, data: typeOfIndustries }
            : field
        )
      );
    }
  }, [typeOfIndustries]);

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
        handleBack={() => {
          navigate("../");
        }}
        headerLabel="Organization"
        subHeaderLabel="Create Your Organization"
      />

      <div className="flex flex-wrap gap-6  p-2 ml-2">
        {basicData.map((field) => (
          <div className="min-w-[220px] max-w-[250px] flex-1" key={field.key}>
            <Typography className="text-gray-600 text-sm mb-1 font-medium">
              {field.label}
            </Typography>
            {isEdit ? (
              <Typography>
                {" "}
                {field?.key === "orgTypeId"
                  ? typeOfIndustries?.filter(
                      (d) => d?._id === state?.orgTypeId
                    )[0]?.name
                  : field?.value}
              </Typography>
            ) : (
              <CustomField field={field} handleChange={handleChange} />
            )}
          </div>
        ))}
      </div>
      {/* <TabSection
        tabs={["mapping"]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
      >
        {tab == "mapping" && (
          <div className="flex flex-wrap gap-4 mt-2">
            <MultiMappingTable page={"subOrg"} state={state} />
          </div>
        )}
      </TabSection> */}
    </div>
  );
};

export default Edit;
