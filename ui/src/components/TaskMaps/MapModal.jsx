// export default MapModal;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getLocationWithLatLong } from "../../constants/reUsableFun";
import Modal from "../Modal/TaskModal";

const libraries = ["places"];

const MapModal = ({
  open,
  setOpen,
  setLocation,
  location,
  setLoactionSearchText = () => {},
}) => {
  const [searchBox, setSearchBox] = useState(null);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPAPI,
    libraries,
  });
  const [zoom, setZoom] = useState(location ? 18 : 10);
  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
      setSearchText(location?.address || "");
    }
  }, [location]);

  // Initialize AutocompleteService
  // useEffect(() => {
  //   if (typeof google !== "undefined" && google.maps) {
  //     setAutocompleteService(new google.maps.places.AutocompleteService());
  //   }
  // }, []);

  // Handle search suggestion selection
  const handlePlaceSelect = async (place) => {
    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.getDetails(
      { placeId: place.place_id },
      async (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const lat = result.geometry.location.lat();
          const lng = result.geometry.location.lng();
          const address = result.formatted_address;

          const locationData = await getLocationWithLatLong({ lat, lng });

          setSelectedLocation({ ...locationData, lat, lng, address });
          setSearchText(address);
          setZoom(18);
          setSuggestions([]);
        }
      }
    );
  };

  // Fetch suggestions from the AutocompleteService
  const fetchSuggestions = (value) => {
    if (!value || !autocompleteService) return;

    autocompleteService.getPlacePredictions(
      { input: value },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  // Update search text and fetch suggestions while typing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    fetchSuggestions(value);
  };

  // Handle map click
  const handleMapClick = async (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const locationData = await getLocationWithLatLong({ lat, lng });
      console.log(location);

      setSelectedLocation({ ...locationData, lat, lng });
      setSearchText(locationData?.address || "Selected on Map");
    } catch (err) {
      console.error("handleMapClick ERROR:", err);
    }
  };

  // Save selected location and close modal
  const handleSaveLocation = () => {
    setLocation(selectedLocation);
    setLoactionSearchText(selectedLocation?.address || "Selected Location");
    setOpen(false);
  };

  return (
    <Modal
      heading={`Select Location`}
      onClose={() => setOpen(false)}
      contentParentCss={`flex-col gap-2 maxsm:max-w-[90vw]  min-w-[80vw]`}
      customCss={`min-w-[80vw] h-full maxsm:max-w-[90vw] `}
    >
      {isLoaded ? (
        <div className="relative h-full flex flex-col gap-4 w-full overflow-y-scroll">
          {/* Search Box */}
          <div className="">
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={() =>
                handlePlaceSelect(searchBox.getPlaces()[0])
              }
            >
              <Input
                type="text"
                name="Location"
                placeholder="Search location..."
                value={searchText}
                className=""
                onChange={handleSearchChange}
                onFocus={handleSearchChange}
                onBlur={() => setSuggestions([])}
              />
            </StandaloneSearchBox>
            {suggestions.length > 0 && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3/4 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                {suggestions.map((place, index) => (
                  <div
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    {place.description}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Google Map */}
          <div className="h-[80vw]">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={
                selectedLocation?.lat
                  ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
                  : { lat: 28.7041, lng: 77.1025 }
              }
              zoom={zoom}
              onClick={handleMapClick}
            >
              {selectedLocation?.lat && selectedLocation?.lng && (
                <Marker
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                  }}
                  draggable
                  onDragEnd={handleMapClick}
                />
              )}
            </GoogleMap>
          </div>

          {/* Display Selected Location Details */}
          {selectedLocation?.lat && selectedLocation?.lng && (
            <div className="  flex gap-2 bg-gray-300 rounded-md px-4 p-2  flex-wrap maxsm:text-sm ">
              {selectedLocation.city && (
                <p>
                  <span className="font-bold text-gray-900">City:</span>{" "}
                  {selectedLocation.city}
                </p>
              )}
              {selectedLocation.state && (
                <p>
                  <span className="font-bold text-gray-900">State:</span>{" "}
                  {selectedLocation.state}
                </p>
              )}
              {selectedLocation.country && (
                <p>
                  <span className="font-bold text-gray-900">Country:</span>{" "}
                  {selectedLocation.country}
                </p>
              )}
              {selectedLocation.pincode && (
                <p>
                  <span className="font-bold text-gray-900">Pincode:</span>{" "}
                  {selectedLocation.pincode}
                </p>
              )}
              {selectedLocation.address && (
                <p>
                  <span className="font-bold text-gray-900">Address:</span>{" "}
                  {selectedLocation.address}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        "Loading Maps"
      )}

      <div className="flex w-full gap-2 flex-grow justify-end h-fit">
        <Button
          onClick={() => setOpen(false)}
          color="red"
          className="flex-1 sm:max-w-fit font-manrope maxsm:text-xs text-sm py-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveLocation}
          color="green"
          className="flex-1 sm:max-w-fit font-manrope maxsm:text-xs text-sm py-2"
        >
          Save Location
        </Button>
      </div>
    </Modal>
  );
};

export default MapModal;
