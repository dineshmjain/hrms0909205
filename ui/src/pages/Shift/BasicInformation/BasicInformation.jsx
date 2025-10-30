// In edit mode, pre-select branch in dropdown if state.branchId is present

// Ensure branch dropdown is pre-filled with correct objects when editing
import { useEffect, useState } from "react";
import moment from "moment";
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
import { ClientDefaultSettingsListAction, clientListAction } from "../../../redux/Action/Client/ClientAction";
import Branch from "../../ClientWizard/Branch/Branch";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { clientBranchListAction } from "../../../redux/Action/ClientBranch/ClientBranchAction";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";

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
      branchIds: [],
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
      branchIds: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one branch must be selected')
      .required('At least one branch must be selected'),
    },
  };
};

// ✅ Component
const BasicInformation = ({ isEdit, type, selectedBranch, setSelectedBranch }) => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();
  const [endTime, setEndTime] = useState("")
  const [startTime, setStartTime] = useState("")
  const [checkReporting, setCheckReporting] = useState(false)
  const { clientList } = useSelector((state) => state?.client);
  const { branchList } = useSelector((state) => state.branch || {});
  const { clientBranchList = [] } = useSelector((state) => state.clientBranch || {});


  // ✅ Fetch dropdown data
  useEffect(() => {
    if (state) {
      console.log("states received", state)
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
      setFieldValue("branchIds", state?.branchId);
      setFieldValue("branchName", state?.branchDetails?.branchName);
      setFieldValue("clientName", state?.branchDetails?.clientName);
      setFieldValue("clientMappedId", state?.orgId);
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

  useEffect(() => {
    console.debug("BasicInformation selectedClient changed:", selectedClient);
  }, [selectedClient]);


  const { clientDefaultSettings } = useSelector((s) => s.client);

  useEffect(() => {
    if (selectedFilterType === "myOrg") dispatch(SubOrgListAction());
    if (selectedFilterType === "clientOrg") dispatch(clientListAction());
  }, [selectedFilterType]);


  useEffect(() => {
    if (selectedFilterType === "myOrg" && values?.subOrgId) {
      dispatch(BranchGetAction({ mapedData: "branch", orgLevel: true, subOrgId: values.subOrgId }));
      console.log('MY ORG DETAILS FETCHED')
    }
    if (selectedFilterType === "clientOrg" && values?.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: values.clientMappedId }));
      console.log('CLIENT ORG DETAILS FETCHED')
    }
  }, [selectedFilterType, values?.subOrgId, values?.clientMappedId]);


  useEffect(() => {
    if (selectedFilterType === "myOrg") {
      setFieldValue("clientMappedId", "");
      setFieldValue("branchIds", "");
      setFieldValue("clientId", "");
    }
    if (selectedFilterType === "clientOrg") {
      setFieldValue("subOrgId", "");
      setFieldValue("branchIds", "");
    }
  }, [selectedFilterType, setFieldValue]);

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
        setFilterType("myOrg");
      }
    }
  }, [state, isEdit, setFieldValue]);


  // ✅ Update reporting from redux
  useEffect(() => {
    setCheckReporting(clientDefaultSettings?.isReportTime || false);
  }, [clientDefaultSettings]);


  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(/\s+/);
    return words.length > 1
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0][0].toUpperCase();
  };
  useEffect(() => {
    try {
      const s = values?.startTime;
      const e = values?.endTime;

      // compute minIn when startTime and numeric maxIn (minutes) are present
      if (s && values?.maxIn !== undefined && values?.maxIn !== "") {
        const graceInMinutes = parseInt(values.maxIn, 10);
        if (!isNaN(graceInMinutes)) {
          const minInTime = moment(s, "HH:mm").subtract(graceInMinutes, "minutes").format("HH:mm");
          setFieldValue("minIn", minInTime);
        }
      }

      // compute maxOut when endTime and numeric minOut (minutes) are present
      if (e && values?.minOut !== undefined && values?.minOut !== "") {
        const graceOutMinutes = parseInt(values.minOut, 10);
        if (!isNaN(graceOutMinutes)) {
          const maxOutTime = moment(e, "HH:mm").add(graceOutMinutes, "minutes").format("HH:mm");
          setFieldValue("maxOut", maxOutTime);
        }
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [values?.startTime, values?.endTime, values?.maxIn, values?.minOut, setFieldValue]);

  return (
    <div className="w-full p-2">
      <OrganizationFilter
        selectedFilterType={selectedFilterType}
        setFilterType={setFilterType}
        type={type}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-3">
        {selectedFilterType === "myOrg" && (
          <>
            {type == 'add' && (
              <FormikInput
                name="branchIds"
                label={"Branches"}
                selectedData={values?.branchIds}
                inputType={"multiDropdown"}
                data={branchList}
                setSelectedData={(data) => setFieldValue("branchIds", data)}
                feildName="name"
                Dependency="_id"
              />
            )}
            {type == 'edit' && (
              <FormikInput
                name="branchName"
                size="sm"
                label="Branch"
                inputType={"input"}
                editValue={values?.branchName}
                disabled={true}
              />
            )}
          </>
        )}
        {selectedFilterType === "clientOrg" && (
          <>
            {type == 'add' && (
              <FormikInput
                name="clientMappedId"
                size="md"
                label={"Client"}
                inputType={isEdit ? "edit" : "dropdown"}
                listData={clientList}
                selectedOption={values?.clientMappedId}
                handleClick={(sel) => { setFieldValue("clientMappedId", sel?._id), setFieldValue("clientId", sel.clientId) }}
                selectedOptionDependency="_id"
                feildName="name"
              />
            )}
            {type == 'edit' && (
              <FormikInput
                name="clientName"
                size="sm"
                label="Client"
                inputType={"input"}
                editValue={values?.clientName}
                disabled={true}
              />
            )}
            {type == 'add' && (
              <FormikInput
                name="branchIds"
                label={"Client Branches"}
                selectedData={values?.branchIds}
                inputType={isEdit ? "edit" : "multiDropdown"}
                data={clientBranchList}
                setSelectedData={(data) =>
                  setFieldValue("branchIds", data)
                }
                selectedOptionDependency="_id"
                feildName="name"
                Dependency="_id"
              />
            )}
            {type == 'edit' && (
              <FormikInput
                name="branchName"
                size="sm"
                label="Client Branch"
                inputType={"input"}
                editValue={values?.branchName}
                disabled={true}
              />
            )}
          </>
        )}
      </div>

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
            // only set the startTime here; computation of minIn/maxIn is handled in the effect below
            setFieldValue("startTime", selectedTime);
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
            // only set the endTime here; computation of minOut/maxOut is handled in the effect below
            setFieldValue("endTime", selectedTime);
          }}
        />
      </div>

      {/* Grace & Reporting Times */}
      <div className="flex gap-10">
        {
          !selectedClient?.clientId && <div className="mt-4">
            <SubCardHeader headerLabel="Grace Timings" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-3">
              {/* <FormikInput
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
            /> */}

              {/* </div> */}
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4"> */}
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
                type="number"
                editValue={values?.maxIn}
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
                type="number"
                editValue={values?.minOut}
              />
              {/* <FormikInput
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
            /> */}
            </div>
          </div>

        }

        {selectedClient?.clientId && (
          checkReporting ? (<div className="mt-4">
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
          </div>) : (
            <div className="mt-4">
              <SubCardHeader headerLabel="Grace Timings" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-3">
                {/* <FormikInput
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
                /> */}
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
                  type="number"
                  editValue={values?.maxIn}
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
                  type="number"
                  editValue={values?.minOut}
                />

                {/* <FormikInput
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
                /> */}
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
