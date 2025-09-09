import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const Dashboard = lazy(() => import("./Dashboard"));



const Index = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/*" element={<Navigate to="/dashboard" replace={true} />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
