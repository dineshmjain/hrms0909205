import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useCheckEnabledModule } from "../hooks/useCheckEnabledModule";

const ProtectedRoute = ({ children }) => {
  const pageData = {
    list: "r",
    add: "c",
    edit: "u",
  };

  const modules = useSelector((state) => state?.user?.modules);
  const isInSetupMode = useSelector((state) => state.setupMode.active);
  const location = useLocation();

  const [currentPage, subPage] = location.pathname?.split("/")?.filter(Boolean);
  const checkModule = useCheckEnabledModule();
  const resolvedSubPage = subPage ?? "list"; // default to "list" if subPage is undefined

  if (isInSetupMode && !location.pathname.startsWith("/setup")) {
    return <Navigate to="/setup" replace />;
  }

  // if (
  //   modules &&
  //   currentPage &&
  //   pageData?.[resolvedSubPage] &&
  //   checkModule(currentPage, pageData?.[resolvedSubPage]) === false
  // ) {
  //   return <Navigate to="/NotFound" replace />;
  // }

  return children;
};

export default ProtectedRoute;
