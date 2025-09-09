import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";

const History = lazy(() => import("./List"));
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<History />} path="list" />
      </Routes>
    </Suspense>
  );
};

export default Index;