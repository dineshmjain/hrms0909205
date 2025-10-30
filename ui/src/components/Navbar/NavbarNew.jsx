import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { usePrompt } from "../../context/PromptProvider";
import { useSelector } from "react-redux";
import { PiBell, PiUserCircle } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";



const Navbar = ({ setShowSidebar, logOut }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { showPrompt, hidePrompt } = usePrompt();
  const navigate = useNavigate();
  const checkModules = useCheckEnabledModule();
  const user = useSelector((state) => state?.user?.user);

  const getProfile = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
    navigate("/Profile");
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full text-pop flex justify-between p-3 sm:p-1 items-center z-40 bg-white shadow-nav">
        <div className="flex items-center">


          <FiMenu
            className="h-6 w-6 mr-4 text-gray-900 rounded-xl maxsm:flex hidden"
            onClick={() => setShowSidebar((prev) => !prev)}
          />
          {/* <h1 className="text-xl font-bold">Security Management</h1> */}
        </div>
        <span className="font-medium max-w-fit truncate text-pop capitalize">
          {user?.orgName}
        </span>
        <div className="flex items-center space-x-4">
          <button className="relative">
            <PiBell className="h-10 w-10 hover:bg-primaryLight hover:text-primary hover:rounded-full p-1" />
          </button>

          {/* Profile Icon */}
          <div className="relative flex">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <PiUserCircle className="h-10 w-10 hover:bg-primaryLight hover:text-primary hover:rounded-full p-1" />
            </button>
            {/* Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-5 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-md py-2 z-50 ">
                <button
                  onClick={() => {
                    // setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    getProfile()
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    showPrompt({
                      heading: "Are You Sure?",
                      message: "you want to logout?",
                      buttons: [
                        {
                          label: "Yes",
                          type: 1,
                          onClick: () => {
                            hidePrompt();
                            logOut();
                          },
                        },
                        {
                          label: "No",
                          type: 0,
                          onClick: () => {
                            hidePrompt();
                          },
                        },
                      ],
                    });
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
