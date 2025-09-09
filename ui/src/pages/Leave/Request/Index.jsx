import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";

const Request = lazy(() => import("./List"));
const RequestAdd = lazy(() => import("./ApproveReject"));
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<Request />} path="list" />
         <Route element={<RequestAdd />} path="ApproveReject" />
      </Routes>
    </Suspense>
  );
};

export default Index;