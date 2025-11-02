import { Formik, Form } from "formik";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";
import Header from "../../../components/header/Header";
import { clientKycGetAction, clientUpdateKYCAction } from "../../../redux/Action/Client/ClientAction";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { getAddressTypesAction } from "../../../redux/Action/Global/GlobalAction";
import FormikInput from "../../../components/input/FormikInput";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";

const KYC = ({ state }) => {
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [formData, setFormData] = useState({
        gstNumber: "",
        panNumber: "",
        registeredAddress: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        addressTypeId: ""
    });
    clientUpdateKYCAction

    const { addressTypes } = useSelector((state) => state?.global);

    useEffect(() => {
        dispatch(getAddressTypesAction());
    }, [dispatch]);

    const handleUpdate = async () => {
        try {
            const responseData = {
                "clientId": state.clientId,
                "gstNo": formData.gstNumber,
                "aadharNo": "234567890123",
                "panNo": formData.panNumber,
            };
            console.log(responseData);
            const response = await dispatch(removeEmptyStrings(clientUpdateKYCAction(responseData)));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (state) {
            dispatch(clientKycGetAction({ clientId: state?.clientId })).then(({ payload }) => {
                console.log(payload?.data, 'recived')
            })
        }
    })
    return (
        <>
            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    KYC Details
                    </h3> */}
            <Header
                headerLabel={"KYC Details"}
                // handleClick={handleUpdate}
                isButton={false}
            />
            <div className="rounded-lg p-2">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            GST Number *
                        </label>
                        <input
                            type="text"
                            value={formData.gstNumber}
                            onChange={(e) => handleInputChange("gstNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter GST number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PAN Number *
                        </label>
                        <input
                            type="text"
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange("panNumber", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter PAN number"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4 mb-4 mt-4">
                    <div className="col-span-12 md:col-span-3">
                        <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                            Select Address
                        </label>
                        <SingleSelectDropdown
                            name="addressTypeId"
                            label="Address Type"
                            inputType="dropdown"
                            listData={addressTypes}
                            inputName="Select AddressType"
                            feildName="name"
                            hideLabel={true}
                            showSerch={true}
                            handleClick={(selected) => {
                                handleInputChange("addressTypeId", selected?._id);
                            }}
                            selectedOption={formData.addressTypeId}
                            selectedOptionDependency="_id"
                        />
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <label className="text-gray-700 text-sm font-medium mb-1.5 block">
                            Registered Address
                        </label>
                        <textarea
                            name="registeredAddress"
                            value={formData.registeredAddress || ""}
                            onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
                            rows={1}
                            placeholder="Enter complete address"
                            className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-100 resize-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                        </label>
                        <input
                            type="text"
                            value={formData.landmark || ""}
                            onChange={(e) => handleInputChange("landmark", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter landmark"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            value={formData.city || ""}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter city"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <input
                            type="text"
                            value={formData.state || ""}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter state"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                        </label>
                        <input
                            type="text"
                            value={formData.pincode || ""}
                            onChange={(e) => handleInputChange("pincode", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Enter pincode"
                            maxLength="6"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default KYC;