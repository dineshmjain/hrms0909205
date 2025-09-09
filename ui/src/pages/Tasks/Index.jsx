import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";
const List = lazy(() => import("./List"));

const Index = ({pageName}) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<List pageName={pageName} />} path="list" />
      </Routes>
    </Suspense>
  );
};

export default Index;
