import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUploadButton from "../../components/Button/FileUploadButton";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  EmployeeBulkUploadAction,
  EmployeeSampleFormatAction,
} from "../../redux/Action/Employee/EmployeeAction";
const baseURL = import.meta.env.VITE_IMPORT_URL;

const ImportUser = ({
  noRedirect = false,
  isWizard = false,
  onUploadSuccess,
}) => {
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sampleFilePath } = useSelector((state) => state?.employee);
  const { employeeBulkCreate } = useSelector((state) => state?.employee);

  useEffect(() => {
    setClients(employeeBulkCreate?.data || []);
  }, [employeeBulkCreate?.data]);

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop();
      if (fileExtension !== "xlsx") {
        toast.error("Only Excel Files Are Allowed");
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const response = await dispatch(EmployeeBulkUploadAction(formData));
        const { meta, payload } = response;

        if (meta?.requestStatus === "fulfilled") {
          // Call the success callback to refresh the list
          if (onUploadSuccess) {
            onUploadSuccess();
          }
          if (!noRedirect) {
            navigate("/user"); // normal portal flow
          }
        } else {
          console.log(payload?.data?.data, "e");
          e.target.value = null;
          downloadFileNow(payload?.data?.data, e);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const downloadFile = async (e) => {
    try {
      console.log(sampleFilePath?.data, "found");
      if (!sampleFilePath?.data) {
        const response = await dispatch(EmployeeSampleFormatAction());

        const { meta, payload } = response;
        console.log(payload, "fresh load");
        downloadFileNow(payload?.data, e);
      } else {
        downloadFileNow(sampleFilePath?.data, e);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const downloadFileNow = async (fileData, e) => {
    console.log(fileData, "ddddddddddddddddddddddddddd");
    // let url = `${baseURL}${sampleFilePath?.data}`
    // console.log(url)

    // const link = document.createElement("a");
    // link.href = pdfUrl;
    // link.download = url;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    if (fileData) {
      let burl = `${baseURL}${fileData}`;
      const response = await axios.get(burl, {
        responseType: "blob", // Important
      });
      const fileName = burl.substring(burl.lastIndexOf("/") + 1);
      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set filename
      link.setAttribute("download", fileName); // Change file name as needed

      // Append to body and trigger click
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    }
    e.target.value = null;
  };
  return (
    <div
      className={`p-4 bg-white shadow-md rounded-lg 
        ${
          isWizard
            ? "w-full min-h-[100px]"
            : "w-full max-w-full mx-auto min-h-screen"
        }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          {!isWizard && ( // Only show back button if NOT wizard
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors bg-primary
                         hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full"
            >
              <MdArrowBack className="text-xl" />
            </button>
          )}
          <div>
            <Typography variant="h6" className="text-gray-900">
              Employee Import
            </Typography>
            <Typography variant="small" className="text-gray-600">
              Upload multiple employees using Excel or CSV
            </Typography>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            onClick={(e) => {
              downloadFile(e);
            }}
          >
            Download Sample
          </Button>
          <FileUploadButton
            type="file"
            accept=".xlsx, .xls, .csv"
            label="Import Excel"
            handleClick={handleFileUpload}
          />
        </div>
      </div>

      {/* Instructions */}
      <Card className={`${isWizard ? "w-full" : "ml-12"} bg-gray-50`}>
        <CardBody>
          <Typography variant="h6" className="mb-2 text-gray-800">
            Instructions
          </Typography>
          <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>
              <strong>Download Sample:</strong> Click the{" "}
              <em>Download Sample</em> button to get the file format.
            </li>
            <li>
              <strong>Fill Details:</strong> Enter all employee information as
              per the sample format.
            </li>
            <li>
              <strong>Import File:</strong> Once completed, use the{" "}
              <em>Import Excel</em> button to upload the file.
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default ImportUser;
