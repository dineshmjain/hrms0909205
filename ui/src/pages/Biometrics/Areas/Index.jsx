import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";


const Add = lazy(() => import("./Add"));
const List = lazy(() => import("./List"));

const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Default route when /devices is hit */}
        <Route index element={<Navigate to="list" replace />} />

        {/* Child routes under /devices */}
        <Route path="add" element={<Add />} />
        <Route path="list" element={<List />} />
      </Routes>
    </Suspense>
  );
};

export default Index;
