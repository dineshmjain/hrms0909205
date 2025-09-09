import React from 'react';
import {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Button,
    Input,
} from '@material-tailwind/react';
import { Toaster } from 'react-hot-toast';
import { PiPlusBold, PiTrashFill } from 'react-icons/pi';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';

const ShiftDialog = ({
    openDialog,
    setOpenDialog,
    shiftForms,
    setShiftForms,
    forList,
    clientList,
    subOrgList,
    sortedShifts,
    handleShiftAssign,
    updateShiftForm,
    removeShiftForm, // ✅ make sure this is passed from parent
}) => {
    const handleAddShiftForm = () => {
        setShiftForms((prev) => [
            ...prev,
            {
                forId: '',
                clientId: '',
                clientMappedId: '',
                orgId: '',
                clientBranchId: '',
                branchId: '',
                shiftId: '',
                shiftName: '',
                branches: [],
                shifts: [],
            },
        ]);
    };

    return (
        <Dialog open={openDialog} size="xl" handler={() => setOpenDialog(false)}>
            <Toaster />
            <DialogHeader>
                <h3 className="text-lg font-semibold">Assign Shifts</h3>
            </DialogHeader>

            <DialogBody>
                {shiftForms.map((form, index) => {
                    const isClientOrg = form?.forId === 'clientOrg';

                    return (
                        <div key={index} className="flex items-center gap-4 mb-3 flex-wrap">
                            {/* For Selector */}
                            <SingleSelectDropdown
                                inputName="Select For"
                                feildName="name"
                                listData={forList}
                                selectedOption={form?.forId}
                                selectedOptionDependency="value"
                                showSearch
                                hideLabel
                                handleClick={(e) => {
                                    updateShiftForm(index, 'forId', e.value);
                                }}
                            />

                            {/* Organization / Client Selector */}
                            {isClientOrg ? (
                                <SingleSelectDropdown
                                    inputName="Select Client"
                                    listData={form?.clientList}
                                    feildName="name"
                                    selectedOption={form?.clientId}
                                    selectedOptionDependency="clientId"
                                    showSearch
                                    hideLabel
                                    handleClick={(e) => {

                                        console.log(e, 'selected client in shift dialog');
                                        updateShiftForm(index, 'clientId', e?.clientId);
                                        updateShiftForm(index, 'clientMappedId', e?._id);
                                    }}
                                />
                            ) : (
                                <SingleSelectDropdown
                                    inputName="Select Organization"
                                    listData={form?.subOrgList}
                                    feildName="name"
                                    selectedOption={form?.orgId}
                                    selectedOptionDependency="_id"
                                    showSearch
                                    hideLabel
                                    handleClick={(e) => updateShiftForm(index, 'orgId', e?._id)}
                                />
                            )}

                            {/* Branch Selector */}
                            <SingleSelectDropdown
                                inputName="Select Branch"
                                listData={form?.branches}
                                feildName="name"
                                selectedOption={isClientOrg ? form?.clientBranchId : form?.branchId}
                                selectedOptionDependency="_id"
                                showSearch
                                hideLabel
                                handleClick={(e) =>
                                    updateShiftForm(index, isClientOrg ? 'clientBranchId' : 'branchId', e?._id)
                                }
                            />

                            {/* Shift Selector */}
                            <SingleSelectDropdown
                                inputName="Select Shift"
                                listData={form?.shifts}
                                feildName="mname"
                                selectedOption={form?.shiftId}
                                selectedOptionDependency="_id"
                                showSearch
                                hideLabel
                                handleClick={(e) => {
                                    updateShiftForm(index, 'shiftId', e._id);
                                    updateShiftForm(index, 'shiftName', `${e.name} ${e.startTime} ${e.endTime}`);
                                    updateShiftForm(index, 'startTime', e.startTime);
                                    updateShiftForm(index, 'endTime', e.endTime);
                                }}
                            />

                            <div><Input label='startTime' type='time' value={form?.startTime} onChange={(e) => { updateShiftForm(index, 'startTime', e) }} />
                            </div>
                            <div>
                                <Input label='enTime' type='time' value={form?.endTime} onChange={(e) => { updateShiftForm(index, 'endTime', e) }} />
                            </div>

                            {/* Remove Form */}
                            <IconButton
                                variant="text"
                                size="md"
                                onClick={() => removeShiftForm(index)}
                            >
                                <PiTrashFill className="h-5 w-5" color="red" />
                            </IconButton>

                            {/* Add Form - Only on Last */}
                            {index === shiftForms.length - 1 && (
                                <IconButton
                                    className="bg-primary shadow-md"
                                    size="md"
                                    onClick={handleAddShiftForm}
                                >
                                    <PiPlusBold className="h-5 w-5" color="white" />
                                </IconButton>
                            )}
                        </div>
                    );
                })}

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outlined" onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button color="blue" onClick={handleShiftAssign}>
                        Assign
                    </Button>
                </div>
            </DialogBody>
        </Dialog>
    );
};

export default ShiftDialog;
