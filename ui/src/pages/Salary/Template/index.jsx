import { Routes, Route, Navigate } from "react-router-dom";
import ListTemplates from "./ListTemplates";
import CreateTemplate from "./CreateTemplate";

export function Index() {
  return (
    <div className="flex flex-col w-full">
      <Routes>
        {/* Default redirect */}
        <Route path="/*" element={<Navigate to="list" replace />} />

        {/* Templates routes */}
        <Route path="list" element={<ListTemplates />} />
        <Route path="create" element={<CreateTemplate />} />

        {/* Handle 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default Index;
