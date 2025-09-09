import React, { useMemo, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdFactory } from "react-icons/md";
import { RxDotFilled, RxExternalLink } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { routes } from "../../routes/routes";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import logo from "../../assets/logo.png";

const OuterSidebar = ({ showSidebar, setShowSidebar }) => {
  const nav = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const modules = useSelector((state) => state?.user?.modules);

  const checkModule = useCheckEnabledModule();
  const navigateToOtherProduct = (productId) => {
    const baseUrl = window.location.origin;
    const urls = {
      1: `${baseUrl}/production`,
      2: `${baseUrl}/taskManagement`,
    };
    return window.open(urls[productId] || "/dashboard", "_blank");
  };
  const allowedRoute = useMemo(() => {
    let temp = [];
    // if (!modules) return temp;
    routes?.forEach((main) => {
      if (!main?.child) {
        if (checkModule(main?.name, "r")) {
          temp?.push(main);
        }
      } else {
        let childTemp = main?.child?.filter((child) => {
          return checkModule(child?.name, "r");
        });

        if (childTemp?.length) {
          let newTemp = { ...main, child: childTemp };
          temp?.push(newTemp);
        }
      }
    });

    return temp;
  }, [modules]);

  const childNotActive = (main,currentPath) => {
    let status = false
    main?.child?.forEach((sub)=>{
      
      // console.log(currentPath == sub?.link?.split("/")[0] , currentPath , sub?.link?.split("/")[0]);
      if(currentPath == sub?.link?.split("/")[0]) status = true
    })
    return status
  }

  return (
    <aside>
      <div
        className={` sidebar group bg-white w-[50px] sm:hover:w-[250px] transition-smooth select-none fixed top-0 left-0 z-50 shadow-sm shadow-gray-500 flex flex-col items-center gap-2 maxsm:p-0 maxsm:w-[0px]  ${
          showSidebar ? "maxsm:w-[250px] maxsm:p-2" : ""}`}>
        <div className="flex gap-2  maxsm:hidden p-1">
          <img src={logo} alt="Logo" className="w-[50px] h-[35px]" />
        </div>
        <div className="flex flex-col w-full flex-1 gap-4 overflow-y-scroll sidebar-scroll">
          <div className="flex flex-col w-full gap-4">
            {allowedRoute.map((main, mainIdx) => {
              //code to check if the moudule being rendered is the one that is selected so we can highligh it
              const mainPath = main?.link?.split("/")[0];
              const currentPath = pathname?.split("/")[1];

              const isMainSelected =
                !main?.isNested && mainPath === currentPath;

              const isSubSelected = main?.child?.some(
                (sub) => sub.link.split("/")[0] === currentPath
              );

              const isSelected = isMainSelected || isSubSelected;

              return (
                <div
                  key={mainIdx}
                  className="flex w-full relative flex-col group/main gap-1"
                >
                  <input
                    type="checkbox"
                    id={main?.title}
                    className="hidden peer"
                  />

                  <label
                    htmlFor={main?.title}
                    className={`flex items-center gap-2 p-2 pl-3 w-full cursor-pointer text-black transition-smooth hover:bg-primaryLighter  hover:text-primary ${
                      isSelected ? "bg-primaryLighter text-primary " : ""
                    }`}
                      onClick={() => {
                        if (!main?.child) {
                          setShowSidebar(false);
                          nav(main?.link);
                        }
                      }}>
                    <div className="w-5 h-5 flex items-center justify-center">
                      {isSelected ? main?.iconSelected : main.icon}
                    </div>
                    <span
                      className={`hidden group-hover:flex text-sm font-normal capitalize truncate flex-1 
                        maxsm:flex
                      `}
                      
                    >
                      {main?.title}
                    </span>
                    {main?.child && (
                      <IoIosArrowDown className="hidden group-hover:flex w-4 h-4 transition-transform duration-300 peer-checked:rotate-180" />
                    )}
                  </label>
                  {main?.child && (
                    <label
                    htmlFor={main?.title}
                    className="flex flex-col gap-1 max-h-0 peer-checked:max-h-[500px] overflow-hidden transition-smooth duration-300 ease-in-out ml-5 border-l-2 border-faded"
                    >
                      {main?.child.map((sub, subIdx) => {
                        const isSubActive =
                          currentPath == sub.link?.split("/")[0];

                        return (
                          <div
                            key={subIdx}
                            className={`pl-4 flex items-center gap-2 px-2 py-2 w-full cursor-pointer  border-l-2 border-white group-hover:text-pop  text-white transition-smooth hover:bg-primaryLight hover:text-primary  ${
                              isSubActive ? "text-enhancer border-l-2 !border-enhancer group-hover:bg-enhancerLight" : ""
                            }`}
                            onClick={() => {
                              nav(main.link + sub.link);
                              setShowSidebar(false);
                            }}
                          >
                            {/* <div className="w-5 h-5 flex items-center justify-center">
                              {sub.icon}
                            </div> */}
                            <span className="flex text-sm font-normal capitalize truncate maxsm:flex">
                              {sub.title}
                            </span>
                          </div>
                        );
                      })}
                    </label>
                  )}
                </div>
              );
            })}

            {/* External Links
            {[
              { id: 1, label: "Production Management", icon: <MdFactory /> },
              { id: 2, label: "Task Management", icon: <FaTasks /> },
            ].map((item) => (
              <>
              <div
                key={item.id}
                className="flex w-full relative flex-col group/main hover:bg-white/20 transition-smooth rounded-md"
                onClick={() => navigateToOtherProduct(item.id)}
              >
                <div className="flex items-center gap-2 p-2 w-full cursor-pointer text-secondary">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span
                    className={`hidden group-hover:flex text-gray-900 text-sm font-medium capitalize truncate flex-1 ${
                      showSidebar && "maxsm:flex"
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="hidden group-hover/main:flex">
                    <RxExternalLink />
                  </div>
                </div>
              </div>
               </>
            ))} */}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default OuterSidebar;
