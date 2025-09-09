import {
  FaHome,
  FaBuilding,
  FaFileContract,
  FaDownload,
  FaUsers,
  FaChartLine,
  
} from "react-icons/fa";

export const sidebarStructure = [
  {
    id: "dashboard",
    name: "Dasboard",
    title: "Dasboard",
    link: "/dashboard",
    icon: <FaHome />,
  },
  {
    id: "masters",
    name: "Masters",
    title: "Masters",
    icon: <FaUsers />,
    child: [
      {
        id: "branch",
        name: "Branch",
        title: "Branch",
        icon: <FaUsers />,
      },
      {
        id: "department",
        name: "department",
        title: "Department",
        icon: <FaUsers />,
      },
    ],
  },
  {
    id: "reports",
    name: "Laporan",
    icon: <FaChartLine />,
    child: [
      {
        id: "contracts",
        name: "MoU",
        link: "/reports/mou",
        icon: <FaFileContract />,
      },
      {
        id: "downloads",
        name: "Unduhan",
        link: "/reports/download",
        icon: <FaDownload />,
      },
    ],
  },
];
