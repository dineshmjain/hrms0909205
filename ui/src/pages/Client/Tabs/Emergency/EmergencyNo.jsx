import { Input, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Header from "../../../../components/header/Header";
import { PiPlusBold } from "react-icons/pi";
import { ImCancelCircle } from "react-icons/im";
import { MdArrowBack } from "react-icons/md";
import Table from "../../../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { ClientEmergencyContactsAction, ClientEmergencyContactsAddAction, ClientEmergencyContactsEditAction } from "../../../../redux/Action/Client/ClientAction";

const EmergencyNo = ({ state }) => {

    const { clientEmergencyContactList, loading, error, totalRecord, pageNo, limit } =
        useSelector((state) => state.client);

    const dispatch = useDispatch();
    const [numberList, setNumberList] = useState([{ name: "", mobile: "" }])
    const [selectedTab, setSelectedTab] = useState("Add", "List", "Edit");
    const [shiftList, setShiftList] = useState([]);


    useEffect(() => {
        setSelectedTab('List')
        getEmergencyContactList()
    }, [])

    const getEmergencyContactList = () => {
        dispatch(ClientEmergencyContactsAction({ clientId: state?.clientId }))
    };

    const labels = {
        name: {
            DisplayName: "Contact Name",
        },
        mobile: {
            DisplayName: "Contact Number",
        }
    }
    const actions = [
        {
            title: "Edit",
            text: <MdModeEditOutline className="w-5 h-5" />,
            onClick: (contact) => editButton(contact),
        },
        ,
    ];

      const editButton = (data) => {
        setNumberList([{ name: data.name, mobile: data.mobile, emergencyContactId: data._id,serialNo:data.serialNo }]);
        setSelectedTab('Edit')
      }

    const addContacts = () => {
        setNumberList([...numberList, { name: "", mobile: "" }]);
    };

    const removeContacts = (keyToRemove) => {
        setNumberList((prev) => prev.filter((_, index) => index !== keyToRemove));
    }

    const AddContactNumbers = () => {
        setNumberList([{ name: "", mobile: "" }])
        setSelectedTab('Add')
    }
    const handleBack = () => {
        setSelectedTab('List')
        getEmergencyContactList()
    }

    const SubmitContactNumbers = () => {
        const payload = {
            clientId: state?.clientId,
            contacts: numberList
        }
        console.log(payload, "payload");
        dispatch(ClientEmergencyContactsAddAction(payload))
            .then(() => {
                getEmergencyContactList()
                setSelectedTab('List')
            })
            .catch((err) => console.log("Assignment failed"));
    }
    const SubmitContactNumbersEdit = () => {
        const payload = {
           emergencyContactId: numberList[0].emergencyContactId,
           contacts: [{ name: numberList[0].name, mobile: numberList[0].mobile ,serialNo:numberList[0].serialNo}]
        }
        console.log(payload, "edit payload");
        dispatch(ClientEmergencyContactsEditAction(payload))
            .then(() => {
                getEmergencyContactList()
                setSelectedTab('List')
            })
            .catch((err) => console.log("Assignment failed"));
    }

    return (
        <div>
            {selectedTab == 'Add' && (
                <>
                    <div className=" p-2 flex flex-wrap sm:flex-row items-center gap-4 flex-1 min-w-[200px]">
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
                                hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                            <MdArrowBack className="text-2xl sm:text-lg" />
                        </button>
                        <div className="">
                            <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
                                Add Contact Numbers
                            </Typography>
                            <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
                                Manage Your Contact Numbers
                            </Typography>
                        </div>
                    </div>
                    <div className="ml-[3rem]">
                        <div className="w-full flex gap-4 flex-wrap p-2 mt-2">
                            {numberList.map((item, index) => (
                                <div key={index} className="flex gap-4 border-2 border-gray-300 p-2 rounded-md">
                                    <div className="flex gap-4 items-end">
                                        <div>
                                            <Typography variant="small" className="mb-2 font-medium">Contact Name</Typography>
                                            <Input
                                                size="md"
                                                labelProps={{ className: "hidden" }}
                                                placeholder="Enter Name"
                                                value={item.name}
                                                className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                                                name="name"
                                                onChange={(e) => {
                                                    const newList = [...numberList];
                                                    newList[index].name = e.target.value;
                                                    setNumberList(newList);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="small" className="mb-2 font-medium">Contact Number</Typography>
                                            <Input
                                                size="md"
                                                labelProps={{ className: "hidden" }}
                                                placeholder="Enter Number"
                                                value={item.mobile}
                                                className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                                                mobile="mobile"
                                                onChange={(e) => {
                                                    const newList = [...numberList];
                                                    newList[index].mobile = e.target.value;
                                                    setNumberList(newList);
                                                }}
                                            />
                                        </div>
                                        {numberList.length > 1 && (
                                            <div className="">
                                                <button
                                                    onClick={() => removeContacts(index)}
                                                // className="items-center bg-primary w-fit text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-2 rounded-md"
                                                >
                                                    <ImCancelCircle color='red' size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-2 flex justify-end mr-10">
                            <button onClick={addContacts} className="items-center bg-primary w-fit text-sm text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-1 rounded-md">
                                <PiPlusBold size={10} />Add More
                            </button>
                        </div>
                        <div className="p-2">
                            <button onClick={SubmitContactNumbers} className="items-center bg-green-700 w-fit text-sm text-white shadow-md transition flex gap-2 p-2 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>

                </>
            )}
            {selectedTab == 'Edit' && (
                <>
                    <div className=" p-2 flex flex-wrap sm:flex-row items-center gap-4 flex-1 min-w-[200px]">
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
                                hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                            <MdArrowBack className="text-2xl sm:text-lg" />
                        </button>
                        <div className="">
                            <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
                                Edit Contact Number
                            </Typography>
                            <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
                                Manage Your Contact Number
                            </Typography>
                        </div>
                    </div>
                    <div className="ml-[3rem]">
                        <div className="w-full flex gap-4 flex-wrap p-2 mt-2">
                            {numberList.map((item, index) => (
                                <div key={index} className="flex gap-4 border-2 border-gray-300 p-2 rounded-md">
                                    <div className="flex gap-4 items-end">
                                        <div>
                                            <Typography variant="small" className="mb-2 font-medium">Contact Name</Typography>
                                            <Input
                                                size="md"
                                                labelProps={{ className: "hidden" }}
                                                placeholder="Enter Name"
                                                value={item.name}
                                                className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                                                name="name"
                                                onChange={(e) => {
                                                    const newList = [...numberList];
                                                    newList[index].name = e.target.value;
                                                    setNumberList(newList);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Typography variant="small" className="mb-2 font-medium">Contact Number</Typography>
                                            <Input
                                                size="md"
                                                labelProps={{ className: "hidden" }}
                                                placeholder="Enter Number"
                                                value={item.mobile}
                                                className="bg-white text-gray-900 border border-gray-400 !border-t-gray-400 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                                                mobile="mobile"
                                                onChange={(e) => {
                                                    const newList = [...numberList];
                                                    newList[index].mobile = e.target.value;
                                                    setNumberList(newList);
                                                }}
                                            />
                                        </div>
                                        {/* {numberList.length > 1 && (
                                            <div className="">
                                                <button
                                                    onClick={() => removeContacts(index)}
                                                // className="items-center bg-primary w-fit text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-2 rounded-md"
                                                >
                                                    <ImCancelCircle color='red' size={20} />
                                                </button>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* <div className="p-2 flex justify-end mr-10">
                            <button onClick={addContacts} className="items-center bg-primary w-fit text-sm text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2 p-1 rounded-md">
                                <PiPlusBold size={10} />Add More
                            </button>
                        </div> */}
                        <div className="p-2">
                            <button onClick={SubmitContactNumbersEdit} className="items-center bg-green-700 w-fit text-sm text-white shadow-md transition flex gap-2 p-2 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>

                </>
            )}
            {selectedTab == 'List' && (
                <>
                    <Header
                        headerLabel="Contact Details"
                        subHeaderLabel="Manage Contact Numbers"
                        handleClick={AddContactNumbers}
                        isButton={true}
                    />
                   
                     <div className="pt-4 pl-2">
                        <div>
                            <Table
                                tableName="Shift"
                                tableJson={clientEmergencyContactList}
                                labels={labels}
                                  onRowClick={editButton}
                                actions={actions}
                            //   paginationProps={{
                            //     totalRecord: totalRecord,
                            //     pageNo: pageNo,
                            //     limit: limit,
                            //     onDataChange: (page, limit, name = "") => {
                            //       getShiftList({ page, limit, name });
                            //     },
                            //   }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}


export default EmergencyNo;