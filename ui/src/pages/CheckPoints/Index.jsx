import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const List = lazy(() => import("./List"));
const Create = lazy(() => import("./Create"));

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<List />} path="list" />
        <Route element={<Create />} path="create" />
        <Route element={<Create isEdit={true} />} path="edit" />
      </Routes>
    </Suspense>
  );
};

export default Index;