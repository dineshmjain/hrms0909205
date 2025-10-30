import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { useMaterialTailwindController } from "../../context";
import Loader from "../Loader/Loader";
import ClientBulkUpload from "../AssistClientWizard/ClientBulkUpload";
import ClientBulkRequirementsandCheckPoint from "../AssistClientWizard/ClientBulkRequirementsandCheckPoint";

const Login = lazy(() => import("./Login"));
const SignUp = lazy(() => import("./SignUp"));
const Subscription = lazy(() => import("../Subscription/Plans"));
const OrgCreate = lazy(() => import("../Organization/Add"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const AssistWizard = lazy(() => import("../AssistWizard/AssistWizard"));
const ClientAssistWizard = lazy(() => import("../AssistClientWizard/Index"))

export function Index() {
  const currentPath = useLocation();
  const [isPath, setIsPath] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { navRoutes } = controller;

  // const {setSubMenuItems}=useLayoutContext()
  //     useEffect(() => {

  //         setSubMenuItems([])
  //         // Check if the current path matches the specific route
  //         setIsPath(currentPath.pathname === '/dashboard/branch/list');
  //     }, [currentPath.pathname]);

  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Default route to redirect to 'list' */}
          <Route path="/*" element={<Navigate to="login" replace={true} />} />
          <Route element={<Login />} path="login" />
          <Route element={<SignUp />} path="sign-up" />
          <Route element={<Subscription />} path="subscription" />
          <Route element={<ForgotPassword />} path="forgot-password" />
          <Route element={<OrgCreate />} path="org" />
          <Route element={<AssistWizard />} path="assist-wizard" />
          <Route element={<ClientAssistWizard />} path="assist-client" />
          <Route element={<ClientBulkUpload />} path="assist-client/bulkupload" />
           <Route element={<ClientBulkRequirementsandCheckPoint/>} path="assist-client/bulkupload/requirements"/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default Index;
