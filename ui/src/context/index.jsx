import React from "react";
import PropTypes from "prop-types";

export const MaterialTailwind = React.createContext(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
    switch (action.type) {
        case "OPEN_SIDENAV": {
            return { ...state, openSidenav: action.value };
        }
        case "SIDENAV_TYPE": {
            return { ...state, sidenavType: action.value };
        }
        case "SIDENAV_COLOR": {
            return { ...state, sidenavColor: action.value };
        }
        case "TRANSPARENT_NAVBAR": {
            return { ...state, transparentNavbar: action.value };
        }
        case "FIXED_NAVBAR": {
            return { ...state, fixedNavbar: action.value };
        }
        case "OPEN_CONFIGURATOR": {
            return { ...state, openConfigurator: action.value };
        }
        case "THEME_COLOR": {
            return { ...state, themeColor: action.value };
        }
        case "THEME_BG_COLOR": {
            return { ...state, themeBgColor: action.value };
        }
        case "THEME_TEXT_COLOR": {
            return { ...state, themeTextColor: action.value };
        }
        case "CURRENT_PATH_NAME": {
            return { ...state, currentPath: action.value };
        }
        case "RESIZE_SIDEBAR": {
            return { ...state, resizeSidebar: action.value };
        }
        case "NAV_ROUTES":{
            return {...state,navRoutes:action.value}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

export function MaterialTailwindControllerProvider({ children }) {
    const initialState = {
        openSidenav: false,
        sidenavColor: "blue",
        sidenavType: "white",
        transparentNavbar: true,
        fixedNavbar: false,
        openConfigurator: false,
        token: '',
        themeColor: localStorage.getItem("themeColor") || "light",
        themeTextColor: localStorage.getItem("themeColor") == "light" || undefined ? 'text-black' : 'text-white',
        themeBgColor: localStorage.getItem("themeColor") == "light" || undefined ? 'bg-white' : 'bg-black',
        currentPath: "/dashboard/dashboard",
        resizeSidebar: false,
        navRoutes:[]
    };

    const [controller, dispatch] = React.useReducer(reducer, initialState);
    const value = React.useMemo(
        () => [controller, dispatch],
        [controller, dispatch]
    );

    return (
        <MaterialTailwind.Provider value={value}>
            {children}
        </MaterialTailwind.Provider>
    );
}

export function useMaterialTailwindController() {
    const context = React.useContext(MaterialTailwind);

    if (!context) {
        throw new Error(
            "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
        );
    }

    return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.jsx";

MaterialTailwindControllerProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const setOpenSidenav = (dispatch, value) =>
    dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
    dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
    dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
    dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
    dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
    dispatch({ type: "OPEN_CONFIGURATOR", value });
export const setTokens = (dispatch, value) => {

    localStorage.setItem('token', value);
    dispatch({ type: "TOKEN", value })

}
export const setThemeColor = (dispatch, value) => {
    localStorage.setItem("themeColor", value); // Save theme color to localStorage
    dispatch({ type: "THEME_COLOR", value });
};

export const setThemeBgColor = (dispatch, value) => {
    dispatch({ type: "THEME_BG_COLOR", value });
};
export const setThemeTextColor = (dispatch, value) => {
    dispatch({ type: "THEME_TEXT_COLOR", value });
};

export const setCurrentPath = (dispatch, value) => {
    dispatch({ type: "CURRENT_PATH_NAME", value });
};
export const setResizeSidebar = (dispatch, value) =>{
    dispatch({ type: "RESIZE_SIDEBAR", value });
}
export const setNavRoute = (dispatch, value) => {
    dispatch({ type: "NAV_ROUTE", value });
};

