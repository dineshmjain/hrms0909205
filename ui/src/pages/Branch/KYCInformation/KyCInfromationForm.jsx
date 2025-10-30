// KYCInformationForm.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import { useLocation } from 'react-router-dom';

import Header from '../../../components/header/Header';
import FormikInput from '../../../components/Input/FormikInput';
import AddressNew from '../../../components/Address/AddressNew';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchKycCreateAction, BranchKycGetAction } from '../../../redux/Action/Branch/BranchAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { useCheckEnabledModule } from '../../../hooks/useCheckEnabledModule';
import toast from 'react-hot-toast';


const KYCInformationForm = ({prefix='branchAddress'}) => {
  const dispatch = useDispatch();
  const { state, search } = useLocation();

  const { values, setFieldValue } = useFormikContext(); // ✅ Now it's safe
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { user } = useSelector((state) => state?.user);
  const { branchkycDetails } = useSelector((state) => state?.branch);
  const [isEditAvaliable, setIsEditAvaliable] = useState(true);
const checkModules=useCheckEnabledModule()
  // useEffect(() => {
  //   dispatch(SubOrgListAction());
  // }, [dispatch]);

  useEffect(() => {
    if (state) {
      getBranchKYCDetials();
    }
  }, [dispatch, state]);

 const getFieldName = (name) => (prefix ? `${prefix}.${name}` : name);

// 🟢 API Data Prefill
useEffect(() => {
  if (!branchkycDetails) return;

  const data = branchkycDetails;

  // Merge address safely
  const address = { ...data?.address } || {};

  // Basic fields
  setFieldValue("gstNo", data?.gstNo || "");
  setFieldValue("panNo", data?.panNo || "");

  // Address fields
  const addressFields = [
    "hno", "city", "state", "district", "country",
    "pincode", "street", "landmark", "taluk", "addressTypeId"
  ];
  addressFields.forEach(field => {
    setFieldValue(getFieldName(field), address?.[field] || "");
  });

  // Geo Address
  if (data?.geoLocation?.address) {
    setFieldValue(getFieldName("geoAddress"), data.geoLocation.address);
  }

  // Extract coordinates safely (GeoJSON order = [lng, lat])
  const coords = data?.geoJson?.coordinates || [];
  const lng = parseFloat(coords[0]);
  const lat = parseFloat(coords[1]);
  const isValidCoords = !isNaN(lat) && !isNaN(lng);

  // Update formik values
  setFieldValue(getFieldName("mapCenter"), isValidCoords ? { lat, lng } : { lat: 0, lng: 0 });
  setFieldValue(getFieldName("structuredAddress"), {
    address,
    geoJson: isValidCoords
      ? { type: "Point", coordinates: [lng, lat] }
      : { type: "Point", coordinates: [] },
    geoLocation: data?.geoLocation || {}
  });

}, [branchkycDetails, setFieldValue]);





  const getBranchKYCDetials = () => {
    try {
      let data = {
        _id: state?._id,
        isBranchKYC: true,
      };
      dispatch(BranchKycGetAction(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate=async()=>{
    try{
      const refinedValues ={}
const responseData=removeEmptyStrings({_id: state?._id, isBranchKYC: true,...values?.branchAddress?.structuredAddress,panNo:values?.panNo,gstNo:values?.gstNo})
console.log(responseData)

const response = await dispatch(BranchKycCreateAction(responseData))
      const { meta, payload } = response || {};
      console.log(meta, meta.requestStatus == 'fulfilled', 'ddddddddddddddddddddddddddddddddddddddddddd')
      if (meta.requestStatus == 'fulfilled') {
        setIsEditAvaliable(true)
      }

    }
    catch(error)
    {
        console.log(error)
    }
  }

  return (
    <div className="w-full">
      <Header
        headerLabel="Branch KYC Details"
        subHeaderLabel="Manage Your Branch KYC Details"
        handleClick={() => {handleUpdate()}}
        handleEdit={()=>{
          if(checkModules('branch','u'))
           {
                setIsEditAvaliable(!isEditAvaliable)
           }else{
            toast.error("You don't have permission to edit this branch");
           }
          }}
        isEditAvaliable={isEditAvaliable}
        isButton={true}
        
        
      />
      <Form onSubmit={()=>{
        console.log("d")
      }}>
        <div className="p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormikInput
              name="panNo"
              size="sm"
              label="PAN Number"
              inputType={isEditAvaliable ? 'edit' : 'input'}
              editValue={values?.panNo}
            />
            <FormikInput
              name="gstNo"
              size="sm"
              label="GST Number"
              inputType={isEditAvaliable ? 'edit' : 'input'}
                 editValue={values?.gstNo}
            />
          </div>
          <div className="-ml-1">
            <AddressNew isEditAvaliable={isEditAvaliable} prefix={'branchAddress'} isMap={true} isRadius={false} isCitySearchWithTimezone={false} />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default KYCInformationForm;
