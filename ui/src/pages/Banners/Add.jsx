
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import React, { useRef, useState } from "react";
import { Input, Textarea, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";

const AddBanner = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [time, setTime] = useState("");
    const [file, setFile] = useState(null);

    const uploadImage = async () => {
        console.log(file, "recived");
        if (!file) {
            console.error("No file provided");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("time", time);
            const response = await axiosInstance.post(
                "banner/add",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success(response.data?.message)
            navigate("banners/list");
        } catch (error) {
            console.error(
                "Image upload failed:",
                error.response?.data || error.message
            );
            throw error;
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setSelectedImage(URL.createObjectURL(file));
        }
    };
    return (
        <div className="flex flex-col w-full p-2 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
            <Header
                isBackHandler={true}
                isButton={false}
                headerLabel={"Add Banner"}
                subHeaderLabel={"Set Up Your Banner"}
            />
            <div className="ml-[3rem] mb-6">
                <div className="flex flex-wrap gap-4 mt-6">
                    <div className="w-[250px]">
                        <Typography variant="small" className="mb-2 font-medium">
                            Title
                        </Typography>
                        <input
                            size="md"
                            labelProps={'Title'}
                            placeholder="Enter Title"
                            value={title}
                            className="bg-white w-full p-2 text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                            name="title"
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-[250px]">
                        <Typography variant="small" className="mb-2 font-medium">
                            Description
                        </Typography>
                        <input
                            size="md"
                            labelProps={{ className: "hidden" }}
                            placeholder="Enter Description"
                            value={description}
                            className="bg-white w-full p-2 text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                            name="description"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-[250px]">
                        <Typography variant="small" className="mb-2 font-medium">
                            Start Date
                        </Typography>
                        <Input
                            type="date"
                            size="md"
                            labelProps={{ className: "hidden" }}
                            placeholder="Enter Start Date"
                            value={startDate}
                            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                            name="leaveNbannerNameame"
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-[250px]">
                        <Typography variant="small" className="mb-2 font-medium">
                            End Date
                        </Typography>
                        <Input
                            type="date"
                            size="md"
                            labelProps={{ className: "hidden" }}
                            placeholder="Enter Banner Name"
                            value={endDate}
                            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                            name="leaveNbannerNameame"
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-[250px]">
                        <Typography variant="small" className="mb-2 font-medium">
                            Select Time
                        </Typography>
                        <Input
                            type="time"
                            size="md"
                            labelProps={{ className: "hidden" }}
                            placeholder="Enter Timings"
                            value={time}
                            className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                            name="time"
                            onChange={(e) => {
                                setTime(e.target.value);
                            }}
                        />
                    </div>
                    <div className="pb-2 border-gray-200 items-center">
                        <Typography variant="small" className="mb-2 font-medium">
                            Select Banner
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div
                            className="text-sm text-gray-600 text-center border px-4 py-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {!selectedImage && <div>Click to upload banner image</div>}
                            {selectedImage && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={selectedImage}
                                        alt="Selected Banner"
                                        className="w-[220px] h-[140px] object-cover rounded shadow"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="w-fit mt-4 px-4 py-2 bg-primary text-white rounded shadow disabled:opacity-50"
                    onClick={uploadImage}
                    disabled={!file}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default AddBanner;