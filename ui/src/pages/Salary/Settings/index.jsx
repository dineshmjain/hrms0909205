import { Routes, Route, Navigate } from "react-router-dom";
import SalarySettings from "./SalarySettings";

export function Index() {
  return (
    <div className="flex flex-col w-full">
      <Routes>
        {/* Default redirect */}
        <Route path="/*" element={<Navigate to="" replace />} />

        {/* Templates routes */}
        <Route path="" element={<SalarySettings />} />
        {/* <Route path="create" element={<CreateTemplate />} /> */}

        {/* Handle 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default Index;
