import React, { useEffect, useState } from "react";
import { Shield, Search } from "lucide-react";
import { Switch } from "@material-tailwind/react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../config/axiosInstance";
import Header from "../../components/header/Header";

const DesignationAsService = () => {
  const [designationList, setDesignationList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDesignationList();
  }, []);

  const getDesignationList = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/designation/get/asService");
      setDesignationList(data?.data || []);
    } catch (error) {
      toast.error("Failed to load designations");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleService = async (designation) => {
    try {
      await axiosInstance.post("/designation/update/asService", {
        designationId: designation._id,
        isService: !designation.isService,
      });
      
      toast.success(
        `${designation.name} ${!designation.isService ? "enabled" : "disabled"}`
      );
      
      await getDesignationList();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  // Filter designations
  const filteredList = designationList.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      {/* Header */}
      <Header
        isButton={false}
        headerLabel={"Designation as Service"}
        subHeaderLabel={"Manage designation service availability"}
      />

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search designations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No designations found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Designation Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Service Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredList?.sort((a, b) => b.isService - a.isService).map((designation) => (
                <tr key={designation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          designation.isService
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 ${
                            designation.isService
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {designation.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={designation.isService}
                        onChange={() => handleToggleService(designation)}
                      />
                      <span
                        className={`text-sm font-medium ${
                          designation.isService
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {designation.isService ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DesignationAsService;