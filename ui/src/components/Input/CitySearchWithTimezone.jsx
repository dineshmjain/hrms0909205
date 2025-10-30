import React, { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import currentlocation from "../../assets/Images/current-location.png";
import GoogleMapSVG from "../../assets/Images/GoogleDirection.png";
import { Input, Typography } from "@material-tailwind/react";
import MapModal from "./MapModal";
import { getCurrentLocation } from "../../constants/reusableFun";


const SearchBox = ({
  name = "branchAddress.location", // pass Formik field name
  setErrors,
  errors,
  location,
  setLocation,
  setLocationSearchText,
  locationSearchText,
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry || !place.address_components) {
      toast.error("Invalid location selected.");
      return;
    }

    const address = place.formatted_address;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let city = "";
    let state = "";
    let country = "";
    let pincode = "";
    let district = "";

    place.address_components.forEach((component) => {
      const types = component.types;
      if (types.includes("locality")) city = component.long_name;
      if (types.includes("administrative_area_level_1"))
        state = component.long_name;
      if (types.includes("country")) country = component.long_name;
      if (types.includes("administrative_area_level_2"))
        district = component.long_name;
      if (types.includes("postal_code")) pincode = component.long_name;
    });

    if (!pincode && address) {
      const parts = address.split(",");
      const last = parts[parts.length - 1].trim();
      if (/^\d{5,6}$/.test(last)) pincode = last;
    }

    const parsedLocation = {
      lat,
      lng,
      coordinates: [lng, lat],
      city,
      state,
      country,
      district,
      pincode,
      address,
      type: "Point",
    };

    setLocation(parsedLocation);
    setLocationSearchText(address);
  }, [setLocation, setLocationSearchText]);

  // Initialize Autocomplete when Maps API is available
  useEffect(() => {
    if (
      window.google &&
      window.google.maps &&
      inputRef.current &&
      !autocompleteRef.current
    ) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "in" },
          fields: ["formatted_address", "geometry", "address_components"],
        }
      );

      autocomplete.addListener("place_changed", handlePlaceSelect);
      autocompleteRef.current = autocomplete;
    }
  }, [handlePlaceSelect]);

  const handleClick = async () => {
    try {
      const res = await getCurrentLocation();
      setLocation(res);
      setLocationSearchText(res?.address || "");
    } catch (err) {
      setLocationSearchText("");
      toast.error(err.message);
    }
  };

  return (
    <>
      <MapModal
        open={open}
        setOpen={setOpen}
        setLocation={setLocation}
        location={location}
        setLocationSearchText={setLocationSearchText}
        locationSearchText={locationSearchText}
      />
      <div className="relative">
        <div className="flex items-center gap-2 min-h-[40px]">
          <Input
            inputRef={inputRef}
            error={!!errors?.address}
            id="searchInput"
            type="text"
            placeholder="Search for a location"
            className="bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            containerProps={{
              className: "min-w-0",
            }}
            value={locationSearchText}
            onChange={(e) => {
              setLocationSearchText(e.target.value);
              if (setErrors) setErrors({ ...errors, address: null });
            }}
          />
          <img
            onClick={handleClick}
            src={currentlocation}
            alt="Current Location"
            className="w-6 h-6 cursor-pointer rounded-md hover:opacity-80 transition-opacity"
          />
          <img
            onClick={handleOpen}
            src={GoogleMapSVG}
            alt="Open Map"
            className="w-9 h-9 cursor-pointer rounded-md hover:opacity-80 transition-opacity"
          />
        </div>
        {errors?.address && (
          <Typography
            color="red"
            className="text-red-700 text-sm font-medium mt-1"
          >
            {errors.address}
          </Typography>
        )}
      </div>
    </>
  );
};

export default SearchBox;