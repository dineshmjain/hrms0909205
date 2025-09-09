import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const List = lazy(() => import("./List"));
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="" replace={true} />} />
        <Route element={<List />} path="" />
      </Routes>
    </Suspense>
  );
};

export default Index;
