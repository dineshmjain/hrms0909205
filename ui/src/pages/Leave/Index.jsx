import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const Policy = lazy(() => import("./Policy/List"));
const PolicyAdd = lazy(() => import("./Policy/Add"));
const PolicyEdit = lazy(() => import("./Policy/Edit"));
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<Policy />} path="list" />
        <Route element={<PolicyAdd />} path="add" />
        <Route element={<PolicyEdit />} path="edit" />
      </Routes>
    </Suspense>
  );
};

export default Index;