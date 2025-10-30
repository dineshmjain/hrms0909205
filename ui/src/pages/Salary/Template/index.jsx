import { Routes, Route, Navigate } from "react-router-dom";
import ListTemplates from "./ListTemplates";
import CreateTemplate from "./CreateTemplate";
import SalaryAndStatutorySettings from "../../AssistWizard/SalaryComponents";
import EditTemplate from "./EditTemplate";

export function Index() {
  return (
    <div className="flex flex-col w-full">
      <Routes>
        {/* Default redirect */}
        <Route path="/*" element={<Navigate to="list" replace />} />

        {/* Templates routes */}
        <Route path="list" element={<ListTemplates />} />
        <Route path="create" element={<CreateTemplate />} />
        <Route path="edit/:templateId" element={<EditTemplate />} />
        <Route path="wizard" element={<SalaryAndStatutorySettings />} />

        {/* Handle 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default Index;
