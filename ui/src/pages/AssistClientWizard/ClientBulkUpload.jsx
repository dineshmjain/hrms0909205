import React, { useEffect, useState } from 'react';
import { MdArrowBack, MdCloudUpload, MdDownload, MdCheckCircle, MdInfoOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clientBulkUploadAction, clientSampleFormatAction } from '../../redux/Action/Client/ClientAction';
import axios from 'axios';

const baseURL = import.meta.env.VITE_MEDIA_BASE_URL_HRMS;

const ClientBulkUpload = () => {
    const [clients, setClients] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sampleFilePath } = useSelector((state) => state?.client);
    const { clientBulkCreate } = useSelector((state) => state?.client);

    useEffect(() => {
        setClients(clientBulkCreate?.data || []);
    }, [clientBulkCreate?.data]);

    const handleFileUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);
            const response = await dispatch(clientBulkUploadAction(formData));
            const { meta, payload } = response;

            if (meta?.requestStatus === "fulfilled") {
                navigate('/auth/assist-client/bulkupload/requirements');
            } else {
                console.log(payload?.data?.data, 'e');
                downloadFileNow(payload?.data?.data, e);
                e.target.value = null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            e.target.value = null;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileUpload(fakeEvent);
        }
    };

    const downloadFile = async () => {
        try {
            console.log(sampleFilePath?.data, 'found');
            if (!sampleFilePath?.data) {
                const response = await dispatch(clientSampleFormatAction());
                const { meta, payload } = response;
                console.log(payload, 'fresh load');
                downloadFileNow(payload?.data);
            } else {
                downloadFileNow(sampleFilePath?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const downloadFileNow = async (fileData, e) => {
        console.log(fileData, 'downloading');
        
        if (fileData) {
            let burl = `${baseURL}${fileData}`;
            const response = await axios.get(burl, {
                responseType: 'blob',
            });
            const fileName = burl.substring(burl.lastIndexOf('/') + 1);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        }
        if (e) {
            e.target.value = null;
        }
    };

    return (
        <div
            className="min-h-screen py-8 px-4 relative overflow-hidden w-full"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #1E40AF 100%)",
            }}
        >
            {/* Animated grid pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" patternUnits="userSpaceOnUse" width="60" height="60">
                            <rect
                                x="0"
                                y="0"
                                width="60"
                                height="60"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-8 lg:px-16 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
                            >
                                <MdArrowBack className="text-xl" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Bulk Client Import
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Upload multiple clients using Excel or CSV files
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={downloadFile}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                            <MdDownload className="text-xl" />
                            Download Sample
                        </button>
                    </div>

                    {/* Upload Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side - Upload Box */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    Upload File
                                </h2>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                                        isDragging
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        id="file-upload"
                                    />
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                                            <MdCloudUpload className="text-4xl text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900 mb-1">
                                                Drop your file here, or{' '}
                                                <label
                                                    htmlFor="file-upload"
                                                    className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                                                >
                                                    browse
                                                </label>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Supports: .xlsx, .xls, .csv
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* File Requirements */}
                            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <MdInfoOutline className="text-yellow-600 text-xl mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-yellow-800 mb-1">
                                            Important Notes
                                        </h3>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>• Ensure all required fields are filled</li>
                                            <li>• Follow the exact format from the sample file</li>
                                            <li>• Maximum file size: 10MB</li>
                                            <li>• Duplicate entries will be skipped</li>
                                        </ul>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* Right Side - Instructions */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                How to Import Clients
                            </h2>
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Download Sample File
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Click the "Download Sample" button to get the template file with the correct format and column headers.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Fill in Client Details
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Enter all client information in the downloaded file. Make sure to include all required fields and follow the format exactly.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Upload the File
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Once completed, drag and drop your file into the upload area or click to browse and select the file.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                                        4
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            Review & Confirm
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            The system will validate your data. If there are errors, you'll receive a report to fix them.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Success Info */}
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <MdCheckCircle className="text-green-600 text-xl mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-green-800 mb-1">
                                            Bulk Upload Benefits
                                        </h3>
                                        <p className="text-sm text-green-700">
                                            Save time by importing multiple clients at once. Perfect for initial setup or migrating from other systems.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientBulkUpload;