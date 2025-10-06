// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import * as Yup from 'yup';
// import { useFormikContext } from 'formik';
// import { getAddressTypesAction } from '../../redux/Action/Global/GlobalAction';

// import FormikInput from '../input/FormikInput';
// import SubCardHeader from '../header/SubCardHeader';
// import CitySearchWithTimezone from '../Input/CitySearchWithTimezone';
// import { Typography } from '@material-tailwind/react';

// export const AddressCon = () => {
//     return {
//         initialValues: {
//             addressTypeId: '',
//             hno: '',
//             street: '',
//             landmark: '',
//             city: '',
//             taluk: '',
//             district: '',
//             state: '',
//             country: '',
//             pincode: '',
//             location: '', // GPS coordinates
//             pointType: 'Point',
//             geoAddress:'',
//             isEdit:false,
//             structuredAddress: {}, // Add this to hold combined structure
//         },
//         validationSchema: {
//             addressTypeId: Yup.string().required('Address Type is required'),
//             city: Yup.string().required('City is required'),
//             state: Yup.string().required('State is required'),
//             country: Yup.string().required('Country is required'),
//             pincode: Yup.string().required('Pincode is required'),
//             location: Yup.string().required('GPS Location is required'),
//         }
//     };
// };

// // ✅ Component
// const AddressNew = ({ isEditAvaliable = false, state }) => {
//     const dispatch = useDispatch();
//     const { values, setFieldValue } = useFormikContext();
//     const { addressTypes = [] } = useSelector((state) => state.global);

//     const [location, setLocation] = useState('');
//     const [locationSearch, setLocationSearchText] = useState('');

//     useEffect(() => {
//         dispatch(getAddressTypesAction()).then(({ payload }) => {
//             if (!values?.addressTypeId) {
//                 setFieldValue('addressTypeId', payload?.data?.[0]?._id)
//             }
//         })
//     }, [dispatch]);

//     // Autofill on GPS location fetch
//     useEffect(() => {
//         if (location && typeof location === 'object') {
//             setFieldValue('location', location);
//             setFieldValue('city', location.city || '');
//             setFieldValue('state', location.state || '');
//             setFieldValue('country', location.country || '');
//             setFieldValue('pincode', location.pincode || '');
//             setFieldValue('district', location.district || '');
//  setFieldValue('geoAddress',location?.address)
 
//         }
//     }, [location, setFieldValue]);

//     // Sync structuredAddress anytime form data or location changes
//     useEffect(() => {
//         const structured = {
//             address: {
//                 addressTypeId: values?.addressTypeId,
//                 hno: values?.hno,
//                 landmark: values?.landmark,
//                 street: values?.street,
//                 city: values?.city,
//                 district: values?.district,
//                 taluk: values?.taluk,
//                 state: values?.state,
//                 country: values?.country,
//                 pincode: values?.pincode,
//             },
//             geoLocation: {
//                 address: location?.address || '',
//                 city: values?.city,
//                 district: values?.district,
//                 state: values?.state,
//                 country: values?.country,
//                 pincode: values?.pincode,
//             },
//             geoJson: {
//                 coordinates: location?.coordinates || [location?.lng, location?.lat] || [],
//                 type: 'Point'
//             }
//         };

//         setFieldValue('structuredAddress', structured);
       

//     }, [
//         location,
//         values?.addressTypeId,
//         values?.hno,
//         values?.landmark,
//         values?.street,
//         values?.city,
//         values?.district,
//         values?.taluk,
//         values?.state,
//         values?.country,
//         values?.pincode,
//         setFieldValue
//     ]);
//     useEffect(() => {
//         setLocationSearchText(values?.geoAddress)
//         if(isEditAvaliable)
//         {
//         setLocation({...values?.structuredAddress?.geoLocation,lat:values?.structuredAddress?.geoJson?.coordinates[1],lng:values?.structuredAddress?.geoJson?.coordinates[0],coordinates:values?.structuredAddress?.geoLocation?.coordinates})
//         }
//     }, [values?.geoAddress])

//     useEffect(() => {
//         setFieldValue('addressTypeId', values?.structuredAddress?.address?.addressTypeId)
//     }, [])
//     useEffect(()=>{
//         console.log("im checking",values?.geoAddress ==location?.address)
// setFieldValue('isEdit',values?.geoAddress ==location?.address? false:true)
// //  setLocation({...values?.structuredAddress?.geoLocation,lat:values?.structuredAddress?.geoJson?.coordinates[1],lng:values?.structuredAddress?.geoJson?.coordinates[0],coordinates:values?.structuredAddress?.geoLocation?.coordinates})
//     },[])

//     console.log("recived",location)
//     return (
//         <div className="w-full p-2">
//             <div className="mb-2">
//                 <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
//                     GPS Location
//                 </Typography>
//                 {isEditAvaliable ? <Typography className="text-gray-700 text-[14px] mb-1 font-semibold">{values?.geoAddress} </Typography>
//                     : <CitySearchWithTimezone
//                         locationSearchText={locationSearch}
//                         location={location}
//                         setLocation={setLocation}
//                         setLocationSearchText={setLocationSearchText}
//                     />
//                 }
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">


//                 <FormikInput
//                     name="addressTypeId"
//                     size="sm"
//                     editValue={addressTypes.filter((d) => d._id == values?.addressTypeId)[0]?.name}
//                     label="Address Type"

//                     listData={addressTypes}
//                     inputName="Select Address Type"
//                     feildName="name"
//                     hideLabel
//                     showTip={false}
//                     showSerch={true}
//                     handleClick={(selected) => setFieldValue('addressTypeId', selected?._id)}
//                     selectedOption={values?.addressTypeId}
//                     selectedOptionDependency="_id"
//                     inputType={isEditAvaliable ? "edit" : "dropdown"}
//                 />

//                 <FormikInput name="hno" size="sm" label="Hno/Flat No" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.hno} />
//                 <FormikInput name="street" size="sm" label="Street/Locality" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.street} />
//                 <FormikInput name="landmark" size="sm" label="Landmark" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.landmark} />
//                 <FormikInput name="city" size="sm" label="City/Village" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.city} />
//                 <FormikInput name="district" size="sm" label="District" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.district} />
//                 <FormikInput name="taluk" size="sm" label="Taluk" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.taluk} />
//                 <FormikInput name="state" size="sm" label="State" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.state} />
//                 <FormikInput name="country" size="sm" label="Country" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.country} />
//                 <FormikInput name="pincode" size="sm" label="Pincode" inputType={isEditAvaliable ? "edit" : "input"} editValue={values?.pincode} />
//             </div>
//         </div>
//     );
// };

// export default AddressNew;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormikContext } from 'formik';
import { getAddressTypesAction } from '../../redux/Action/Global/GlobalAction';

import FormikInput from '../input/FormikInput';
import CitySearchWithTimezone from '../Input/CitySearchWithTimezone';
import { Typography } from '@material-tailwind/react';


export const createAddressInitialValues = () => ({
  addressTypeId: '',
  hno: '',
  street: '',
  landmark: '',
  city: '',
  taluk: '',
  district: '',
  state: '',
  country: '',
  pincode: '',
  location: '',
  pointType: 'Point',
  geoAddress: '',
  isEdit: false,
  structuredAddress: {},
});

export const addressValidationSchema = Yup.object({
  structuredAddress: Yup.object({
    addressTypeId: Yup.string().required('Address Type is required'),
    hno: Yup.string().nullable(),
    street: Yup.string().nullable(),
    landmark: Yup.string().nullable(),
    city: Yup.string().required('City is required'),
    taluk: Yup.string().nullable(),
    district: Yup.string().nullable(),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: Yup.string().required('Pincode is required'),

    geoAddress: Yup.string().nullable(),
    location: Yup.mixed().required('GPS location is required'),

    geoJson: Yup.object({
      coordinates: Yup.array()
        .of(Yup.number().required())
        .length(2, 'GPS Coordinates are invalid')
        .required('GPS Coordinates are required'),
      type: Yup.string().oneOf(['Point']).required(),
    }),

    geoLocation: Yup.object({
      address: Yup.string().nullable(),
      city: Yup.string().nullable(),
      district: Yup.string().nullable(),
      state: Yup.string().nullable(),
      country: Yup.string().nullable(),
      pincode: Yup.string().nullable(),
    }),

    isEdit: Yup.boolean(),
  }),
});
export const AddressCon = () => {
    return {
        initialValues: {
            addressTypeId: '',
            hno: '',
            street: '',
            landmark: '',
            city: '',
            taluk: '',
            district: '',
            state: '',
            country: '',
            pincode: '',
            location: '', // GPS coordinates
            pointType: 'Point',
            geoAddress:'',
            isEdit:false,
            structuredAddress: {}, // Add this to hold combined structure
        },
        validationSchema: {
            addressTypeId: Yup.string().required('Address Type is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            country: Yup.string().required('Country is required'),
            pincode: Yup.string().required('Pincode is required'),
            location: Yup.string().required('GPS Location is required'),
        }
    };
};

const AddressNew = ({ isEditAvaliable = false, fieldPrefix = 'structuredAddress' }) => {
    const dispatch = useDispatch();
    const { values, setFieldValue } = useFormikContext();
    const { addressTypes = [] } = useSelector((state) => state.global);

    const [location, setLocation] = useState('');
    const [locationSearch, setLocationSearchText] = useState('');

    const field = (name) => `${fieldPrefix}.${name}`;
    const getValue = (name) => values?.[fieldPrefix]?.[name];

    // Fetch address types and set default if not selected
    useEffect(() => {
        dispatch(getAddressTypesAction()).then(({ payload }) => {
            if (!getValue('addressTypeId')) {
                setFieldValue(field('addressTypeId'), fieldPrefix =="structuredAddress" ?payload?.data?.[0]?._id :fieldPrefix =="presentAddress"?payload?.data?.[1]?._id :payload?.data?.[2]?._id );
            }
        });
    }, [dispatch]);

    // Autofill on GPS location fetch
    useEffect(() => {
        if (location && typeof location === 'object') {
            setFieldValue(field('location'), location);
            setFieldValue(field('city'), location.city || '');
            setFieldValue(field('state'), location.state || '');
            setFieldValue(field('country'), location.country || '');
            setFieldValue(field('pincode'), location.pincode || '');
            setFieldValue(field('district'), location.district || '');
            setFieldValue(field('geoAddress'), location?.address);
        }
    }, [location]);

    // Structured address
    useEffect(() => {
        const structured = {
            address: {
                addressTypeId: getValue('addressTypeId'),
                hno: getValue('hno'),
                landmark: getValue('landmark'),
                street: getValue('street'),
                city: getValue('city'),
                district: getValue('district'),
                taluk: getValue('taluk'),
                state: getValue('state'),
                country: getValue('country'),
                pincode: getValue('pincode'),
            },
            geoLocation: {
                address: location?.address || '',
                city: getValue('city'),
                district: getValue('district'),
                state: getValue('state'),
                country: getValue('country'),
                pincode: getValue('pincode'),
            },
            geoJson: {
                coordinates: location?.coordinates || [location?.lng, location?.lat] || [],
                type: 'Point',
            },
        };

        setFieldValue(field('structuredAddress'), structured);
    }, [
        location,
        getValue('addressTypeId'),
        getValue('hno'),
        getValue('landmark'),
        getValue('street'),
        getValue('city'),
        getValue('district'),
        getValue('taluk'),
        getValue('state'),
        getValue('country'),
        getValue('pincode'),
    ]);

    useEffect(() => {
        setLocationSearchText(getValue('geoAddress'));
        if (isEditAvaliable) {
            const structured = values?.structuredAddres

            console.log(structured,'recived address coponem>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            if (structured) {
                setLocation({
                    ...structured?.geoLocation,
                    lat: structured?.geoJson?.coordinates?.[1],
                    lng: structured?.geoJson?.coordinates?.[0],
                    coordinates: structured?.geoJson?.coordinates,
                });
            }
        }
    }, [getValue('geoAddress')]);

    useEffect(() => {
        setFieldValue(field('addressTypeId'), getValue('structuredAddress')?.address?.addressTypeId);
    }, []);

    useEffect(() => {
        setFieldValue(field('isEdit'), getValue('geoAddress') === location?.address ? false : true);
    }, []);

    return (
        <div className="w-full p-2">
            <div className="mb-2">
                <Typography className="text-gray-700 text-[14px] mb-1 font-medium">GPS Location</Typography>
                {isEditAvaliable ? (
                    <Typography className="text-gray-700 text-[14px] mb-1 font-semibold">
                        {getValue('geoAddress')}
                    </Typography>
                ) : (
                    <CitySearchWithTimezone
  locationSearchText={locationSearch}
  location={location}
  setLocation={(loc) => {
    setFieldValue(field('location'), loc);
    setFieldValue(field('city'), loc?.city || '');
    setFieldValue(field('state'), loc?.state || '');
    setFieldValue(field('country'), loc?.country || '');
    setFieldValue(field('pincode'), loc?.pincode || '');
    setFieldValue(field('district'), loc?.district || '');
    setFieldValue(field('geoAddress'), loc?.address || '');

     setFieldValue(field('coordinates'), [loc?.lng,loc?.lat] || '');
     setFieldValue(field('lat'), loc?.lat || '');
      setFieldValue(field('lng'), loc?.lng || '');
      setLocation({
  ...loc,
  coordinates: [loc?.lng, loc?.lat],
});
  }}
  setLocationSearchText={(text) => setFieldValue(field('geoAddress'), text)}
/>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <FormikInput
                    name={field('addressTypeId')}
                    size="sm"
                    editValue={
                        addressTypes.find((d) => d._id === getValue('addressTypeId'))?.name || ''
                    }
                    label="Address Type"
                    listData={addressTypes}
                    inputName="Select Address Type"
                    feildName="name"
                    hideLabel
                    showTip={false}
                    showSerch={true}
                    handleClick={(selected) => setFieldValue(field('addressTypeId'), selected?._id)}
                    selectedOption={getValue('addressTypeId')}
                    selectedOptionDependency="_id"
                    inputType={isEditAvaliable ? 'edit' : 'dropdown'}
                />
                <FormikInput name={field('hno')} size="sm" label="Hno/Flat No" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('hno')} />
                <FormikInput name={field('street')} size="sm" label="Street/Locality" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('street')} />
                <FormikInput name={field('landmark')} size="sm" label="Landmark" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('landmark')} />
                <FormikInput name={field('city')} size="sm" label="City/Village" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('city')} />
                <FormikInput name={field('district')} size="sm" label="District" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('district')} />
                <FormikInput name={field('taluk')} size="sm" label="Taluk" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('taluk')} />
                <FormikInput name={field('state')} size="sm" label="State" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('state')} />
                <FormikInput name={field('country')} size="sm" label="Country" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('country')} />
                <FormikInput name={field('pincode')} size="sm" label="Pincode" inputType={isEditAvaliable ? 'edit' : 'input'} editValue={getValue('pincode')} />
            </div>
        </div>
    );
};

export default AddressNew;
