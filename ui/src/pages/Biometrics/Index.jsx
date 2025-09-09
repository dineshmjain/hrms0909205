import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader.jsx";
import Setting from "./Setting/Setting.jsx";

const Device = lazy(() => import("./Devices/index.jsx"));
const Area = lazy(() => import("./Areas/Index.jsx"))

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Device />} path="/devices/*" />
        <Route element={<Area />} path="/areas/*" />
               <Route element={<Setting />} path="/settings/*" />
      </Routes>
    </Suspense>
  );
};

export default Index;
