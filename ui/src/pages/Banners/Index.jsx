import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMaterialTailwindController } from "../../context";
import List from "./List";
import Add from "./Add";
import Edit from "./Edit";



export function Index() {
    const currentPath = useLocation();
    const [isPath, setIsPath] = useState(false);
    const [controller] = useMaterialTailwindController();
    const { navRoutes } = controller;
// const {setSubMenuItems}=useLayoutContext()


    return (
        <div className="flex flex-col w-full">
            <Routes>
                <Route path="/*" element={<Navigate to="list" replace={true} />} />
                <Route path="list" element={<List />} />
                <Route path="add" element={<Add />} />
                <Route path="edit" element={<Edit />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </div>
    );
}

export default Index;
