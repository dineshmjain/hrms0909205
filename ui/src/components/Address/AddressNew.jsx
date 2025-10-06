import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormikContext } from "formik";
import { getAddressTypesAction } from "../../redux/Action/Global/GlobalAction";
import currentlocation from "../../assets/Images/current-location.png";
import FormikInput from "../input/FormikInput";
import CitySearchWithTimezone from "../Input/CitySearchWithTimezone";
import { Input, Typography } from "@material-tailwind/react";
import { GoogleMap, Marker, Circle, Polygon } from "@react-google-maps/api";
import {
  getCurrentLocation,
  getLocationWithLatLongFull,
} from "../../constants/reusableFun";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";

/** ✅ Address config */
export const AddressCon = (prefix = "branchAddress") => ({
  initialValues: {
    [prefix]: {
      addressTypeId: "",
      hno: "",
      street: "",
      landmark: "",
      city: "",
      taluk: "",
      district: "",
      state: "",
      country: "",
      pincode: "",
      location: { lat: 0, lng: 0 },
      pointType: "Point",
      geoAddress: "",
      isEdit: false,
      structuredAddress: {},
      radius: 1,
      mapCenter: { lat: 28.6139, lng: 77.209 },
      geoType: "radius", // default
      polygon: { paths: [] }, // initialize polygon data
    },
  },
  validationSchema: {
    [prefix]: Yup.object().shape({
      addressTypeId: Yup.string().required("Address Type is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      pincode: Yup.string().required("Pincode is required"),
      location: Yup.object({
        lat: Yup.number().required(),
        lng: Yup.number().required(),
      }).required("GPS Location is required"),
    }),
  },
});

/** ✅ Utility: Extract field from google components */
const extractAddressComponent = (components, type) =>
  components.find((c) => c.types.includes(type))?.long_name || "";

/** ✅ Utility: Deep compare */
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const AddressNew = ({
  isEditAvaliable = false,
  prefix,
  isMap = false,
  isRadius = false,
  isCitySearchWithTimezone = true,
}) => {
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext();
  const { addressTypes = [] } = useSelector((state) => state.global);
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null); // null until filled
  const [locationSearch, setLocationSearchText] = useState("");
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const getFieldName = (name) => (prefix ? `${prefix}.${name}` : name);
  const formValues = prefix ? values[prefix] || {} : values || {};
  const [polygonPaths, setPolygonPaths] = useState([]);
  const {
    addressTypeId,
    hno,
    street,
    landmark,
    city,
    taluk,
    district,
    state: st,
    country,
    pincode,
    structuredAddress,
    radius,
    mapCenter,
    geoAddress,
  } = formValues;

  /** ✅ Calculate zoom from radius */
  const getZoomFromRadius = (r) => {
    const radiusVal = Math.max(Number(r) || 100, 10);
    return Math.min(
      Math.max(Math.floor(17 - Math.log2(radiusVal / 100)), 10),
      21
    );
  };

  /** Initialize Google Autocomplete and a fallback PlacesService */
  useEffect(() => {
    if (window.google?.maps) {
      if (!autocompleteService) {
        setAutocompleteService(
          new window.google.maps.places.AutocompleteService()
        );
      }
      // create a fallback placesService that doesn't require a rendered map
      if (!placesService && window.google.maps.places?.PlacesService) {
        try {
          setPlacesService(
            new window.google.maps.places.PlacesService(
              document.createElement("div")
            )
          );
        } catch (e) {
          // ignore
        }
      }
    }
  }, [autocompleteService, placesService]);

  /**  Fetch address types */
  useEffect(() => {
    dispatch(getAddressTypesAction()).then(({ payload }) => {
      if (!addressTypeId && payload?.data?.[0]?._id) {
        setFieldValue(getFieldName("addressTypeId"), payload.data[0]._id);
      }
    });
  }, [dispatch, addressTypeId, setFieldValue]);

  /**  Autofill Formik when location changes */
  useEffect(() => {
    if (!location?.lat || !location?.lng) return;

    const { lat, lng } = location;
    setFieldValue(getFieldName("location"), { lat, lng });
    setFieldValue(getFieldName("mapCenter"), { lat, lng });

    ["city", "state", "country", "pincode", "district", "geoAddress"].forEach(
      (f) => setFieldValue(getFieldName(f), location[f] || "")
    );
  }, [location, setFieldValue]);

  const handlePolygonClick = (e) => {
    if (isEditAvaliable) return; // Don't add points in edit mode

    const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const updatedPaths = [...polygonPaths, newPoint];
    setPolygonPaths(updatedPaths);

    // Update Formik value
    setFieldValue(getFieldName("polygon.paths"), updatedPaths);
  };

  /**  Structured Address memo */
  const structured = useMemo(
    () => ({
      address: {
        addressTypeId,
        hno,
        landmark,
        street,
        city,
        district,
        taluk,
        state: st,
        country,
        pincode,
      },
      geoLocation: {
        address: location?.address || geoAddress || "",
        city,
        district,
        state: st,
        country,
        pincode,
      },
      geoJson: {
        type: "Point",
        // geoJson coordinates are [lng, lat]
        coordinates:
          location?.lat && location?.lng
            ? [Number(location.lng), Number(location.lat)]
            : [0, 0],
      },
    }),
    [
      location,
      geoAddress,
      addressTypeId,
      hno,
      street,
      landmark,
      city,
      district,
      taluk,
      st,
      country,
      pincode,
    ]
  );

  // Initialize location from existing data
  useEffect(() => {
    if (
      !location &&
      structuredAddress?.geoJson?.coordinates?.length === 2
    ) {
      const [lng, lat] = structuredAddress.geoJson.coordinates;
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation({
          lat: Number(lat),
          lng: Number(lng),
          address: structuredAddress?.geoLocation?.address || "",
          city: structuredAddress?.geoLocation?.city || "",
          state: structuredAddress?.geoLocation?.state || "",
          district: structuredAddress?.geoLocation?.district || "",
          country: structuredAddress?.geoLocation?.country || "",
          pincode: structuredAddress?.geoLocation?.pincode || "",
        });
        setFieldValue(getFieldName("mapCenter"), {
          lat: Number(lat),
          lng: Number(lng),
        });
        setFieldValue(
          getFieldName("geoAddress"),
          structuredAddress?.geoLocation?.address || ""
        );
      }
    }
  }, [structuredAddress, location, setFieldValue]);

  /** ✅ Sync structuredAddress */
  useEffect(() => {
    if (!deepEqual(structuredAddress, structured)) {
      setFieldValue(getFieldName("structuredAddress"), structured);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structured]);

  /** ✅ Update isEdit flag */
  useEffect(() => {
    if (geoAddress) {
      setFieldValue(getFieldName("isEdit"), geoAddress !== location?.address);
    }
  }, [geoAddress, location, setFieldValue]);

  /** ✅ Fetch suggestions */
  const fetchSuggestions = useCallback(
    (value) => {
      if (!autocompleteService || !value) return;
      autocompleteService.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          setSuggestions(
            status === window.google.maps.places.PlacesServiceStatus.OK
              ? predictions
              : []
          );
        }
      );
    },
    [autocompleteService]
  );

  /** ✅ Handle suggestion select */
  const handleSuggestionSelect = (placeId) => {
    if (!placeId) return;
    // prefer the placesService bound to a map if available, otherwise the fallback
    const svc = placesService || (window.google?.maps && new window.google.maps.places.PlacesService(document.createElement("div")));
    if (!svc) return;

    svc.getDetails({ placeId }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place.geometry?.location
      ) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const components = place.address_components || [];
        const locData = {
          lat,
          lng,
          city: extractAddressComponent(components, "locality"),
          state: extractAddressComponent(
            components,
            "administrative_area_level_1"
          ),
          district: extractAddressComponent(
            components,
            "administrative_area_level_2"
          ),
          country: extractAddressComponent(components, "country"),
          pincode: extractAddressComponent(components, "postal_code"),
          address: place.formatted_address || place.name,
        };
        setLocation(locData);
        setLocationSearchText(locData.address);
        setSuggestions([]);
      }
    });
  };

  /** ✅ Marker drag handler */
  const onDragEndFunction = async (e) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (!lat || !lng) return;
    const data = await getLocationWithLatLongFull({ lat, lng });
    setLocation({ ...data, lat, lng });
    setLocationSearchText(data?.address || "");
  };

  /** ✅ Current Location */
  const handleCurrentLocation = async () => {
    try {
      const res = await getCurrentLocation();
      if (res) {
        setLocation({ ...res, lat: Number(res.lat), lng: Number(res.lng) });
        setLocationSearchText(res?.address || "");
      }
    } catch {
      setLocationSearchText("");
    }
  };

  /** ✅ Pan map when location updates */
  useEffect(() => {
    if (mapRef.current && location?.lat && location?.lng) {
      mapRef.current.panTo({
        lat: Number(location.lat),
        lng: Number(location.lng),
      });
    }
  }, [location]);

  useEffect(() => {
    if (isEditAvaliable && formValues.polygon?.paths?.length >= 3) {
      setPolygonPaths(formValues.polygon.paths);
    }
  }, [isEditAvaliable, formValues.polygon]);

  useEffect(() => {
    if (
      structuredAddress?.geoBoundary?.type === "Polygon" &&
      structuredAddress.geoBoundary.coordinates.length > 0
    ) {
      const coords = structuredAddress.geoBoundary.coordinates[0];
      // Ensure we have at least 3 points
      if (coords.length >= 3) {
        const paths = coords.map(([lng, lat]) => ({ lat, lng }));
        setPolygonPaths(paths);
      }
    }
  }, [structuredAddress]);

  const clearPolygon = () => {
    setPolygonPaths([]);
    setFieldValue(getFieldName("polygon.paths"), []);
  };

  return (
    <div className="w-full p-2">
      {/* Select Geo Fencing Type */}
      {isRadius && (
        <div className="flex items-center gap-4 my-4 p-2 border border-gray-200 rounded-md bg-gray-50">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="radius"
              checked={formValues.geoType === "radius"}
              onChange={() => setFieldValue(getFieldName("geoType"), "radius")}
            />
            Radius
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="polygon"
              checked={formValues.geoType === "polygon"}
              onChange={() => setFieldValue(getFieldName("geoType"), "polygon")}
            />
            Polygon
          </label>
        </div>
      )}

      {/* Radius Section */}
      {formValues.geoType === "radius" &&
        isRadius &&
        (isEditAvaliable ? (
          <div className="my-2">
            <Typography className="text-md font-semibold">Radius</Typography>
            <Typography className="text-md font-medium">{radius}</Typography>
          </div>
        ) : (
          <div className="w-32">
            <FormikInput
              name={getFieldName("radius")}
              size="sm"
              label="Radius"
              type="number"
              inputType="input"
              editValue={radius}
            />
          </div>
        ))}

      {formValues.geoType === "polygon" && (
        <div className="my-2">
          <Typography className="text-md font-semibold mb-2">
            Polygon Geofencing
          </Typography>

          <Typography className="text-sm text-gray-600 mb-4">
            Draw the polygon on the map to define the area.
          </Typography>
        </div>
      )}

      {/* GPS Display / Input */}

      {isMap && geoAddress && (
        <div>
          <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
            GPS Location
          </Typography>
          <Typography className="text-gray-700 text-[14px] mb-1 font-semibold">
            {geoAddress}
          </Typography>
        </div>
      )}

      {isCitySearchWithTimezone &&
        (isEditAvaliable ? (
          <div>
            <Typography className="text-gray-700 text-[14px] font-medium">
              GPS Location
            </Typography>
            <Typography className="text-gray-700 text-[14px] mb-1 font-semibold">
              {geoAddress}
            </Typography>
          </div>
        ) : (
          <>
            <Typography className="text-gray-700 text-[14px] mb-1 font-medium">
              GPS Location
            </Typography>
            <CitySearchWithTimezone
              name={`${prefix}.location`}
              locationSearchText={locationSearch || geoAddress}
              location={location}
              setLocation={setLocation}
              setLocationSearchText={setLocationSearchText}
            />
          </>
        ))}

      {/* Address Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        <FormikInput
          name={getFieldName("addressTypeId")}
          size="sm"
          label="Address Type"
          listData={addressTypes}
          inputName="Select Address Type"
          feildName="name"
          hideLabel
          showTip={false}
          showSerch
          handleClick={(selected) =>
            setFieldValue(getFieldName("addressTypeId"), selected?._id)
          }
          selectedOption={addressTypeId}
          selectedOptionDependency="_id"
          inputType={isEditAvaliable ? "edit" : "dropdown"}
          editValue={addressTypes.find((d) => d._id === addressTypeId)?.name}
        />

        {["hno", "street", "landmark", "city", "district", "taluk", "state", "country", "pincode"].map((field) => (
          <FormikInput
            key={field}
            name={getFieldName(field)}
            size="sm"
            label={
              field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")
            }
            inputType={isEditAvaliable ? "edit" : "input"}
            editValue={formValues[field]}
          />
        ))}
      </div>

      {/* Map for Radius */}
      {isMap && formValues.geoType === "radius" && (
        <div className="h-[400px] rounded-md overflow-hidden mt-4 bg-white">
          {!isEditAvaliable && (
            <div className="relative">
              <Typography className="text-gray-800 text-[14px] mb-1 font-medium">
                GPS Location
              </Typography>
              <Input
                value={locationSearch || geoAddress}
                label="Search Location"
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationSearchText(val);
                  fetchSuggestions(val);
                }}
                icon={
                  <TooltipMaterial content="Click for Current Location">
                    <img
                      onClick={handleCurrentLocation}
                      src={currentlocation}
                      alt="Current Location"
                      className="cursor-pointer rounded-md"
                    />
                  </TooltipMaterial>
                }
                placeholder="Search location..."
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full z-50 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
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
          )}

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{
              lat: Number(mapCenter?.lat || 0),
              lng: Number(mapCenter?.lng || 0),
            }}
            zoom={getZoomFromRadius(radius)}
            onLoad={(map) => {
              mapRef.current = map;
              if (!placesService) {
                setPlacesService(new window.google.maps.places.PlacesService(map));
              }
            }}
          >
            <Marker
              draggable={!isEditAvaliable}
              onDragEnd={onDragEndFunction}
              position={{
                lat: Number(location?.lat || mapCenter?.lat || 0),
                lng: Number(location?.lng || mapCenter?.lng || 0),
              }}
            />

            <Circle
              center={{
                lat: Number(mapCenter?.lat || 0),
                lng: Number(mapCenter?.lng || 0),
              }}
              radius={Number(radius || 0)}
              options={{
                strokeColor: "#0284c7",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#38bdf8",
                fillOpacity: 0.35,
              }}
            />
          </GoogleMap>
        </div>
      )}

      {/* Map for Polygon */}
      {isMap && formValues.geoType === "polygon" && (
        <div className="mt-4">
          {!isEditAvaliable && (
            <div className="relative mb-2">
              <Typography className="text-gray-800 text-[14px] mb-1 font-medium">
                GPS Location
              </Typography>
              <Input
                value={locationSearch || geoAddress}
                label="Search Location"
                onChange={(e) => {
                  const val = e.target.value;
                  setLocationSearchText(val);
                  fetchSuggestions(val);
                }}
                icon={
                  <TooltipMaterial content="Click for Current Location">
                    <img
                      onClick={handleCurrentLocation}
                      src={currentlocation}
                      alt="Current Location"
                      className="cursor-pointer rounded-md"
                    />
                  </TooltipMaterial>
                }
                placeholder="Search location..."
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 w-full z-50 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
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
          )}

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{
              lat: Number(mapCenter?.lat || location?.lat || 0),
              lng: Number(mapCenter?.lng || location?.lng || 0),
            }}
            zoom={14}
            onLoad={(map) => {
              mapRef.current = map;
              if (!placesService) {
                setPlacesService(new window.google.maps.places.PlacesService(map));
              }

              if (polygonPaths.length >= 3) {
                const bounds = new window.google.maps.LatLngBounds();
                polygonPaths.forEach((p) =>
                  bounds.extend(new window.google.maps.LatLng(p.lat, p.lng))
                );
                map.fitBounds(bounds);
              }
            }}
            onClick={isEditAvaliable ? undefined : handlePolygonClick}
          >
            {/* Show markers for all points */}
            {polygonPaths.map((p, idx) => (
              <Marker
                key={idx}
                position={{ lat: p.lat, lng: p.lng }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
              />
            ))}

            {/* Only show polygon if we have enough points */}
            {polygonPaths.length >= 3 && (
              <Polygon
                paths={polygonPaths}
                options={{
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            )}
          </GoogleMap>

          {/* Add clear button */}
          {!isEditAvaliable && polygonPaths.length > 0 && (
            <button
              onClick={clearPolygon}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Clear Polygon ({polygonPaths.length} points)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressNew;
