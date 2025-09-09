import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const List = lazy(() => import("./List"));
const MonthLogs = lazy(() => import("./MonthLogs"));
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<List />} />
        <Route path="monthlogs" element={<MonthLogs />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
