import { useSelector } from "react-redux";

export const useCheckEnabledModule = () => {
  const modules = useSelector((state) => state?.user?.modules);

  return (moduleName, type = "r") => {
    console.log("Available modules:", modules);
    if (!modules || !modules?.[moduleName]) return false;

    return modules?.[moduleName]?.[type?.toLowerCase()] === true;
  };
};
