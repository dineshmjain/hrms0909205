import { useState } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import NavbarNew from "../components/Navbar/NavbarNew";
import { useDispatch } from "react-redux";
import OuterSidebar from "../components/Sidebar/OuterSidebar";
import toast from "react-hot-toast";
import FullPageLoader from "../components/FullPageLoader/FullPageLoader";
import { useSelector } from "react-redux";

function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const logout = () => {
    let valueToKeep = localStorage.getItem("rememberMe");
    localStorage.clear();
    sessionStorage.clear();
    if (valueToKeep) {
      localStorage.setItem("rememberMe", valueToKeep);
    }
    dispatch({ type: "LOGOUT" });
    toast.success("You Have Been Logged Out");

    navigate("/auth/sign-in");
  };

  return (
    <>
      <FullPageLoader />
      <NavbarNew logOut={logout} setShowSidebar={setShowSidebar} />

      <div className="flex  flex-1 flex-col bg-background min-h-screen  overflow-x-hidden p-2 ">
        <OuterSidebar
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />

        <main
          className={`ml-[60px] maxsm:ml-[0px] flex flex-col  h-full flex-1  sm:p-2 mt-12  overflow-x-hidden bg-background`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
