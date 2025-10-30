import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import SubCardHeader from "../../components/header/SubCardHeader";
import BasicInformation, {
  BasicConfig,
} from "./BasicInformation/BasicInformation";
import AddressNew, { AddressCon } from "../../components/Address/AddressNew";
import { BranchCreateAction } from "../../redux/Action/Branch/BranchAction";
import { GetBranchCreationAction } from "../../redux/Action/Wizard/WizardAction";
import { clientBranchCreateAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { Typography, Input } from "@material-tailwind/react";

const Add = ({ onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isClient, setIsClient] = useState(false);
  const { active: isSetupMode } = useSelector((state) => state?.setupMode);
  const { user } = useSelector((state) => state?.user);
  const [submitting, setSubmitting] = useState(false);

  // Configs
  const BasicCon = BasicConfig();
  const AddressConf = AddressCon("branchAddress");

  const initialValues = {
    ...BasicCon.initialValues,
    ...AddressConf.initialValues,
  };

  const { subOrgId, ...res } = BasicCon.validationSchema;

  const validationSchema = Yup.object().shape({
    ...(user?.modules?.suborganization?.r && !isClient ? { subOrgId } : {}),
    ...res,
    ...AddressConf.validationSchema,
  });

  // Handle form submit
  // Handle form submit
  // Update the handleSubmit function in the Add component

  const handleSubmit = async (values) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const {
        name,
        branchAddress,
        subOrgId,
        startTime,
        endTime,
        maxIn,
        minOut,
        reportingTime,
        timeSettingType,
        salaryCycle,
        financialYear,
        weekoff,
      } = values;

      // ✅ Helper function to add minutes to time (HH:MM format)
      const addMinutesToTime = (time, minutes) => {
        if (!time || !minutes || minutes === 0) return time;

        const [hours, mins] = time.split(":").map(Number);
        const totalMinutes = hours * 60 + mins + Number(minutes);

        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMins = totalMinutes % 60;

        return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
          2,
          "0"
        )}`;
      };

      // ✅ Helper function to subtract minutes from time (HH:MM format)
      const subtractMinutesFromTime = (time, minutes) => {
        if (!time || !minutes || minutes === 0) return time;

        const [hours, mins] = time.split(":").map(Number);
        let totalMinutes = hours * 60 + mins - Number(minutes);

        // Handle negative values (previous day)
        if (totalMinutes < 0) {
          totalMinutes += 24 * 60;
        }

        const newHours = Math.floor(totalMinutes / 60) % 24;
        const newMins = totalMinutes % 60;

        return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
          2,
          "0"
        )}`;
      };

      // Build base payload
      const payload = {
        name,
        subOrgId,
        clientMappedId: isClient ? state?.clientMappedId : "",
        clientId: isClient ? state?.clientId : "",
        ...branchAddress?.structuredAddress,
        salaryCycle: {
          startDay: Number(salaryCycle.startDay),
          endDay: Number(salaryCycle.endDay),
        },
        financialYear: {
          startDate: financialYear.startDate,
          endDate: financialYear.endDate,
        },
        weekOff: weekoff,
        timeSettingType,
      };

      //  Conditionally add time fields based on timeSettingType
      if (timeSettingType === "startEnd") {
        payload.startTime = startTime;
        payload.endTime = endTime;

        //  Calculate maxIn by ADDING minutes to startTime
        payload.maxIn = addMinutesToTime(startTime, maxIn);

        //  Calculate minOut by SUBTRACTING minutes from endTime
        payload.minOut = subtractMinutesFromTime(endTime, minOut);

        console.log("Time Calculations:");
        console.log(`startTime: ${startTime}`);
        console.log(`maxIn input (minutes): ${maxIn}`);
        console.log(`maxIn result: ${payload.maxIn}`);
        console.log(`endTime: ${endTime}`);
        console.log(`minOut input (minutes): ${minOut}`);
        console.log(`minOut result: ${payload.minOut}`);
      } else if (timeSettingType === "reporting") {
        payload.reportingTime = reportingTime;
      }

      const finalPayload = removeEmptyStrings(payload);

      console.log(finalPayload, "Final Payload Before Dispatch");

      const Action = isClient ? clientBranchCreateAction : BranchCreateAction;
      const response = await dispatch(Action(finalPayload));
      const { meta } = response || {};

      if (meta?.requestStatus === "fulfilled") {
        if (isSetupMode) onComplete?.();
        else navigate(isClient ? -1 : "/branch/list");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setIsClient(!!state?.clientId);
  }, [state]);

  return (
    <div className="flex flex-col w-full flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-scroll">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, errors }) => {
          console.log(values, errors);
          return (
            <>
              <Header
                isBackHandler={true}
                headerLabel={isClient ? "Add Client Branch" : "Add Branch"}
                subHeaderLabel={
                  isClient ? state?.clientName : "Add Your Branch Details"
                }
                handleClick={() => submitForm()}
              />
              <Form>
                <div className="sm:ml-[3rem] p-2 flex-col">
                  <div className="pb-2 border-b-2 border-gray-200">
                    <BasicInformation isClient={isClient} />
                  </div>

                  <div className="pb-2 ml-1 border-b-2 border-gray-200 mt-6">
                    <SubCardHeader headerLabel="Branch Settings" />
                    <AddressNew
                      prefix="branchAddress"
                      isCitySearchWithTimezone={false}
                      isMap={true}
                      isRadius={false}
                      isAdd={true}
                    />
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default Add;
