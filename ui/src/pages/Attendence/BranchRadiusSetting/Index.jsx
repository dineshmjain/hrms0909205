import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";
import BranchRadiusSetting from "./BranchRadiusSetting";
import UpdateBranchRadius from "./UpdateBranchRadius";

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<UpdateBranchRadius />} path="add" />
        <Route element={<BranchRadiusSetting />} path="list" />
 
        
      </Routes>
    </Suspense>
  );
};

export default Index;
