import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { useDispatch, useSelector } from 'react-redux';
import CustomField from '../Input/CustomFeild';
import CitySearchWithTimezone from '../Input/CitySearchWithTimezone';
import { getAddressTypesAction } from '../../redux/Action/Global/GlobalAction';
import SubCardHeader from '../header/SubCardHeader';

const Address = ({ onChange, onValidate, isEditAvaliable = false, state = [] }) => {
  console.log(JSON.stringify(state,null,2),'dd',state?.address?.hno ,'drecived')
  const dispatch = useDispatch();
  const { addressTypes } = useSelector((state) => state?.global);
console.log(state.geoJson?.coordinates[0])
  const [location, setLocation] = useState({...state.geoJson,...state.geoLocation,lng:state.geoJson?.coordinates[0],lat:state.geoJson?.coordinates[1]});
  const [locationSearch, setLocationSearch] = useState();
  const [locationSearchText, setLocationSearchText] = useState(state?.geoLocation?.address);
  const [errors, setErrors] = useState({});

  const initialFields = [
    { key: "addressTypeId", label: "Address Type", input: "dropdown", data: addressTypes, labelFeild: "name", valueFeild: "_id", required: true},
    { key: "hno", label: "Hno/Flat Number", input: "input",value: state?.address?.hno ?? "" },
    { key: "street", label: "Street/Locality", input: "input" },
    { key: "landmark", label: "Landmark", input: "input" },
    { key: "city", label: "Village/City", input: "input", required: true },
    { key: "taluk", label: "Taluk", input: "input" },
    { key: "district", label: "District", input: "input" },
    { key: "state", label: "State", input: "input", required: true },
    { key: "country", label: "Country", input: "input", required: true },
    { key: "pincode", label: "Pincode", input: "input", required: true },
  ];

  const [basicData, setBasicData] = useState(initialFields);

  useEffect(()=>{
    if(state)
    {
const bdata= initialFields.map((da)=>{


  return {...da,value:state?.address?.[da.key] }
})
setBasicData(bdata)
    }
  },[])

  useEffect(() => {
    dispatch(getAddressTypesAction());
  }, [dispatch]);

  const extractLocationDetails = (locationObj) => {
    console.log(locationObj,'loc')
    let city = '', state = '', district = '', country = '', pincode = ''; let address=''
    const components = locationObj?.address_components || [];
    const coordinates = [
      locationObj?.geometry?.location?.lng,
      locationObj?.geometry?.location?.lat,
    ];
address=locationObj?.formatted_address

    components.forEach((comp) => {
      comp.types.forEach((type) => {
        switch (type) {
          case 'locality':
            city = comp.long_name;
            break;
          case 'administrative_area_level_1':
            state = comp.long_name;
            break;
          case 'administrative_area_level_3':
            district = comp.long_name;
            break;
          case 'country':
            country = comp.long_name;
            break;
          case 'postal_code':
            pincode = comp.long_name;
            break;
          default:
            break;
        }
      });
    });

    return {
      city,
      state,
      district,
      country,
      pincode,
      coordinates,
      type: "Point",
      address:address
    };
  };



  useEffect(() => {

    let enrichedLocation = location;

    if (location?.address_components) {
      enrichedLocation = extractLocationDetails(location);
    }

    const updatedData = initialFields.map((field) => {
      const locationValue = enrichedLocation?.[field.key];
      const stateValue = state?.[field.key];
      return {
        ...field,
        value: locationValue ?? stateValue ?? '',
      };
    });
console.log(updatedData,enrichedLocation,'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd')
    setBasicData(updatedData);

    // Build structured output
    const addressPayload = {};
    updatedData.forEach((field) => {
      addressPayload[field.key] = field.value;
    });

    const structuredAddress = {
      address: {
        ...addressPayload
      },
      geoJson: {
        coordinates: [location?.lng, location?.lat] || [],
        type: location?.type || 'Point',
      },
      geoLocation: { city: enrichedLocation?.city, district: enrichedLocation?.district, state: enrichedLocation?.state, country: enrichedLocation?.country, address: enrichedLocation?.address, pincode: enrichedLocation?.pincode }
    };
    console.log(structuredAddress, 'useEff')
    onChange && onChange(structuredAddress);
    validate(updatedData);
  }, [location, addressTypes]);

  const validate = (fields) => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !field.value?.toString().trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    onValidate && onValidate(Object.keys(newErrors).length === 0);
  };

  const handleChange = (key, newValue) => {
    let enrichedLocation={}
    console.log(location, 'loca handle Change')
    const updatedData = basicData.map((field) =>
      field.key === key ? { ...field, value: newValue } : field
    );
    setBasicData(updatedData);
 if (location?.address_components) {
      enrichedLocation = extractLocationDetails(location);
    }
    // Prepare updated structured address
    const addressPayload = {};
    updatedData.forEach((field) => {
      addressPayload[field.key] = field.value;
    });

    const structuredAddress = {
      address: {
        ...addressPayload
      },
      geoJson: {
        coordinates: [location?.lng, location?.lat] || [],
        type: location?.type || 'Point',
      },
      geoLocation: { city: enrichedLocation?.city || location?.city, district: enrichedLocation?.district || location?.district, state: enrichedLocation?.state || location?.state, country: enrichedLocation?.country || location?.country, address: enrichedLocation?.address || location?.address, pincode: enrichedLocation?.pincode || location?.pincode }
    };
    console.log(structuredAddress, 'handle Chane')
    onChange?.(structuredAddress);
    validate(updatedData);
  };

  return (
    <div className="w-full border-t mt-3">
       <SubCardHeader headerLabel={"Address"}/>

      <div className="flex flex-col min-w-[180px] py-3">
        <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
          GPS Location
        </Typography>

        {!isEditAvaliable  ?
          <div className="grid col-span-12">
            <CitySearchWithTimezone
              locationSearchText={locationSearchText}
              location={location}
              setLocation={setLocation}
              setLocationSearchText={setLocationSearchText}
              locationSearch={locationSearch}
              errors={errors}
              setErrors={setErrors}
            />
          </div>
          :  <div className="grid col-span-12">
            <Typography className="text-[#000] text-[14px]">
            {locationSearchText}</Typography>
          </div>

        }
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-3 gap-4">
        {basicData.map((field) => (
          <div key={field.key} className="flex flex-col">
              <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              {field.label}
            </Typography>
            {isEditAvaliable ? (
            <Typography className="text-[#000] text-[14px]">
                      
            
                {field.key=='addressTypeId' ?
                
                
                addressTypes.filter((d)=>d._id ==state?.address?.addressTypeId)[0]?.name

                :(    field?.value  || '--')
                }
              </Typography>
            ) : (
              <CustomField field={field} handleChange={handleChange} />
            )}
            {/* {errors[field.key] && (
              <Typography color="red" className="text-xs mt-1">
                {errors[field.key]}
              </Typography>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
