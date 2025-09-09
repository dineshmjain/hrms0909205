import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";

const List = lazy(() => import("./List"));
const Daywise = lazy(() => import("./Daywise"));

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to={"/attendence"} />} />
        <Route path="/" element={<List />} />
        <Route path="/daywise" element={<Daywise />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
