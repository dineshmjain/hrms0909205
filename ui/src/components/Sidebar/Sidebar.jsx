/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaFileContract,
  FaDownload,
  FaTasks,
  FaHamburger,
} from "react-icons/fa";
import {
  MdFactory,
  MdFormatListBulletedAdd,
  MdMenu,
  MdMenuOpen,
} from "react-icons/md";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { routes } from "../../routes/routes";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/logo.png";

// Sample profile details (mock or move to props/global state)
// const profile = {
//   username: "Miles Heizer",
//   company: "Unilever",
//   profilePic: "https://img.mbiz.web.id/180x180/erp/R2p1IXoyVEpBMk01WOEAdaI3hHVlkuIg0wW5_pn-CJCKHSrA_n1-U1tfE7Bl5H4_4Z7AxgL0DPOmUCdPuCHHC5lWvMU5Ig3t1uDrkVN53MlWlnA",
//   link: "/"
// };
const profile = {};
const Sidebar = ({ setExpand, setHover }) => {
  const [openedMenu, setOpenedMenu] = useState({});
  const [activeName, setActiveName] = useState("");
  const [isExpand, setIsExpand] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const listRef = useRef({});
  const user = useSelector((state) => state?.user?.user);

  const modules = user?.modules || {};
  const activePath = window.location.pathname;

  useEffect(() => {
    routes.forEach((item) => {
      if (item.link && activePath.startsWith(item.link)) {
        setActiveName(item.name);
      }
    });
  }, [activePath]);

  const toggleMenu = (name) => {
    const isOpen = openedMenu[name]?.open;
    const height = listRef.current[name]?.scrollHeight || 0;

    // Reset all others and toggle only the selected one
    const newMenuState = {};
    routes.forEach((item) => {
      if (item.child) {
        newMenuState[item.name] = {
          open: false,
          height: "0px",
        };
      }
    });

    newMenuState[name] = {
      open: !isOpen,
      height: !isOpen ? `${height}px` : "0px",
    };

    setOpenedMenu(newMenuState);
  };

  const navigate = useNavigate();
  const handleNav = (item) => {
    if (item.child) {
      toggleMenu(item.name);
    } else if (item.link) {
      setActiveName(item.name);
      navigate(item.link);
    }
  };

  const hasPermission = (item) => {
    if (modules[item?.name]?.r) return true;
    if (item.child) {
      return item.child?.some((child) => hasPermission(child));
    }
    return false;
  };

  const renderMenu = (item, index, level = 0) => {
    if (!hasPermission(item)) return null;

    let isActive =
      activeName === item.name || activeName.startsWith(item.name + ".");
    const paddingLeft = ["pl-3", "pl-10", "pl-16"][level] || "pl-4";

    if (!isExpand && !isHovering && item.child) {
      isActive = item.child.some((child) => activeName === child.name);
    }

    return (

      <li key={`${item.name}-${index}`}>
        <a
          role="button"
          tabIndex={0}
          onClick={() => handleNav(item)}
          className={`group flex items-center justify-between h-10 py-0 pr-2 mb-1 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-500/90 ${paddingLeft} ${isActive
            ? "text-gray-100 font-semibold bg-pop"
            : "text-gray-100"
            }`}
        >
          <div className="flex items-center gap-2">
            {item.icon &&
              (item.icon === "dot" ? (
                <span className="h-2 w-2 bg-current rounded-full" />
              ) : (
                item.icon
              ))}
            <span
              className={`truncate ${!isExpand && !isHovering ? "opacity-0 w-0" : ""
                }`}
            >
              {item.title}
            </span>
          </div>

          {item.child && (
            <span className={!isExpand && !isHovering ? "opacity-0 w-0" : ""}>
              {openedMenu[item.name]?.open ? (
                <BiChevronRight />
              ) : (
                <BiChevronRight />
              )}
            </span>
          )}
        </a>

        {item.child && (isExpand || isHovering) && (
          <ul
            ref={(el) => (listRef.current[item.name] = el)}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: openedMenu[item.name]?.height || "0px" }}
          >
            {item.child.map((child, idx) => renderMenu(child, idx, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (

    <nav
      className={`bg-gray-50 border-r  border-gray-100 shadow-sm fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out  ${isExpand || isHovering ? "w-64" : "w-16"
        }`}
    >
      <div
        className="flex gap-2 items-center  maxsm:hidden p-1
 "
      >
        <img src={logo} alt="Logo" className="h-10" />
        {/* <span className="font-semibold max-w-fit truncate ">
              Pagar Enterprise
            </span> */}
      </div>
      {/* Toggle Expand Button */}
      <button
        onClick={() => {
          setIsExpand(!isExpand);
          setExpand(!isExpand);
        }}
        className="absolute top-16 -right-3 bg-white hover:bg-gray-100 text-gray-500 p-1 rounded-full border border-gray-200 z-50"
      >
        {isExpand ? <MdMenuOpen /> : <MdMenu />}
      </button>

      <div
        onMouseEnter={() => setIsHovering(true) || setHover(true)}
        onMouseLeave={() => setIsHovering(false) || setHover(false)}
        className="relative h-full bg-gray-800"
      >
        <SimpleBar style={{ height: "100%" }}>
          {/* Profile */}
          <div className={`flex flex-col items-center my-5 `}>
            <a
              href={profile.link}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`rounded-full border-2 border-white overflow-hidden transition-all duration-300
        ${isExpand || isHovering ? "h-24 w-24" : "h-10 w-10"}`}
              >
                {/* <img src={profile.profilePic} alt="Profile" className="block w-full h-full object-cover" /> */}
                <FaUser className="h-full w-full text-gray-50" />
              </div>
              <div
                className={`mt-3 text-base font-semibold text-gray-300 truncate transition-all
        ${isExpand || isHovering ? "opacity-100 max-h-6" : "opacity-0 max-h-0"
                  }`}
                style={{ transitionProperty: "opacity, max-height" }}
              >
                {user?.name?.firstName} {user?.name?.lastName}
              </div>
              <div
                className={`text-sm text-gray-500 truncate transition-all
        ${isExpand || isHovering ? "opacity-100 max-h-5" : "opacity-0 max-h-0"
                  }`}
                style={{ transitionProperty: "opacity, max-height" }}
              >
                {profile.company}
              </div>
            </a>
          </div>

          {/* Menu Items */}
          <div className="px-2 pb-5">
            <ul className="space-y-1">
              {routes.map((item, index) => renderMenu(item, index))}
            </ul>

            <ul className="pt-2 border-t border-gray-700 mt-2">
              <li>
                <a className="flex items-center gap-3 pl-3 text-gray-100 font-semibold h-12 hover:bg-gray-500/90 rounded-lg">
                  <MdFormatListBulletedAdd className="h-6 w-6" />
                  <span
                    // className={isExpand || isHovering ? "opacity-100 max-h-5" : "opacity-0 max-h-0"}
                  >
                    Task Management
                  </span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 pl-3 text-gray-100 font-semibold h-12 hover:bg-gray-500/90 rounded-lg">
                  <MdFactory className="h-5 w-5" />
                  <span
                    // className={isExpand || isHovering ? "opacity-100 max-h-5" : "opacity-0 max-h-0"}
                  >
                    Production Management
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </div>
    </nav>
  );
};

export default Sidebar;
