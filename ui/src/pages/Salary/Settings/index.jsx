import { Routes, Route, Navigate } from "react-router-dom";
import SalarySettings from "./SalarySettings";
import CreateComponent from "./CreateComponent";

export function Index() {
  return (
    <div className="flex flex-col w-full">
      <Routes>
        {/* Default redirect */}
        <Route path="/*" element={<Navigate to="" replace />} />

        {/* Templates routes */}
        <Route path="" element={<SalarySettings />} />
        <Route path="create" element={<CreateComponent />} />

        {/* Handle 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default Index;
