import React from 'react';
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  Typography,
} from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { PiPlusBold } from 'react-icons/pi';
import { LuPen, LuTrash2 } from 'react-icons/lu';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';
import TooltipMaterial from '../../../components/TooltipMaterial/TooltipMaterial';
import { MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';

const ShiftDialog = ({
  shiftForms,
  setShiftForms,
  forList,
  clientList,
  subOrgList,
  sortedShifts,
  updateShiftForm,
  selectedShiftsForms,
  setSelectedShiftsForms,
  handleShiftAssign,
  closeSidebar, 
  handleDisplayData, 
  initialForm,
  setIsWeekOff, 
  isWeekOff,
  openDialog,
  setOpenDialog

}) => {
  console.log(selectedShiftsForms, 'checking')

  const { user } = useSelector((state) => state?.user);

  // Get the first form or create an empty one
  const form = shiftForms?.[0] || initialForm(clientList, subOrgList, sortedShifts);
  const isClientOrg = form?.forId === 'clientOrg';

  const getInitials = (name) => {
    if (!name) return '';
    const [first, second] = name.trim().split(/\s+/);
    return (first?.[0] + (second?.[0] || '')).toUpperCase();
  };

  const handleDeleteShift = (index) => {
    setSelectedShiftsForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditShift = async (index) => {

    const forEdit = { ...selectedShiftsForms[index] }
    console.log(JSON.stringify(forEdit, null, 2))
    console.log(JSON.stringify(selectedShiftsForms[index], null, 2))
debugger
    await updateShiftForm(index, 'forId', forEdit?.forId)
    await updateShiftForm(index, 'orgId', forEdit?.subOrgId)
    await updateShiftForm(index, 'branchId', forEdit?.branchId)
    await updateShiftForm(index, 'shiftId', forEdit?.shiftId)
    await updateShiftForm(index, 'modifiedStartTime', forEdit?.startTime)
    await updateShiftForm(index, 'modifiedEndTime', forEdit?.endTime)
    await updateShiftForm(index, 'endTime', forEdit?.endTime);
    await updateShiftForm(index, 'startTime', forEdit?.startTime);
    await updateShiftForm(index, 'clientId', forEdit?.clientId);
    await updateShiftForm(index, 'clientMappedId', forEdit?.clientMappedId);
    await updateShiftForm(index, 'clientBranchId', forEdit?.clientBranchId);
  }

  React.useEffect(() => {
    if (!shiftForms.length) {
      setShiftForms([initialForm(clientList, subOrgList, sortedShifts)]);
    }
  }, [clientList, subOrgList, sortedShifts, shiftForms, setShiftForms]);

  const assignWeekOff = () => {
    try {
      setIsWeekOff(!isWeekOff);
      setSelectedShiftsForms([]);
    } catch (error) {
      console.error(error);
    }
  };

  // If dialog is not open, don't render anything
  if (!openDialog) {
    return null;
  }

  return (
    <div className='gap-2 p-2 overflow-scroll h-full'>
      <div className="text-center pt-2">
        <div className='flex justify-between px-4'>
          <div>
            <button 
              onClick={() => { 
                closeSidebar(); 
                setShiftForms([]);
                setOpenDialog(false);
              }}
              className="flex items-center justify-center transition-colors bg-primary hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full"
            >
              <MdArrowBack className="text-2xl sm:text-lg" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-gray-800 m-0">Assign Shifts</h3>
          <div>
            <button 
              onClick={handleShiftAssign} 
              className={`bg-primary text-white p-2 rounded-md transition ${
                selectedShiftsForms.length === 0 && !isWeekOff
                  ? "bg-blue-300 cursor-not-allowed"
                  : "hover:bg-primaryLight"
              }`}
              disabled={selectedShiftsForms.length === 0 && !isWeekOff}
            >
              {isWeekOff ? "Assign Week Off" : "Update"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 p-4">
        {/* Left Panel - Selected Shifts */}
        <div className="w-[25vw] bg-white rounded-md shadow-md p-4 h-fit overflow-y-auto border border-gray-200">
          <Checkbox 
            label="Apply Week Off" 
            checked={isWeekOff} 
            onChange={(e) => setIsWeekOff(e.target.checked)} 
          />

          {isWeekOff ? (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Typography className="text-sm font-semibold text-yellow-800">
                Week Off will be assigned
              </Typography>
            </div>
          ) : selectedShiftsForms.length > 0 ? (
            selectedShiftsForms.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col w-full">
                  <div className='flex justify-between'>
                    <Typography className='text-xs font-semibold'>
                      {item?.forId === "myOrg" ? "My Organization" : "Client Organization"}
                    </Typography>
                    <div className='flex'>
                      <IconButton
                        variant="text"
                        size="sm"
                        onClick={() => handleDeleteShift(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <LuTrash2 size={16} />
                      </IconButton>
                      <IconButton
                        variant="text"
                        size="sm"
                        onClick={() => handleEditShift(idx)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <LuPen size={16} />
                      </IconButton>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: item?.shiftBgColor }}
                      >
                        <Typography
                          className="text-xs font-semibold"
                          style={{ color: item?.shiftTextColor }}
                        >
                          {getInitials(item?.shiftName)}
                        </Typography>
                      </div>
                      <span className="text-sm font-medium">{item?.shiftName}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-1">
                    {item.modifiedStartTime || item.startTime} - {item.modifiedEndTime || item.endTime}
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-1">
                    {item.orgDisplayName} • {item.branchDisplayName}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col gap-2 justify-center mt-3'>
              <p className="text-gray-500 text-sm italic text-center">
                No shifts selected. Add shifts from the right panel.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Shift Selection Form */}
        <div className="w-[23vw] bg-white h-fit rounded-md shadow-md p-4 border border-gray-200">
          <h5 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Select Shifts</h5>
          
          <div className="flex flex-col gap-4">
            <SingleSelectDropdown
              inputName="Select For"
              feildName="name"
              listData={forList}
              selectedOption={form?.forId}
              selectedOptionDependency="value"
              showSearch
              hideLabel
              handleClick={(e) => updateShiftForm(0, 'forId', e.value)}
            />
            {isClientOrg ? (
              <SingleSelectDropdown
                inputName="Select Client"
                listData={form?.clientList || clientList}
                feildName="name"
                selectedOption={form?.clientId}
                selectedOptionDependency="clientId"
                showSearch
                hideLabel
                handleClick={(e) => {
                  updateShiftForm(0, 'clientId', e?.clientId);
                  updateShiftForm(0, 'clientMappedId', e?.clientMapped);
                }}
              />
            ) : (
              user?.modules?.['suborganization']?.r && (
                <SingleSelectDropdown
                  inputName="Select Organization"
                  listData={form?.subOrgList || subOrgList}
                  feildName="name"
                  selectedOption={form?.orgId}
                  selectedOptionDependency="_id"
                  showSearch
                  hideLabel
                  handleClick={(e) => updateShiftForm(0, 'orgId', e?._id)}
                />
              )
            )}

            <SingleSelectDropdown
              inputName="Select Branch"
              listData={form?.branches || []}
              feildName="name"
              selectedOption={isClientOrg ? form?.clientBranchId : form?.branchId}
              selectedOptionDependency="_id"
              showSearch
              hideLabel
              handleClick={(e) =>
                updateShiftForm(0, isClientOrg ? 'clientBranchId' : 'branchId', e?._id)
              }
            />

            <SingleSelectDropdown
              inputName="Select Shift"
              listData={form?.shifts || sortedShifts || []}
              feildName="mname"
              selectedOption={form?.shiftId}
              selectedOptionDependency="_id"
              showSearch
              hideLabel
              handleClick={(e) => {
                updateShiftForm(0, 'shiftId', e._id);
                updateShiftForm(0, 'shiftName', e.name);
                updateShiftForm(0, 'startTime', e.startTime);
                updateShiftForm(0, 'endTime', e.endTime);
              }}
            />

            <Input
              label="Start Time"
              type="time"
              value={form?.modifiedStartTime || form?.startTime || ''}
              onChange={(e) => updateShiftForm(0, 'modifiedStartTime', e.target.value)}
            />
            
            <Input
              label="End Time"
              type="time"
              value={form?.modifiedEndTime || form?.endTime || ''}
              onChange={(e) => updateShiftForm(0, 'modifiedEndTime', e.target.value)}
            />

            <div className="flex justify-end pt-2">
              <TooltipMaterial content="Click to add shift">
                <Button
                  size="sm"
                  className="bg-primary text-sm text-white shadow-md hover:bg-primaryLight hover:text-primary transition flex gap-2"
                  onClick={() => handleDisplayData(form)}
                  disabled={!form.shiftId || !form.forId}
                >
                  <PiPlusBold size={18} />
                  Add Shift
                </Button>
              </TooltipMaterial>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftDialog;