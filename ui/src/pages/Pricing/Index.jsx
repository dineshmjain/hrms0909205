import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../Loader/Loader";

const Add = lazy(() => import("./Add"));
const List = lazy(() => import("./List"));
const Edit = lazy(() => import("./Edit"));
const Temp = lazy(() => import("../../Temp"))
const Index = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/*" element={<Navigate to="list" replace={true} />} />
                <Route element={<Add />} path="add" />
                <Route element={<List />} path="list" />
                <Route element={<Temp />} path="temp" />
            </Routes>
        </Suspense>
    );
};

export default Index;
