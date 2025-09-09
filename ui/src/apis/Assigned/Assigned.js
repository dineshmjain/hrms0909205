import axios from "axios";
import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject } from "../../constants/reusableFun";

export const getAssignedModules2 = async (assignedDetails) => {
  try {
    console.log(assignedDetails, "form===================");
    let path;
    let response;
    if (assignedDetails.type == "branch") {
      path = `branch/list?mapedData=${assignedDetails.subType}&${assignedDetails.typeId}=${assignedDetails.Value}&category=${assignedDetails.category}`;
      response = await axiosInstance.post(path);
      console.log("branch", path);
    } else {
      console.log(
        assignedDetails,
        `${assignedDetails.type}/get?category=${assignedDetails?.category || "all"
        }&branchId=${assignedDetails?.branchId}${assignedDetails?.departmentId
          ? `&departmentId=${assignedDetails.departmentId}`
          : ""
        }&mapedData=${assignedDetails.subType}`,
        "h"
      );
      //   console.log(`department/get?branchId=${assignedDetails.params.branchId}&mapedData=department&${branchDetails?.params?.category ?`&category=${branchDetails.params.category}`:''})
      ("");

      path = `${assignedDetails.type}/get?category=${assignedDetails?.category || "all"
        }&branchId=${assignedDetails?.branchId}${assignedDetails?.departmentId
          ? `&departmentId=${assignedDetails.departmentId}`
          : ""
        }&mapedData=${assignedDetails.subType}`;

      // path = `${assignedDetails.type}/get?category=${assignedDetails?.category ? assignedDetails?.category : 'all'}&branchId=${assignedDetails?.branchId}${assignedDetails?.departmentId && `departmentId=${assignedDetails.departmentId}` }&mapedData=${assignedDetails.subType}`
      console.log("other", path);
      response = await axiosInstance.get(path);
    }

    console.log(path, "key final");

    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};

export const getAssignedModules = async (data) => {

  try {
    const { call, ...rest } = data;
    const params = getParamsFromObject(rest ?? {});
    let path;
    let response;
    if (call === "branch") {
      path = `branch/list${params}`;
      response = await axiosInstance.post(path);
    } else {
      path = `${call}/get${params}`;
      response = await axiosInstance.get(path);
    }

    return response?.data;
  } catch (error) {
    throw error?.response?.data || error?.message || error;
  }
};

export const getAssignedModulesTest = async (data) => {
  const { type, ...rest } = data;
  const params = getParamsFromObject(rest);
  try {
    let path = (type == `branch` ? "branch/list" : `${type}/get`) + params;
    let res = await axiosInstance(path);
    console.log(res);
  } catch (error) { }
};
export const AddAssignment = async (branchDetails) => {
  try {
    console.log(branchDetails);
    let path = `assignment/${branchDetails.type}`;
    console.log(
      path,
      "++++found++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      branchDetails
    );
    const response = await axiosInstance.post(
      `assignment/${branchDetails.type}`,
      { ...branchDetails.body }
    );
    console.log(response.data, "assignment add ");
    return response.data;
  } catch (error) {
    throw error.response.data || error.message;
  }
};
export const RemoveAssignment = async (branchDetails) => {
  try {
    console.log(branchDetails, "unassign");
    const response = await axiosInstance.post(
      `assignment/${branchDetails.type}/unmap`,
      { ...branchDetails.body }
    );
    console.log(response.data, "assignment add ");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};


export const MultiAssignment = async (details) => {
  try {
    const response = await axiosInstance.post(`/assignment/${details?.type}/multiple/map`, details?.body);
    return response.data;

  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
}

export const MultiUnAssignment = async (details) => {
  try {
    const response = await axiosInstance.post(`/assignment/${details?.type}/multiple/un-map`, details?.body);
    return response.data;

  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
}