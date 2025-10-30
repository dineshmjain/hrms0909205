import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { getLocationWithLatLongFull } from "../../constants/reusableFun";

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: false,
  zoomControl: true,
  gestureHandling: "greedy",
  disableDefaultUI: false,
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Initialize services when modal opens
  useEffect(() => {
    if (open && window.google && window.google.maps && !autocompleteService) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, [open, autocompleteService]);

  // Update local state when location prop changes
  useEffect(() => {
    if (open) {
      setSelectedLocation(location || {});
      setSearchText(location?.address || "");
    }
  }, [location, open]);

  // Reset map loaded state when modal opens
  useEffect(() => {
    if (open) {
      setMapLoaded(false);
    } else {
      setMapLoaded(false);
    }
  }, [open]);

  // Multiple resize attempts to ensure map renders
  useEffect(() => {
    if (open && mapRef.current) {
      const resizeTimes = [0, 100, 300, 500, 1000];
      const timers = [];

      resizeTimes.forEach((delay) => {
        const timer = setTimeout(() => {
          if (mapRef.current && window.google?.maps?.event) {
            window.google.maps.event.trigger(mapRef.current, 'resize');
            
            // Re-center map
            const center = selectedLocation?.lat && selectedLocation?.lng
              ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
              : defaultCenter;
            
            mapRef.current.panTo(center);
            
            if (selectedLocation?.lat && selectedLocation?.lng) {
              mapRef.current.setZoom(15);
            }
          }
        }, delay);
        timers.push(timer);
      });

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [open, selectedLocation, mapLoaded]);

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
    
    if (window.google && window.google.maps) {
      setPlacesService(new window.google.maps.places.PlacesService(map));
    }
    
    // Force initial resize
    setTimeout(() => {
      if (window.google?.maps?.event) {
        window.google.maps.event.trigger(map, 'resize');
        
        const center = selectedLocation?.lat && selectedLocation?.lng
          ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
          : defaultCenter;
        
        map.panTo(center);
        
        if (selectedLocation?.lat && selectedLocation?.lng) {
          map.setZoom(15);
        }
      }
    }, 100);
  }, [selectedLocation]);

  const handleMapClick = useCallback(async (event) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback((value) => {
    if (!autocompleteService || !value) {
      setSuggestions([]);
      return;
    }

    autocompleteService.getPlacePredictions(
      { input: value, componentRestrictions: { country: "in" } },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [autocompleteService]);

  const handleSuggestionSelect = useCallback((placeId) => {
    if (!placesService || !placeId) return;

    setIsLoading(true);
    placesService.getDetails({ placeId }, async (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        try {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address;

          const data = await getLocationWithLatLongFull({ lat, lng });

          const newLocation = {
            ...data,
            lat,
            lng,
            address,
            coordinates: [lng, lat],
            type: "Point",
          };

          setSelectedLocation(newLocation);
          setSearchText(address || "");
          setSuggestions([]);

          // Pan map to selected location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
  }, [placesService]);

  const handleSaveLocation = () => {
    if (!selectedLocation?.lat || !selectedLocation?.lng) {
      return;
    }

    setLocation(selectedLocation);
    setLocationSearchText(
      selectedLocation?.formatted_address || selectedLocation?.address || ""
    );
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setSuggestions([]);
    setMapLoaded(false);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSuggestions([]);
  };

  // Get center and zoom based on selected location
  const mapCenter = selectedLocation?.lat && selectedLocation?.lng
    ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
    : defaultCenter;
  
  const mapZoom = selectedLocation?.lat && selectedLocation?.lng ? 15 : 5;

  return (
    <Dialog 
      open={open} 
      handler={handleClose} 
      size="xl" 
      className="bg-transparent shadow-none"
      dismiss={{ enabled: true }}
      animate={{
        mount: { scale: 1, opacity: 1 },
        unmount: { scale: 0.9, opacity: 0 },
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Select Location
            </Typography>
            <Typography variant="small" color="gray" className="mt-1 font-normal">
              Click on the map or search for a location
            </Typography>
          </div>
          <IconButton variant="text" color="blue-gray" onClick={handleClose} size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        {/* Body */}
        <DialogBody className="p-2 px-4 flex-1 overflow-auto" style={{ minHeight: '500px' }}>
          <div className="h-full flex flex-col">
            {/* Search Bar */}
           <div className="mb-2">
             <Typography variant="small">Location Search</Typography>
            <div className="relative flex-shrink-0">
              <Input
                value={searchText}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchText(val);
                  fetchSuggestions(val);
                }}
                placeholder="Search for a location..."
                // label="Location Search"
                icon={
                  searchText ? (
                    <button 
                      onClick={handleClearSearch} 
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  )
                }
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-auto">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      onClick={() => handleSuggestionSelect(suggestion.place_id)}
                      className="p-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {suggestion.description}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
           </div>

            {/* Selected Location Display */}
            {/* {selectedLocation?.address && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      Selected Location:
                    </Typography>
                    <Typography variant="small" color="gray" className="mt-1">
                      {selectedLocation.address}
                    </Typography>
                  </div>
                </div>
              </div>
            )} */}

            {/* Map Container - Fixed height */}
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 shadow-md bg-gray-100" style={{ height: '450px', flexShrink: 0 }}>
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 z-30 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    <Typography variant="small" color="gray">Loading location...</Typography>
                  </div>
                </div>
              )}
              
              <GoogleMap
                onLoad={handleMapLoad}
                onClick={handleMapClick}
                center={mapCenter}
                zoom={mapZoom}
                mapContainerStyle={mapContainerStyle}
                options={mapOptions}
              >
                {selectedLocation?.lat && selectedLocation?.lng && (
                  <Marker
                    position={{
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                    }}
                    draggable
                    onDragEnd={handleMapClick}
                    animation={window.google?.maps?.Animation?.DROP}
                  />
                )}
              </GoogleMap>
            </div>
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between w-full gap-4">
            <Button 
              variant="outlined" 
              color="red" 
              onClick={handleClose} 
              className="px-6 uppercase"
              size="md"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleSaveLocation}
              disabled={!selectedLocation?.lat || isLoading}
              className="px-6 uppercase"
              size="md"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Save Location"
              )}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default MapModal;