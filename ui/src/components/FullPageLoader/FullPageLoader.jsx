import React, { useEffect } from "react";
import "./FullPageLoader.css";
import { useSelector, useDispatch } from "react-redux";
import { setPageLoading } from "../../redux/reducer/PageLoaderReducer";

const loadingKeys = [
  "branch",
  "subOrgs",
  "department",
  "designation",
  "attendence",
  "shift",
  "user",
  "employee",
  "roles",
  "organization",
  "typeOfIndustury",
  "assignedData",
  "dashboard",
  "client",
  "clientBranch",
  "task",
  "checkpoint",
];

const FullPageLoader = () => {
  const dispatch = useDispatch();
  const pageLoading = useSelector((state) => state?.pageLoader?.pageLoading);

  // Check if any loading is true
  const anyLoading = useSelector((state) =>
    loadingKeys.some((key) => state[key]?.loading)
  );

  useEffect(() => {
    dispatch(setPageLoading(anyLoading));
  }, [anyLoading, dispatch]);

  return pageLoading ? (
    <div className="fixed z-[1000000] w-[100%] top-0 font-inter text-sm left-0 bg-[#00000093] prevent-sidebar-close h-[100vh] backdrop-blur-[1px] flex items-center justify-center flex-col gap-2 ">
      <div className="loader2"></div>
    </div>
  ) : (
    <></>
  );
};

export default FullPageLoader;
