import React, { Component, lazy, Suspense, useEffect, useState } from "react";
import SideDrawer from "../Drawer/SideDrawer";
import Loader from "../../pages/Loader/Loader";

const EmployeeSidebar = lazy(() => import("./SidebarSection/EmployeeSidebar"));

const AssignSidebar = ({
  type,
  assignedData,
  setAssignedData,
  handleUpdate,
  handleSubTaskChange,
  parentData,
  modules = ["Employee"],
  pageType,
  limit,
  selectedList,
}) => {
  const [employeeList, setEmployeeList] = useState([]);

  const handleSetFromParent = () => {
    let empArray = [];

    const tempEmpList = parentData?.filter((data) => {
      empArray?.push(data?._id);
      return data;
    });

    setEmployeeList(tempEmpList);
  };

  useEffect(() => {
    handleSetFromParent();
  }, [parentData, assignedData]);

  return (
    <Suspense fallback={<Loader />}>
      <SideDrawer
        heading={`Assgin Empolyee to ${type}`}
        isOpen={Object?.keys(assignedData)?.length}
        onClose={() => setAssignedData({})}
        bringToFront={true}
      >
        <EmployeeSidebar
          key="employeeSidebar"
          assignedData={assignedData}
          setAssignedData={setAssignedData}
          handleUpdate={handleUpdate}
          handleSubTaskChange={handleSubTaskChange}
          selectedList={selectedList}
          employeeList={employeeList}
          pageType={pageType}
          type={type}
          limit={limit}
          modules={modules}
        />
      </SideDrawer>
    </Suspense>
  );
};

export default AssignSidebar;
