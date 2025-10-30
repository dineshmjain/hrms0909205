import { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import OuterSidebar from "../components/Sidebar/OuterSidebar";

function DashboardLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarHovering, setIsSidebarHovering] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const contentMarginClass = isSidebarExpanded ? "ml-72" : "ml-20";
  const effectiveSidebarWidth =
    isSidebarExpanded || isSidebarHovering ? "ml-64" : "ml-16";
  const navigate = useNavigate();
  const logout = () => {
    // s;
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });

    navigate("/auth/sign-in");
  };
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  return (
    <>
      <Navbar
        isSidebarExpanded={isSidebarExpanded}
        isSidebarHovering={isSidebarHovering}
        logout={logout}
      />

      <div className="flex  flex-1 flex-col justify-center px-4 py-6 min-h-screen ">
        {/* Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          setExpand={toggleSidebar}
          setHover={setIsSidebarHovering}
        />
        {/* <OuterSidebar
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        /> */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${effectiveSidebarWidth} my-5 mt-6 py-5`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
