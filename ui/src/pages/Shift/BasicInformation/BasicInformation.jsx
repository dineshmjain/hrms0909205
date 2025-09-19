import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
import OrganizationFilter from "../../../components/Filter/organizationFilter";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import { PiInfoBold } from "react-icons/pi";
import { Typography } from "@material-tailwind/react";
import { ClientDefaultSettingsListAction } from "../../../redux/Action/Client/ClientAction";

// ✅ Exporting field config for Formik in parent
export const BasicConfig = () => {
  return {
    initialValues: {
      name: "",
      startTime: "",
      endTime: "",
      bgColor: "#FF461D",
      textColor: "#000000",
      shiftId: "",
      maxIn: "",
      maxOut: "",
      minIn: "",
      minOut: "",
      clientMappedId: "",
      clientId: "",
    },
    validationSchema: {
      name: Yup.string().required("Shift Name is required"),
      startTime: Yup.string().required("Shift Start Time is required"),
      maxIn: Yup.string().required("Grace Max In is required"),
      maxOut: Yup.string().required("Grace Max Out is required"),
      minIn: Yup.string().required("Grace Min In is required"),
      minOut: Yup.string().required("Grace Min Out is required"),
      endTime: Yup.string().required("Shift End Time is required"),
      bgColor: Yup.string().required("Shift BG Color is required "),
      textColor: Yup.string().required("Shift Text Color is required "),
    },
  };
};

// ✅ Component
const BasicInformation = ({ isEdit, type = "add" }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();
  const [endTime, setEndTime] = useState("")
  const [startTime, setStartTime] = useState("")
  const [checkReporting, setCheckReporting] = useState(false)

  // ✅ Fetch dropdown data
  useEffect(() => {
    if (state) {
      console.log(state, "recived");
      //  setFieldValue('_id', state?._id)
      setFieldValue("name", state?.name || "");
      setFieldValue("startTime", state?.startTime || "");
      setFieldValue("endTime", state?.endTime || "");
      setFieldValue("bgColor", state?.bgColor || "#FF461D");
      setFieldValue("textColor", state?.textColor || "#000000");
      setFieldValue("shiftId", state?._id || "");
      setFieldValue("maxIn", state?.maxIn || "");
      setFieldValue("maxOut", state?.maxOut || "");
      setFieldValue("minIn", state?.minIn || "");
      setFieldValue("minOut", state?.minOut || "");
      setFieldValue("clientId", state?.clientId);
      setFieldValue("reportTimeIn", state?.reportTimeIn);
      setFieldValue("reportTimeOut", state?.reportTimeOut);
      setFieldValue("clientMappedId", state?.orgId); //
      setSelectedClient({
        clientId: state?.clientId,
        clientMappedId: state?.clientMappedId,
        orgId: state?.orgId,
      });
      if (state?.clientId) {
        setFilterType("clientOrg");
      }
    }
  }, [state]);

  const [selectedFilterType, setFilterType] = useState("myOrg");
  const [selectedClient, setSelectedClient] = useState({
    clientId: "",
    clientMappedId: "",
    clientBranch: [],
  });
  // const [checkReporting, setCheckReporting] = useState(false);

  const { clientDefaultSettings } = useSelector((s) => s.client);

  // ✅ Pre-fill values if editing
  useEffect(() => {
    if (state && isEdit) {
      Object.entries(state).forEach(([key, value]) => {
        if (value !== undefined) setFieldValue(key, value);
      });

      setSelectedClient({
        clientId: state.clientId || "",
        clientMappedId: state.clientMappedId || "",
        orgId: state.orgId || "",
      });

      // select the specific tabs from List
      if (state.selectedFilterType) {
        setFilterType(state.selectedFilterType);
      } else {
        setFilterType("myOrg"); // default
      }
    }
  }, [state, isEdit, setFieldValue]);

  //  Load client defaults
  useEffect(() => {
    if (isEdit && state?.clientId) {
      dispatch(ClientDefaultSettingsListAction({ clientId: state.clientId }));
    } else if (!isEdit && selectedClient.clientId) {
      dispatch(
        ClientDefaultSettingsListAction({ clientId: selectedClient.clientId })
      );
    }
  }, [isEdit, state?.clientId, selectedClient.clientId, dispatch]);

  // ✅ Update reporting from redux
  useEffect(() => {
    setCheckReporting(clientDefaultSettings?.isReportTime || false);
  }, [clientDefaultSettings]);

  // ✅ Sync clientMappedId with form
  useEffect(() => {
    setFieldValue("clientMappedId", selectedClient.clientMappedId);
  }, [selectedClient, setFieldValue]);

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0][0].toUpperCase();
  };

  return (
    <div className="w-full p-2">
      <OrganizationFilter
        selectedFilterType={selectedFilterType}
        setFilterType={setFilterType}
        selectedClient={{
          clientId: values.clientId,
          clientMappedId: values.clientMappedId,
        }}
        setSelectedClient={(client) => {
          setFieldValue("clientId", client?.clientId || "");
          setFieldValue("clientMappedId", client?.clientMappedId || "");
        }}
        type={type}
      />

      {/* Name + Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
        <FormikInput
          name="name"
          size="sm"
          label="Name"
          inputType={!isEdit ? "input" : "edit"}
          editValue={values?.name}
        />

        <div className="flex gap-4 w-[500px]">
          <FormikInput
            name="bgColor"
            size="sm"
            label="Primary Color"
            inputType="color"
            type="color"
            disabled={isEdit}
          />
          <FormikInput
            name="textColor"
            size="sm"
            label="Text Color"
            inputType="color"
            type="color"
            disabled={isEdit}
          />
          {values?.name && (
            <div>
              <Typography className="text-gray-700 text-[14px] font-medium">
                Preview
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-8 h-8 rounded-md border shadow flex items-center justify-center"
                  style={{ backgroundColor: values.bgColor }}
                >
                  <Typography
                    className="text-xs font-bold"
                    style={{ color: values.textColor }}
                  >
                    {getInitials(values.name)}
                  </Typography>
                </div>
                <Typography className="text-gray-700 text-md font-medium">
                  {values.name}
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
        <FormikInput
          name="startTime"
          size="sm"
          label="Start Time"
          inputType={!isEdit ? "input" : "edit"}
          type="time"
          editValue={values?.startTime}
          onChange={(e) => {
            const selectedTime = e.target.value;
            const [h, m] = selectedTime.split(":").map(Number);
            const minGrace = new Date();
            minGrace.setHours(h, m - 15);
            setFieldValue("minIn", minGrace.toTimeString().slice(0, 5));
            const maxGrace = new Date();
            maxGrace.setHours(h, m + 15);
            setFieldValue("maxIn", maxGrace.toTimeString().slice(0, 5));
          }}
        />
        <FormikInput
          name="endTime"
          size="sm"
          label="End Time"
          inputType={!isEdit ? "input" : "edit"}
          type="time"
          editValue={values?.endTime}
          onChange={(e) => {
            const selectedTime = e.target.value;
            const [h, m] = selectedTime.split(":").map(Number);
            const minGrace = new Date();
            minGrace.setHours(h, m - 15);
            setFieldValue("minOut", minGrace.toTimeString().slice(0, 5));
            const maxGrace = new Date();
            maxGrace.setHours(h, m + 15);
            setFieldValue("maxOut", maxGrace.toTimeString().slice(0, 5));
          }}
        />
      </div>

      {/* Grace & Reporting Times */}
      <div className="flex gap-10">
        {
        !selectedClient?.clientId &&<div className="mt-4">
          <SubCardHeader headerLabel="Grace Timings" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-3">
            <FormikInput
              name="minIn"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Min In
                  <TooltipMaterial content="Minimum grace time allowed for Check-In">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.minIn}
            />
            <FormikInput
              name="minOut"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Min Out
                  <TooltipMaterial content="Minimum grace time allowed for Check-Out">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.minOut}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
            <FormikInput
              name="maxIn"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Max In
                  <TooltipMaterial content="Maximum grace time allowed for Check-In">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.maxIn}
            />
            <FormikInput
              name="maxOut"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Max Out
                  <TooltipMaterial content="Maximum grace time allowed for Check-Out">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.maxOut}
            />
          </div>
        </div>

            }

        {selectedClient?.clientId && (
          checkReporting  ?(<div className="mt-4">
            <SubCardHeader headerLabel="Reporting Time" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-3">
              <FormikInput
                name="reportTimeIn"
                size="sm"
                label="Reporting In"
                inputType={!isEdit ? "input" : "edit"}
                type="time"
                editValue={values?.reportTimeIn}
              />
              <FormikInput
                name="reportTimeOut"
                size="sm"
                label="Reporting Out"
                inputType={!isEdit ? "input" : "edit"}
                type="time"
                editValue={values?.reportTimeOut}
              />
            </div>
          </div>):(
            <div className="mt-4">
          <SubCardHeader headerLabel="Grace Timings" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-3">
            <FormikInput
              name="minIn"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Min In
                  <TooltipMaterial content="Minimum grace time allowed for Check-In">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.minIn}
            />
            <FormikInput
              name="minOut"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Min Out
                  <TooltipMaterial content="Minimum grace time allowed for Check-Out">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.minOut}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
            <FormikInput
              name="maxIn"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Max In
                  <TooltipMaterial content="Maximum grace time allowed for Check-In">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.maxIn}
            />
            <FormikInput
              name="maxOut"
              size="sm"
              label={
                <span className="flex items-center gap-1">
                  Grace Max Out
                  <TooltipMaterial content="Maximum grace time allowed for Check-Out">
                    <PiInfoBold className="w-5 h-5" />
                  </TooltipMaterial>
                </span>
              }
              inputType={!isEdit ? "input" : "edit"}
              type="time"
              editValue={values?.maxOut}
            />
          </div>
        </div>
          )
        )
      
      }
      </div>
    </div>
  );
};

export default BasicInformation;
