import { Input } from "@material-tailwind/react";
import Header from "../../../../components/header/Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientDefaultSettingsAddAction, ClientDefaultSettingsListAction } from "../../../../redux/Action/Client/ClientAction";
const Settings = ({ state }) => {

    const { clientDefaultSettings } =
        useSelector((state) => state.client);

    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(Boolean)

    useEffect(() => {
        setIsChecked(clientDefaultSettings?.isReportTime || false);
    }, [clientDefaultSettings]);


    const handleCheckboxChange = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        SubmitDefaultReporting(newValue);
    }


    useEffect(() => {
        getDefaultSettings()
    }, [])

    const getDefaultSettings = () => {
        dispatch(ClientDefaultSettingsListAction({ clientId: state?.clientId }))
    };

    const SubmitDefaultReporting = (checkedValue = isChecked) => {
        const payload = {
            clientId: state?.clientId,
            isReportTime: checkedValue
        }
        console.log(payload, "Submitted Api Addedit");
        dispatch(ClientDefaultSettingsAddAction(payload))
            .then(() => {
                getDefaultSettings()
            })
            .catch((err) => console.log("failed"));
    }
    return (
        <>
            <Header
                headerLabel="Settings"
                subHeaderLabel="Manage Your Client Settings"
                isButton={false}
            />
            <div className={`p-4`}>
                <div className="flex gap-4 items-center">
                    <h2 className="text-lg font-semibold">Do You Want To Enable Reporting Time</h2>
                    <label className='flex cursor-pointer select-none items-center'>
                        <div className=''>
                            <input
                                type='checkbox'
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                className="w-5 h-5"
                            />
                        </div>
                    </label>
                </div>
            </div>
        </>
    )
}


export default Settings;