import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Typography,
  Button,
  Card,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OrganizationCreateAction } from "../../redux/Action/Oraganization/OrganizationAction";
import { GetTypeOfIndustry } from "../../redux/Action/typeOfIndustory/TypeOfIndustryAction";
import { FaBullseye } from "react-icons/fa";
import StructureSelect from "./StructureSelect";
import toast from "react-hot-toast";
import Address from "../../components/Address/Address";
import { getUserByToken } from "../../redux/Action/Auth/AuthAction";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import { removeEmptyStrings } from "../../constants/reusableFun";




function Add() {
  const [showOrg, setShowOrg] = useState(FaBullseye);
  const user =useSelector((state)=> state?.user?.user)
  const [form, setForm] = useState({
    name: "",
    orgTypeId: "",
    structure: null,
  });

  const [finalData, setFinalData] = useState({ address: [] });
  const [formValidity, setFormValidity] = useState({ address: true });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const IsLocationSelected = useRef(false);

  const organizationCreate = useSelector(
    (state) => state?.organizationCreates?.organizationCreate
  );

  const typeOfIndustryList = useSelector(
    (state) => state.typeOfIndustury.typeList
  );

  useEffect(() => {
    dispatch(GetTypeOfIndustry());
  }, [dispatch]);

  useEffect(() => {
    if (organizationCreate?.status === 200) {
      navigate("/");
    }
  }, [organizationCreate, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const temp = {};

    if (!form.name) {
      temp.name = "Organization name is required";
    } else if (form.name.length < 3) {
      temp.name = "Organization name must be at least 3 characters";
    }

    if (!form.orgTypeId) {
      temp.orgTypeId = "Business Type is required";
    }

    const coordinates = finalData.address?.gpsLocation?.coordinates || [];
    IsLocationSelected.current = coordinates.length > 0;

    if (form.structure === "branch" && !IsLocationSelected.current) {
      temp.address = "Please select a valid address";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async(e) => {
     e.preventDefault();
    try{
   
console.log(JSON.stringify(finalData.address,null,2),validate(),'d')

    const formData =
      form.structure === "branch"
        ? {
            ...form,
            ...finalData?.address
          }
        : form;
        console.log(formData)
        const dataToSend=removeEmptyStrings(formData)
        const result = await dispatch(OrganizationCreateAction(dataToSend));
      const { meta, payload } = result || {};
      console.log(meta,'meta')

      if (meta?.requestStatus === 'fulfilled') {
         dispatch(getUserByToken());
        // toast.success(payload?.message || 'Department created successfully!');
       navigate("/dashboard");
      }
}
    
    catch(error)
    {
      console.log(error)
    }
    

  };

  const handleNext = () => {
    if (showOrg && !form.structure) {
      return toast.error("Please select an organization structure");
    }
    setShowOrg(!showOrg);
  };

  useEffect(() => {
    dispatch(GetTypeOfIndustry());
  }, [dispatch]);

  useEffect(() => {
    // check if org is already created else nav back to dashboard
    if (user?.user?.pending?.organization == true) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="flex w-full flex-col min-h-screen p-8 gap-8">
      <span className="text-2xl font-bold">Create Organization</span>
      <Card className="p-8 shadow-md border border-gray-200">
        <Typography variant="h5" color="blue-gray" className="mb-6">
          {showOrg
            ? "Select your Organization Structure"
            : "Enter Organization Details"}
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!showOrg ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Typography variant="small" className="mb-2 font-medium">
                    Organization Name
                  </Typography>
                  <Input
                  size='md'
                  labelProps={{className:"hidden"}}
                    placeholder="e.g., MWB Technologies"
                    value={form.name}
                    className="bg-white text-gray-900 focus:!border-gray-900 focus:ring-gray-900/10 rounded-md mb-1"
                    name="name"
                    onChange={(e) => {
                      handleChange(e);
                      setErrors((prev) => ({ ...prev, name: null }));
                    }}
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <Typography color="red" className="text-xs mt-1">
                      {errors.name}
                    </Typography>
                  )}
                </div>

                <div>
                  <Typography variant="small" className="mb-2 font-medium">
                   Business Type
                  </Typography>

                  <SingleSelectDropdown feildName="name" listData={typeOfIndustryList} inputName="Business Type" selectedOptionDependency={'_id'} selectedOption={form?.orgTypeId} hideLabel={true} handleClick={(value)=>{
                     handleChange({target: { name: "orgTypeId", value:value?._id }})
                  }}>

                  </SingleSelectDropdown>
                  {/* <Select
                    label="Select Type"
                    onChange={(value) =>
                      handleChange({
                        target: { name: "orgTypeId", value },
                      })
                    }
                    error={!!errors.orgTypeId}
                  >
                    {typeOfIndustryList.map((data) => (
                      <Option key={data._id} value={data._id}>
                        {data.name}
                      </Option>
                    ))}
                  </Select> */}
                  {errors.orgTypeId && (
                    <Typography color="red" className="text-xs mt-1">
                      {errors.orgTypeId}
                    </Typography>
                  )}
                </div>
              </div>

              {form.structure === "branch" && (
                <Address
                  defaultAddressType="Branch Address"
                  onChange={(data) =>
                    setFinalData((prev) => ({ ...prev, address: data }))
                  }
                  onValidate={(isValid) =>
                    setFormValidity((prev) => ({
                      ...prev,
                      address: isValid,
                    }))
                  }
                />
              )}
            </div>
          ) : (
            <StructureSelect handleChange={handleChange} form={form} />
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" onClick={handleNext} color="gray">
              {showOrg ? "Next" : "Prev"}
            </Button>
            {!showOrg && (
              <Button type="submit" className="bg-pop hover:bg-primaryDark">
                Submit
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Add;
