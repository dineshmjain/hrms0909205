import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table/Table";
import { BannerGetListAction } from "../../redux/Action/Banner/BannerAction";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { use } from "react";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../context/PromptProvider";
import { Button, Chip } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { removeEmptyStrings } from "../../constants/reusableFun";
import axiosInstance from "../../config/axiosInstance";
const List = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const checkMoudles = useCheckEnabledModule();
    const { showPrompt, hidePrompt } = usePrompt();
    const {
        BannerList
    } = useSelector((state) => state.banner);

    useEffect(() => {
        getBannerList({ page: 1, limit: 10 });
    }, [dispatch]);

    const addButton = () => navigate("/banners/add");
    const editButton = (bannerDetails) => navigate("/banners/edit", { state: bannerDetails });
    const deleteButton = (bannerDetails) => {
        showPrompt({
            heading: "Are you sure?",
            message: (
                <span>
                    Are you sure you want to delete this banner?{" "}
                </span>
            ),
            buttons: [
                {
                    label: "Yes",
                    type: 1,
                    onClick: () => {
                        confirmDelete(bannerDetails);
                    },
                },
                {
                    label: "No",
                    type: 0,
                    onClick: () => {
                        return hidePrompt();
                    },
                },
            ],
        });
    }

    const confirmDelete = async (bannerDetails) => {
        try {
            await axiosInstance.post("banner/delete", { bannerId: bannerDetails._id });
            toast.success("Banner deleted successfully");
            getBannerList();
            
        } catch (error) {
            console.error("Failed to delete banner:", error);
            toast.error("Failed to delete banner");
        }
        hidePrompt();
    }


    const getBannerList = (params) => {
        let finalParams = {}
        let updatedParams = {
            "portalType":true
            // page: params.page,
            // limit: params.limit,
            // search: params.name
        };
        // if (checkMoudles("policy", "r")) {
        finalParams = removeEmptyStrings({ ...updatedParams });
        // }
        dispatch(BannerGetListAction(finalParams));
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
                <Header
                    handleClick={addButton}
                    buttonTitle={"Add"}
                    headerLabel={"Banners"}
                    subHeaderLabel={"Overview of Your Banners"}
                />
                <div className="flex flex-wrap gap-4">
                    {Object.entries(BannerList).map(([data, details], idx) => {
                        const url = import.meta.env.VITE_BASE_URL.replace(/\/+$/, "");
                        return (
                            <div
                                key={idx}
                                className="group relative w-[280px] h-[160px] rounded-xl shadow-md overflow-hidden bg-gray-100">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={url + details.image}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <button onClick={() => editButton(details)}
                                    className="absolute top-3 right-3 opacity-0 scale-75 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-90 bg-primaryLight p-2 rounded-full shadow-md text-primary hover:bg-primaryLight/90"
                                >
                                    <MdModeEditOutline className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteButton(details)}
                                    className="absolute top-12 right-3 opacity-0 scale-75 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-90 bg-primaryLight p-2 rounded-full shadow-md text-primary hover:bg-primaryLight/90"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                    {BannerList.length ==0 && (
                        <div className="text-center">
                            <h3 className="text-xl">No Banners Found</h3>
                        </div>
                    )}
            </div>
        </>
    );
};

export default List;