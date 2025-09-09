import React, { useState } from "react";
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import Header from "../../../components/header/Header";
import ApiCreatials from "./ApiCreatials";

const Setting = () => {
    const [appKey, setAppKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleSave = () => {
        console.log("App Key:", appKey);
        console.log("Secret Key:", secretKey);
        // Save logic (API, local storage, etc.)
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-4 p-4 w-full h-full border border-gray-200 rounded-md bg-white shadow-sm">
            {/* Credentials Card */}
            <Header headerLabel={"Biometric Settings"} subHeaderLabel={"Manage Your Biometric Settings"} isButton={false} />
            <ApiCreatials />
        </div>
    );
};

export default Setting;
