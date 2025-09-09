import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input, Typography } from "@material-tailwind/react";
import Header from "../../components/header/Header";
import CitySearchWithTimezone from "../../components/Input/CitySearchWithTimezone";
import { useDispatch } from "react-redux";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { removeEmptyStrings } from "../../constants/reusableFun";
import {
  checkPointCreateAction,
  checkPointupdateAction,
} from "../../redux/Action/Checkpoint/CheckpointAction";
import MediaSection from "../../components/MediaInput/MediaSection";
import toast from "react-hot-toast";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";

const actualName = {
  RoomNo: "Room No",
  FloorNo: "Floor No",
  BuildingNo: "Building No",
  BuildingName: "Building Name",
  Area: "Area",
};

const apiName = {
  Image: "image",
  Video: "video",
  Audio: "audio",
  Document: "attachments",
};

const Create = ({ isEdit }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [location, setLocation] = useState(null);
  const [locationSearch, setLocationSearchText] = useState("");
  const clientList = useSelector((state) => state?.client?.clientList);
  const clientBranchList = useSelector(
    (state) => state?.clientBranch?.clientBranchList
  );
  const { state } = useLocation();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    clientMappedId: "",
    branchId: "",
    name: "",
    geoJson: null,
    geoLocation: null,
  });
  const [extraAddress, setExtraAdress] = useState({
    RoomNo: "",
    FloorNo: "",
    BuildingNo: "",
    BuildingName: "",
    Area: "",
  });
  const mediaInitialData = {
    Image: [],
    Video: [],
    Audio: [],
    Document: [],
  };
  const [selectedMedia, setSelectedMedia] = useState({
    ...mediaInitialData,
  });

  const [existingMedia, setExistingMedia] = useState({ ...mediaInitialData });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      let temp = { ...prev };
      delete temp?.[name];
      return { ...temp };
    });
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // filters out just the url
  const getUploadedMediaUrls = () => {
    const result = {};

    for (const mediaType in selectedMedia) {
      const urls = selectedMedia[mediaType]
        .filter((item) => item.uploadedUrl)
        .map((item) => item.uploadedUrl);

      if (urls.length > 0) {
        result[apiName[mediaType] || mediaType] = urls;
      }
    }

    return Object.keys(result).length > 0 ? result : null;
  };

  const hasUploadingMedia = () => {
    for (const mediaType in selectedMedia) {
      const mediaArray = selectedMedia[mediaType];
      if (mediaArray.some((item) => item.uploading)) {
        toast.error("Please wait until all media uploads are complete!");
        return true;
      }
    }
    return false;
  };

  const handleValidate = () => {
    let tempError = {};
    if (!formData?.name) {
      tempError.name = "Checkpoint name is required";
    }
    if (!formData?.clientMappedId) {
      tempError.clientMappedId = "Client is required";
    }
    if (!formData?.branchId) {
      tempError.branchId = "Client branch is required";
    }
    if (
      !formData?.geoJson &&
      !formData?.geoLocation &&
      !formData?.geoJson?.coordinates
    ) {
      tempError.location = "Location is required";
    }

    if (Object?.keys(tempError)?.length > 0) {
      setError(tempError);
      return false;
    }

    // check if any media is updloading
    let media = !hasUploadingMedia();
    return media;
  };

  const handleSubmit = () => {
    if (!handleValidate()) {
      return;
    }
    let address = removeEmptyStrings(extraAddress);

    let data = {
      ...formData,
    };
    if (Object?.values(address)?.length > 0) {
      data = {
        ...data,
        address: address,
      };
    }

    let media = getUploadedMediaUrls();
    if (media) {
      data = {
        ...data,
        attachments: media,
      };
    }

    let action = isEdit ? checkPointupdateAction : checkPointCreateAction;

    if (isEdit) {
      data = {
        ...data,
        checkpointId: state?.data?._id,
        address: address,
      };
      delete data?.clientMappedId;
    }

    dispatch(action(data))?.then(({ payload }) => {
      if (payload?.status == 200) {
        nav(-1); // Navigate back after successful creation
      }
    });
  };

  useEffect(() => {
    if (location) {
      const geoJson = {
        type: "Point",
        coordinates: [location?.lng, location?.lat],
      };
      const geoLocation = removeEmptyStrings({
        city: location?.city,
        state: location?.state,
        country: location?.country,
        pincode: location?.pincode,
        address: location?.address,
      });

      setFormData((prev) => ({
        ...prev,
        geoJson: geoJson,
        geoLocation: geoLocation,
      }));
    }
  }, [location]);

  useEffect(() => {
    //if aleady exist dont call
    if (!(clientList?.length > 0)) {
      dispatch(clientListAction());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      let data = state?.data;
      setFormData((prev) => ({
        ...prev,
        name: data?.name || "",
        clientMappedId: data?.clientMappedId || "",
        branchId: data?.branchId || "",
        geoJson: data?.geoJson || null,
        geoLocation: data?.geoLocation || null,
      }));
      setExtraAdress((prev) => ({
        ...prev,
        ...data?.address,
      }));
      setExistingMedia(() => {
        let temp = {
          Image: data?.attachments?.image || [],
          Video: data?.attachments?.video || [],
          Audio: data?.attachments?.audio || [],
          Document: data?.attachments?.attachments || [],
        };
        return { ...temp };
      });

      setLocation({
        lat: data?.geoJson?.coordinates?.[1] || null,
        lng: data?.geoJson?.coordinates?.[0] || null,
        city: data?.geoLocation?.city || "",
        state: data?.geoLocation?.state || "",
        country: data?.geoLocation?.country || "",
        pincode: data?.geoLocation?.pincode || "",
        address: data?.geoLocation?.address || "",
      });
      setLocationSearchText(data?.geoLocation?.address || "");
      if (data?.clientMappedId) {
        dispatch(
          clientBranchListAction({ clientMappedId: data?.clientMappedId })
        );
      }
    }
  }, [state, isEdit]);

  return (
    <div className="flex  flex-col gap-2 w-full h-full  bg-white rounded-md p-2">
      <Header
        isBackHandler={true}
        headerLabel={`${isEdit ? "Edit" : "Create"} Checkpoint`}
        subHeaderLabel={`${isEdit ? "Edit" : "Add"} Checkpoint Details`}
        buttonTitle="Save"
        handleClick={() => {
          handleSubmit();
        }}
      />
      <div className="flex flex-col gap-2 divide-y divide-gray-300 ">
        <div className="flex flex-wrap gap-4 px-4 p-2">
          <div className="w-[250px] maxsm:w-full">
            <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Checkpoint Name
            </Typography>
            <Input
              name="name"
              className=""
              onChange={(e) => handleChange(e)}
              value={formData?.name}
              error={!!error?.name}
            />
            {error?.name && (
              <Typography className="text-red-700 text-sm font-medium  mt-1">
                {error?.name}
              </Typography>
            )}
          </div>
          <div className="w-[250px] maxsm:w-full">
            <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Select Client
            </Typography>
            <SingleSelectDropdown
              listData={clientList ?? []}
              inputName="Client"
              hideLabel={true}
              showTip={false}
              feildName="name"
              selectedOption={formData?.clientMappedId}
              selectedOptionDependency={"_id"}
              disabled={isEdit}
              inputError={{
                error: error?.clientMappedId,
                message: error?.clientMappedId,
              }}
              handleClick={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  branchId: "",
                  clientMappedId: data?._id,
                }));
                setError((prev) => {
                  let temp = { ...prev };
                  delete temp?.clientMappedId;
                  return { ...temp };
                });
                dispatch(clientBranchListAction({ clientMappedId: data?._id }));
              }}
            />
          </div>
          <div className="w-[250px] maxsm:w-full">
            <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              Select Client Branch
            </Typography>
            <SingleSelectDropdown
              listData={clientBranchList ?? []}
              inputName="Client Branch"
              hideLabel={true}
              showTip={false}
              feildName="name"
              disabled={isEdit}
              selectedOption={formData?.branchId}
              selectedOptionDependency={"_id"}
              inputError={{
                error: error?.branchId,
                message: error?.branchId,
              }}
              handleClick={(data) => {
                setFormData((prev) => ({
                  ...prev,
                  branchId: data?._id,
                }));
                setError((prev) => {
                  let temp = { ...prev };
                  delete temp?.branchId;
                  return { ...temp };
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 p-2">
          <Typography className="text-gray-700 font-semibold  ">
            Location
          </Typography>
          <div className="flex flex-wrap gap-4 ">
            <div className="w-full">
              <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
                Select Location
              </Typography>
              <CitySearchWithTimezone
                errors={{
                  address: error?.location,
                }}
                setErrors={setError}
                locationSearchText={locationSearch}
                location={location}
                setLocation={setLocation}
                setLocationSearchText={setLocationSearchText}
              />
            </div>
            {["RoomNo", "FloorNo", "BuildingNo", "BuildingName", "Area"]?.map(
              (feild, idx) => {
                return (
                  <div className="w-[250px] maxsm:w-full" key={idx}>
                    <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
                      {actualName?.[feild] || feild}
                    </Typography>
                    <Input
                      variant="outlined"
                      placeholder={actualName?.[feild] || feild}
                      name={feild}
                      className=""
                      onChange={(e) => {
                        setExtraAdress((prev) => ({
                          ...prev,
                          [feild]: e.target.value,
                        }));
                      }}
                      value={extraAddress?.[feild]}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 p-2">
          <Typography className="text-gray-700 font-semibold  ">
            Media
          </Typography>
          <MediaSection
            setSelectedMedia={setSelectedMedia}
            selectedMedia={selectedMedia}
            existingMedia={existingMedia}
            setExistingMedia={setExistingMedia}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
