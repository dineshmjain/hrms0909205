import React, { useState, useEffect, useRef } from "react";
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
  Marker,
} from "@react-google-maps/api";
import { getLocationWithLatLongFull } from "../../constants/reusableFun";

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const MapModal = ({
  open,
  setOpen,
  setLocation,
  location,
  setLocationSearchText,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(location || {});
  const [searchText, setSearchText] = useState(location?.address || "");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, []);

  useEffect(() => {
    setSelectedLocation(location || {});
    setSearchText(location?.address || "");
  }, [location]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    if (window.google && window.google.maps) {
      setPlacesService(new window.google.maps.places.PlacesService(map));
    }
  };

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const data = await getLocationWithLatLongFull({ lat, lng });

    const newLocation = {
      ...data,
      lat,
      lng,
      coordinates: [lng, lat],
      type: "Point",
    };

    setSelectedLocation(newLocation);
    setSearchText(data?.address || "");
    setLocationSearchText(data?.address || "");
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

  const handleSuggestionSelect = (placeId) => {
    if (!placesService || !placeId) return;

    placesService.getDetails({ placeId }, async (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address;

        const data = await getLocationWithLatLongFull({ lat, lng });

        setSelectedLocation({
          ...data,
          lat,
          lng,
          address,
          coordinates: [lng, lat],
        });

        setSearchText(address || "");
        setSuggestions([]);
      }
    });
  };

  const handleSaveLocation = () => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      alert("Please select a location first.");
      return;
    }

    setLocation(selectedLocation);
    setLocationSearchText(
      selectedLocation?.formatted_address || selectedLocation?.address || ""
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} size="lg">
      <div className="min-h-[90vh] max-h-[100vh] overflow-scroll">
        <div className="flex justify-between items-center p-4">
        <DialogHeader>Select Location</DialogHeader>

        </div>

           <DialogBody className="space-y-4">     
               <div className="relative h-80 mb-6 w-full">
            <Input
              value={searchText}
              onChange={(e) => {
                const val = e.target.value;
                setSearchText(val);
                fetchSuggestions(val);
              }}
              placeholder="Search location..."
              labelProps={{ className: "hidden" }}
              className="absolute z-10 top-2 left-1/2 transform -translate-x-1/2 bg-white border rounded-md p-2 !border-gray-400 text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10 w-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-20 top-14 left-1/2 transform -translate-x-1/2 w-3/4 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    onClick={() => handleSuggestionSelect(suggestion.place_id)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            )}
            <GoogleMap
              onLoad={handleMapLoad}
              onClick={handleMapClick}
              center={
                selectedLocation?.lat
                  ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
                  : defaultCenter
              }
              zoom={12}
              mapContainerStyle={{ width: "100%", height: "100%" }}
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
        </DialogBody>
        <DialogFooter className="flex justify-between">
          <Button color="red" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSaveLocation} disabled={!selectedLocation?.lat}>
            Save Location
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default MapModal;
