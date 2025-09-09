import React, { useState } from 'react';
import Header from '../../components/header/Header';
import BasicInformation from './BasicInformation/BasicInformation';
import OwnersDetails from './OwnerDeatils/OwnersDetails';
import Address from '../../components/Address/Address';


const Add = () => {
  const [finalData, setFinalData] = useState({
    basicInfo: [],
    ownersDetails:[],
    addressDetails:[]

  });

  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
    ownersDetails:true,
    addressDetails:true

  });

  const handleSave = () => {
    const allValid = Object.values(formValidity).every(Boolean);
    if (!allValid) {
      alert('Please complete all required fields before saving.');
      return;
    }

    console.log(JSON.stringify(finalData, null, 2), '===== Final Submitted Data =====');
    // You can now send `finalData` to API or further process
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Header
        buttonTitle="Save"
        isBackHandler={true}
        headerLabel="Lead"
        subHeaderLabel="Add Your Lead Details"
        isButton={true}
        onClick={handleSave}
      />

      <div className="mx-10 flex flex-col gap-4">
        <div className="border-b border-gray-300 pb-2">
          <BasicInformation
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, basicInfo: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
            }
          />
        </div>
        <div className=" border-gray-300 ">
          <OwnersDetails
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, ownersDetails: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, ownersDetails: isValid }))
            }
          />
        </div>
             <div className=" border-gray-300 ">
                <Address onChange={(data) =>
              setFinalData((prev) => ({ ...prev, addressDetails: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, addressDetails: isValid }))
            }/>
             </div>

     

      </div>
      
    </div>
  );
};

export default Add;
