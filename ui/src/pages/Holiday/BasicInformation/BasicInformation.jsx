import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from 'yup';
import FormikInput from "../../../components/input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
import { clientListAction } from "../../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from '../../../redux/Action/ClientBranch/ClientBranchAction';
import { useCheckEnabledModule } from '../../../hooks/useCheckEnabledModule.js'

// ✅ Formik Config Export
export const BasicConfig = () => {
  return {
    initialValues: {
      name: "",
      description: "",
      holidayType: "",
      date: "",
      duration: "",
      subOrgId: "",
      branchIds: "",
      clientMappedId: "",
      clientBranchIds: "",
    },
    validationSchema: {
      name: Yup.string().required("Holiday Name is required"),
      holidayType: Yup.string().required("Holiday Type is required"),
      date: Yup.date().required("Holiday Date is required"),
      duration: Yup.string().required("Duration is required"),
    },
  };
};

// ✅ UI Component
const BasicInformation = ({ isEditAvaliable = false, filterType }) => {
  const dispatch = useDispatch();
  const checkModule = useCheckEnabledModule();
  const { state } = useLocation();
  const { values, setFieldValue } = useFormikContext();
  const { subOrgs } = useSelector((state) => state.subOrgs || {});
  const { branchList } = useSelector((state) => state.branch || {});
  const { clientList = [] } = useSelector((state) => state.client || {});
  const { clientBranchList = [] } = useSelector((state) => state.clientBranch || {});

    useEffect(() => {
    if (filterType === "myOrg") dispatch(SubOrgListAction());
    if (filterType === "clientOrg") dispatch(clientListAction());
  }, [filterType]);


   useEffect(() => {
    if (filterType === "myOrg" && values?.subOrgId) {
      dispatch(BranchGetAction({ mapedData: "branch", orgLevel: true, subOrgId: values.subOrgId }));
      console.log('MY ORG DETAILS FETCHED')
    }
    if (filterType === "clientOrg" && values?.clientMappedId) {
      dispatch(clientBranchListAction({ clientMappedId: values.clientMappedId }));
      console.log('CLIENT ORG DETAILS FETCHED')
    }
  }, [filterType, values?.subOrgId, values?.clientMappedId]);

  useEffect(() => {
    if (filterType === "myOrg") {
      setFieldValue("clientMappedId", "");
      setFieldValue("clientBranchIds", "");
    }
    if (filterType === "clientOrg") {
      setFieldValue("subOrgId", "");
      setFieldValue("branchIds", "");
    }
  }, [filterType, setFieldValue]);

  useEffect(() => {
    if (state) {
      setFieldValue("name", state?.name || "");
      setFieldValue("description", state?.description || "");
      setFieldValue("holidayType", state?.holidayType || "");
      setFieldValue("date", state?.date?.slice(0, 10) || "");
      setFieldValue("duration", state?.duration || "");
      setFieldValue("subOrgId", state?.subOrgId || ""),
      setFieldValue("clientMappedId", state?.clientMappedId || "")
      setFieldValue("branchIds", state?.branchIds || "")
      setFieldValue("clientBranchIds", state?.clientBranchIds || "")
    }
  }, [state]);

  return (
    <div className="w-full p-2">
      {/* <SubCardHeader headerLabel={"Basic Details"} /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {filterType === "myOrg" && (
          <>
            {checkModule('suborganization') && 
              (<FormikInput
                name="subOrgId"
                size="md"
                label={"Organization"}
                inputType={isEditAvaliable ? "edit" : "dropdown"}
                listData={subOrgs}
                selectedOption={values?.subOrgId}
                handleClick={(sel) => setFieldValue("subOrgId", sel?._id)}
                selectedOptionDependency="_id"
                feildName="name"
              />)
            }
            <FormikInput
              name="branchIds"
              label={"Branches"}
              selectedData={values?.branchIds}
              inputType={isEditAvaliable ? "edit" : "multiDropdown"}
              data={branchList}
              setSelectedData={(data) => setFieldValue("branchIds", data)}
              feildName="name"
              Dependency="_id"
            />
          </>
        )}

        {filterType === "clientOrg" && (
          <>
            <FormikInput
              name="clientMappedId"
              size="md"
              label={"Client"}
              inputType={isEditAvaliable ? "edit" : "dropdown"}
              listData={clientList}
              selectedOption={values?.clientMappedId}
              handleClick={(sel) => setFieldValue("clientMappedId", sel?._id)}
              selectedOptionDependency="_id"
              feildName="name"
            />
            <FormikInput
              name="clientBranchIds"
              label={"Client Branches"}
              selectedData={values?.clientBranchIds}
              inputType={isEditAvaliable ? "edit" : "multiDropdown"}
              data={clientBranchList}
              setSelectedData={(data) => setFieldValue("clientBranchIds", data)}
              selectedOptionDependency="_id"
              feildName="name"
              Dependency="_id"
            />
          </>
        )}

        <FormikInput
          name="name"
          size="md"
          label={"Name *"}
          inputType={isEditAvaliable ? "edit" : "input"}
          editValue={values?.name}
        />
        <FormikInput
          name="description"
          size="md"
          label={"Description *"}
          inputType={isEditAvaliable ? "edit" : "input"}
          editValue={values?.description}
        />
        <FormikInput
            name="holidayType"
            size="md"
            label={"Holiday Type *"}
            inputType={isEditAvaliable ? "edit" : "dropdown"}
            editValue={values?.holidayType}
            listData={[
              { _id: "public", name: "Public Holiday" },
              { _id: "restricted", name: "Restricted Holiday" },
              { _id: "optional", name: "Optional Holiday" },
            ]}
            selectedOption={values?.holidayType}
            handleClick={(selected) => setFieldValue("holidayType", selected._id)}
            selectedOptionDependency="_id"
            feildName="name"
        />

        <FormikInput
          name="date"
          size="md"
          label={"Date *"}
          type="date"
          inputType={isEditAvaliable ? "edit" : "input"}
          editValue={values?.date}
        />
        <FormikInput
            name="duration"
            size="md"
            label={"Duration *"}
            inputType={isEditAvaliable ? "edit" : "dropdown"}
            editValue={values?.duration}
            listData={[
              { _id: "full-day", name: "Full Day" },
              { _id: "half-day", name: "Half Day" },
            ]}
            selectedOption={values?.duration}
            handleClick={(selected) => setFieldValue("duration", selected._id)}
            selectedOptionDependency="_id"
            feildName="name"
        />
      </div>
    </div>
  );
};

export default BasicInformation;