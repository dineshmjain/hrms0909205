import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Table from "../../components/Table/Table";
import { usePrompt } from "../../context/PromptProvider";
import { MdModeEditOutline } from "react-icons/md";
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";

import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/header/Header";

import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import {
  BranchRadiusGetAction,
  BranchRadiusUpdateAction,
  BranchStatusUpdateAction,
} from "../../redux/Action/Branch/BranchAction";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { getBestGeocoderResult, getLocationWithLatLongFull, removeEmptyStrings } from "../../constants/reusableFun";
import { set } from "date-fns";

const BranchRadiusSetting = () => {
  const [subOrg, setSubOrg] = useState(() => {
    const data = localStorage?.getItem("branchList");
    return data ? JSON.parse(data) : "";
  });

  const [selectedClient, setSelectedClient] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkModules = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const [filterType, setFilterType] = useState("myOrg");
  const [open, setOpen] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.209 });
  const [branchName, setBranchName] = useState("");
  const [branchId, setBranchId] = useState("");
  const [isLocationError, setIsLocationError] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);

  const { subOrgs } = useSelector((state) => state?.subOrgs || {});
  const { clientList } = useSelector((state) => state?.client || {});
  const { clientBranchList, loading: clientLoading } = useSelector((state) => state?.clientBranch || {});
  const {
    branchList,
    loading: branchLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.branch);

  useEffect(() => {
    getSubOrgList();
  }, [filterType]);

  useEffect(() => {
    if (filterType === "myOrg" && subOrg) {
      getBranchList({ page: 1, limit: 10 });
    }
  }, [subOrg, filterType]);

  useEffect(() => {
    if (filterType === "clientOrg" && selectedClient?._id) {
      getClientBranchList({ page: 1, limit: 10 });
    }
  }, [selectedClient, filterType]);

  useEffect(() => {
    if (window.google && !autocompleteService) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
    if (window.google && mapRef.current && !placesService) {
      setPlacesService(new window.google.maps.places.PlacesService(mapRef.current));
    }
  }, [autocompleteService, placesService]);

const handleSuggestionSelect = (placeId) => {
  if (!placesService || !placeId) return;

  placesService.getDetails({ placeId }, (place, status) => {
    if (
      status === window.google.maps.places.PlacesServiceStatus.OK &&
      place.geometry &&
      place.geometry.location
    ) {
      const location = place.geometry.location;
      const lat = location.lat();
      const lng = location.lng();
      const addressComponents = place.address_components || [];

      let city = "";
      let state = "";
      let district = "";
      let country = "";
      let pincode = "";

      addressComponents.forEach((component) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          state = component.long_name;
        }
        if (component.types.includes("administrative_area_level_2")) {
          district = component.long_name; // level_2 is more accurate for districts
        }
        if (component.types.includes("country")) {
          country = component.long_name;
        }
        if (component.types.includes("postal_code")) {
          pincode = component.long_name;
        }
      });

      // Set location in component
      setMapCenter({ lat, lng });
      setSearchText(place.formatted_address || place.name);
      setSuggestions([]);

      // ✅ Optionally save or use address parts
      console.log({ lat, lng, city, state, district, country, pincode });

      
      // You can also store this in a state if needed:
      // setAddressDetails({ city, state, district, country, pincode });
    } else {
      toast.error("Failed to fetch location details.");
    }
  });
};



  const fetchSuggestions = (value) => {
    if (!autocompleteService || !value) return;

    autocompleteService.getPlacePredictions(
      { input: value },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const getSubOrgList = () => {
    if (filterType === "myOrg") {
      if (checkModules("suborganization", "r")) {
        dispatch(SubOrgListAction({})).then(({ payload }) => {
          if (payload?.data?.length) {
            setSubOrg(payload.data[0]?._id);
          }
        });
      }
    } else {
      dispatch(clientListAction({})).then(({ payload }) => {
        if (payload?.data?.length) {
          setSelectedClient(payload.data[0]);
        }
      });
    }
  };

  const getBranchList = (params = {}) => {
    let updatedParams = { ...params };
    if (checkModules("suborganization", "r")) {
      updatedParams.subOrgId = subOrg;
    }
    dispatch(BranchRadiusGetAction(removeEmptyStrings(updatedParams)));
  };

  const getClientBranchList = (params = {}) => {
    dispatch(
      BranchRadiusGetAction(
        removeEmptyStrings({
          page: 1,
          limit: 10,
          ...params,
          clientMappedId: selectedClient?._id,
        })
      )
    );
  };

  const addButton = () => {
    if (!checkModules("branch", "c")) {
      return toast.error("You are Unauthorized to Create Branch!");
    }
    navigate("/branch/add");
  };

  const editButton = (branch) => {
    if (!branch?.isActive) {
      return toast.error("Cannot Edit. Please Activate First.");
    }
    navigate("/branch/edit?tab=kyc", { state: branch });
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      branchId: data._id,
      status: !data.isActive,
    };
    dispatch(BranchStatusUpdateAction(payload))
      .then(() => getBranchList({ page: pageNo, limit }))
      .catch(() => toast.error("Status update failed"));
    hidePrompt();
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? "Deactivate" : "Activate"}</b> the{" "}
          <b>{data.name}</b> Branch?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => confirmUpdate(data),
        },
        {
          label: "No",
          type: 0,
          onClick: () => hidePrompt(),
        },
      ],
    });
  };

  const handleChange = (data) => setSubOrg(data?._id);

  const actions = [
    {
      title: "Edit Radius",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (branch) => {
        const coords = branch?.geoJson?.coordinates || [];
        if (coords.length !== 0) {
          setMapCenter({ lat: coords[1], lng: coords[0] });
          setIsLocationError(false);
        } else {
          setIsLocationError(true);
        }
        setRadius(branch?.radius || 0);
        setBranchName(branch?.name);
        setBranchId(branch?._id);
        setSearchText(branch?.geoLocation?.address|| "");
        setOpen(true);
      },
    },
  ];

  const labels = {
    name: { DisplayName: "Name" },
    radius: { DisplayName: "Radius" },
    city: { DisplayName: "Village/City", type: "object", objectName: "address" },
    state: { DisplayName: "State", type: "object", objectName: "address" },
    firstName: { DisplayName: "Created By", type: "object", objectName: "createdByName" },
    modifiedDate: { DisplayName: "Last Modified", type: "time", format: "DD-MM-YYYY HH:mm A" },
  };

  const getZoomFromRadius = (radius) => Math.min(Math.max(Math.floor(17 - Math.log2(radius / 100)), 10), 21);

  const updateRadius = async () => {
    if (!mapCenter.lat || !mapCenter.lng) {
      return toast.error("Please select a valid location on the map.");
    }

    try {
      let updateParams = {
        branchId,
        subOrgId: subOrg,
        radius,
      };
      if (filterType === "clientOrg") {
        updateParams.clientMappedId = selectedClient?._id;
        updateParams.subOrgId = "";
      } else {
        updateParams.clientMappedId = "";
      }

      const result = await dispatch(
        BranchRadiusUpdateAction(removeEmptyStrings(updateParams))
      );
      const { meta } = result;
      if (meta.requestStatus === "fulfilled") {
        toast.success("Radius updated successfully");
        setOpen(false);
        getBranchList({ page: 1, limit: 10 });
      }
    } catch (error) {
      console.error("Error updating radius:", error);
      toast.error("Failed to update radius. Please try again.");
    }
  };
useEffect(() => {
  if (window.google && mapRef.current && !placesService) {
    setPlacesService(new window.google.maps.places.PlacesService(mapRef.current));
  }
}, [autocompleteService, placesService]);


const onDragEndFunction=async (e) => {



            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (lat && lng) setMapCenter({ lat, lng });
            console.log(e)

            const data = await getLocationWithLatLongFull({ lat, lng });
console.log(data, "location data from drag end");
setSearchText(data?.address || "");

          }

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      {/* Radius Dialog */}
<Dialog open={open} handler={() => setOpen(false)} size="xl">
  <Toaster />
  <DialogHeader className="flex justify-between items-center">
    <Typography variant="h6">Edit Radius: {branchName}</Typography>
    <Button
      size="sm"
      color="blue"
      onClick={updateRadius}
      className="bg-primary hover:bg-primaryLight hover:text-primary"
    >
      Update
    </Button>
  </DialogHeader>

  <DialogBody className="space-y-4 relative z-10">
    {/* Input Controls */}
    <div className="flex flex-col md:flex-row md:items-end gap-4">
      <div className="md:w-1/3">
        <Input
          label="Fence Radius (meters)"
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
      </div>
      <div className="relative w-full">
        <Input
          value={searchText} label="Search Location"
          onChange={(e) => {
            const val = e.target.value;
            setSearchText(val);
            fetchSuggestions(val);
          }}
          placeholder="Search location..."
        />
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 w-full z-50 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
            {suggestions.map((sug) => (
              <div
                key={sug.place_id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionSelect(sug.place_id)}
              >
                {sug.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Warning */}
    {isLocationError && (
      <Typography variant="small" className="text-red-500">
        Warning: This branch doesn't have valid coordinates. Please reposition the marker.
      </Typography>
    )}

    {/* Map */}
    <div className="h-[400px] rounded-md border shadow overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={getZoomFromRadius(radius)}
        onLoad={(map) => {
          mapRef.current = map;
          setPlacesService(new window.google.maps.places.PlacesService(map));
        }}
      >
        <Marker
          position={mapCenter}
          draggable
          onDragEnd={(e) => onDragEndFunction(e)}
        />
        {radius > 0 && (
          <Circle
            center={mapCenter}
            radius={radius}
            options={{
              strokeColor: "#0284c7",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#38bdf8",
              fillOpacity: 0.35,
            }}
          />
        )}
      </GoogleMap>
    </div>
  </DialogBody>
</Dialog>


      {/* Header */}
      <Header
        handleClick={addButton}
        buttonTitle="Add"
        headerLabel="Branch Radius Setting"
        subHeaderLabel="Manage Branch Radius Settings"
        isButton={false}
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <Typography variant="small" className="mb-3 text-gray-600 font-medium">
          Filters
        </Typography>
        <div className="inline-flex rounded-md overflow-hidden shadow my-2 border border-gray-200">
          {["myOrg", "clientOrg"].map((type) => (
            <div
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 font-medium text-[12px] transition-all duration-150 ${
                filterType === type
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {type === "myOrg" ? "My Organization" : "Client Organization"}
            </div>
          ))}
        </div>
        <div className="sm:w-72 mt-4">
          {filterType === "myOrg" ? (
            checkModules("suborganization", "r") && (
              <SingleSelectDropdown
                listData={subOrgs}
                feildName="name"
                hideLabel
                showTip
                showSerch
                handleClick={handleChange}
                selectedOption={subOrg}
                selectedOptionDependency="_id"
                inputName="Select Organization"
              />
            )
          ) : (
            <SingleSelectDropdown
              listData={clientList}
              selectedOptionDependency="clientId"
              feildName="name"
              inputName="Client"
              handleClick={(data) => setSelectedClient(data)}
              hideLabel
              selectedOption={selectedClient?.clientId}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <Table
          tableName="Branch"
          tableJson={branchList}
          isLoading={filterType === "myOrg" ? branchLoading : clientLoading}
          labels={labels}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              filterType === "myOrg"
                ? getBranchList({ page, limit, name })
                : getClientBranchList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default BranchRadiusSetting;
