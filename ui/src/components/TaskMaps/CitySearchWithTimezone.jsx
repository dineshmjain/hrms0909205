import React, { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { MdMyLocation } from "react-icons/md";
import toast from "react-hot-toast";
import GoogleMapSVG from "../../assets/Images/GoogleDirection.png";
import currentlocation from "../../assets/Images/current-location.png";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import MapModal from "./MapModal";
import { getCurrentLocation } from "../../constants/reusableFun";
const libraries = ["places"];

const CitySearchWithTimezone = ({
  setErrors,
  errors,
  location,
  setLocation,
  loactionSearch,
  setLoactionSearchText,
  loactionSearchText,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPAPI,
    libraries: libraries,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <SearchBox
      setErrors={setErrors}
      errors={errors}
      location={location}
      setLocation={setLocation}
      loactionSearchText={loactionSearchText}
      setLoactionSearchText={setLoactionSearchText}
    />
  );
};

const SearchBox = ({
  setErrors,
  errors,
  location,
  setLocation,
  setLoactionSearchText,
  loactionSearchText,
}) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);

  const handlePlaceSelect = async () => {
    try {
      const place = await autocomplete.getPlace();
      if (place.geometry) {
        const address = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLoactionSearchText(address);

        let city = "";
        let state = "";
        let country = "";
        let pincode = "";

        place.address_components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        if (!pincode) {
          // Attempt to infer pincode from formatted address if not available in address_components
          const addressParts = address.split(",");
          const lastPart = addressParts[addressParts.length - 1].trim();
          if (/^\d+$/.test(lastPart)) {
            pincode = lastPart;
          }
        }
        setLocation({ lat, lng, city, state, country, pincode, address });
      } else {
        console.error("Place geometry is not available.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    if (autocomplete) {
      autocomplete.addListener("place_changed", handlePlaceSelect);
    }
  }, [autocomplete]);

  const handleClick = async () => {
    try {
      console.log("handleClick Trigger");
      const res = await getCurrentLocation();
      setLocation(res);
      setLoactionSearchText(res?.address || "");
      console.log("handleClick Trigger RESPONSE", res);
    } catch (err) {
      setLocation(null);
      setLoactionSearchText("");
      toast.error(err.message); // Show the error message using toast
    }
  };

  return (
    <>
      <MapModal
        open={open}
        setOpen={setOpen}
        setLocation={setLocation}
        location={location}
        setLoactionSearchText={setLoactionSearchText}
        loactionSearchText={loactionSearchText} // Pass search text
      />
      <div className="relative">
        <div className="flex items-center gap-2 min-h-[40px]">
          <Input
            error={errors?.address ? true : false}
            autoFocus={loactionSearchText === "" ? true : false}
            id="searchInput"
            type="text"
            label="Search for a location"
            // className="bg-gray-200 w-full outline-none"
            className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: "hidden",
            }}
            value={loactionSearchText}
            onChange={(e) => {
              setErrors({ ...errors, address: null });
              setLoactionSearchText(e.target.value);
              if (e.target.value !== "") {
                const input = document.getElementById("searchInput");
                const options = {
                  types: ["(cities)"],
                };
                const complete = new window.google.maps.places.Autocomplete(
                  input,
                  options
                );
                setAutocomplete(complete);
              } else {
                setAutocomplete(null);
                setLocation(null);
                setLoactionSearchText(null);
              }
            }}
          />
          <img
            onClick={handleClick}
            // onClick={() => { console.log('hiiiiiiiiii');
            //  }}
            src={currentlocation}
            alt="Google Map"
            className="w-6 h-6 cursor-pointer rounded-md" // Set consistent width and height with rounded corners
          />
          <img
            onClick={handleOpen}
            src={GoogleMapSVG}
            alt="Google Map"
            className="w-9 h-9 cursor-pointer rounded-md" // Set consistent width and height with rounded corners
          />
        </div>
        {errors?.address && (
          <Typography color="red" className="text-sm mr-10 mt-1">
            {errors.address}
          </Typography>
        )}
      </div>
    </>
  );
};

export default CitySearchWithTimezone;
