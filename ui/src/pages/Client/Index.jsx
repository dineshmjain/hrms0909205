import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";
import ImportClient from "./ImportClient";

const Add = lazy(() => import("./Add"));
const List = lazy(() => import("./List"));
const Edit = lazy(() => import("./Edit"));
const ClientWizard = lazy(() => import("../ClientWizard/Index"))
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />
        <Route element={<Add />} path="add" />
        <Route element={<List />} path="list" />
        <Route element={<Edit />} path="edit" />
        <Route element={<ImportClient />} path="import" />
        <Route element={<ClientWizard />} path="wizard" />
      </Routes>
    </Suspense>
  );
};

export default Index;
