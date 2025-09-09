import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../../Loader/Loader";


const List = lazy(() => import("./List"));
const MonthLogs = lazy(() => import("./MonthLogs"));
const BranchRadiusSetting= lazy(()=> import("../BranchRadiusSetting/BranchRadiusSetting"))
const Index = () => {
  return (
    <Suspense fallback={<Loader />}>
      {/* <Routes>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<List />} />
        <Route path="monthlogs" element={<MonthLogs />} />
        <Route path="branchradiussetting" element={<BranchRadiusSetting/>}/>
      </Routes> */}

<Routes>
        <Route path="/*" element={<Navigate to="list" replace={true} />} />

        <Route element={<List />} path="list" />
        {/* <Route element={<MonthLogs />} path="monthlogs" />
          <Route element={<BranchRadiusSetting />} path="branchradiussetting" /> */}
      </Routes>
    </Suspense>
  );
};

export default Index;
