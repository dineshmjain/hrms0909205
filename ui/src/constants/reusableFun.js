import Geocoder from 'react-native-geocoding'

const getLocationWithLatLong = (latlng) => {
  return new Promise((resolve, reject) => {
    const mapApiKey = import.meta.env.VITE_MAPAPI; // Replace with your actual API key
    Geocoder.init(mapApiKey);
    Geocoder.from([latlng.lat, latlng.lng])
      .then(response => {
        const locationData = response.results[0].address_components;
        const address = response.results[0].formatted_address;
        let city = '';
        let state = '';
        let country = '';
        let pincode = '';
        let district = '';
        locationData.forEach(data => {
          data.types.forEach(type => {
            switch (type) {
              case 'locality':
                city = data.long_name;
                break;
              case 'administrative_area_level_1':
                state = data.long_name;
                break;
              case 'administrative_area_level_3':
                district = data.long_name;
                break;
              case 'country':
                country = data.long_name;
                break;
              case 'postal_code':
                pincode = data.long_name;
                break;
              default:
                // Handle other cases if needed
                break;
            }
          });
        });
        console.log({
          city,
          district,
          state,
          country,
          pincode,
          lat: latlng.lat,
          lng: latlng.lng,
          address,
          type: "Point",
        }, 'current location--------------------------------------------')
        resolve({
          city,
          district,
          state,
          country,
          pincode,
          lat: latlng.lat,
          lng: latlng.lng,
          address,
          type: "Point",
        });
      })
      .catch(error => {
        console.log('Error in getLocationWithLatLong:', error);
        reject(new Error('Unable to fetch location data'));
      });
  });
};

const getCurrentLocation = async () => {
  try {
    console.log('getCurrentLocation Triggred!!!...');

    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.watchPosition(
        resolve,
        reject,
        { enableHighAccuracy: true } // Optional: request high accuracy
      );
    });
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latlng = { lat, lng };
    const res = await getLocationWithLatLong(latlng);
    console.log(res, 'getCurrentLocation')
    return res;
  } catch (err) {
    console.log('Error fetching location:', err);
    throw new Error("Unable to fetch location data. Please allow location access or check your settings.");
  }
};

const getParamsFromObject = (obj) => {
  let params = Object?.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
  return params ? `?${params}` : ``;
}

function getBestGeocoderResult(results) {
  if (!Array.isArray(results) || results.length === 0) return null;

  // 1. Prioritize by type — looking for street or city-level precision
  const preferredTypes = [
    "street_address",
    "premise",
    "locality",
    "sublocality",
    "administrative_area_level_3",
  ];

  const ranked = results
    .filter(result =>
      result.types.some(type => preferredTypes.includes(type))
    )
    .sort((a, b) => {
      const rank = type => preferredTypes.indexOf(type);
      const aType = a.types.find(type => preferredTypes.includes(type)) || "";
      const bType = b.types.find(type => preferredTypes.includes(type)) || "";
      return rank(aType) - rank(bType);
    });

  // 2. Pick the top ranked or fallback to first
  const best = ranked[0] || results[0];

  return best;
}
const getLocationWithLatLongFull = (latlng) => {
  return new Promise((resolve, reject) => {
    const mapApiKey = import.meta.env.VITE_MAPAPI;

    if (!mapApiKey) {
      reject(new Error("Missing Google Maps API Key"));
      return;
    }

    Geocoder.init(mapApiKey);

    Geocoder.from([latlng.lat, latlng.lng])
      .then((response) => {
        const bestResult = getBestGeocoderResult(response.results);

        if (!bestResult) {
          console.error("No valid geocoding result found.");
          reject(new Error("No geocoding results"));
          return;
        }

        let city = "";
        let state = "";
        let country = "";
        let pincode = "";
        let district = ""

        bestResult.address_components.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("administrative_area_level_3")) {
            district = component.long_name
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            pincode = component.long_name;
          }

        });

        resolve({
          city,
          state,
          country,
          pincode,
          address: bestResult.formatted_address,
          lat: latlng.lat,
          lng: latlng.lng,
          district,
          coordinates: [latlng.lng, latlng.lat]
        });
      })
      .catch((error) => {
        console.error("Error in getLocationWithLatLong:", error);
        reject(new Error("Unable to fetch location data"));
      });
  });
};

function removeEmptyStrings(obj) {
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map(removeEmptyStrings)
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          !(typeof item === "object" && !Array.isArray(item) && Object.keys(item).length === 0) && // remove empty objects
          !(Array.isArray(item) && item.length === 0) // remove empty arrays
      );
    return cleanedArray;
  } else if (obj !== null && typeof obj === "object") {
    const cleanedEntries = Object.entries(obj)
      .map(([key, value]) => [key, removeEmptyStrings(value)])
      .filter(
        ([_, value]) =>
          value !== "" &&
          value !== undefined &&
          value !== null &&
          !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) && // remove empty objects
          !(Array.isArray(value) && value.length === 0) // remove empty arrays
      );

    return Object.fromEntries(cleanedEntries);
  }

  return obj;
}

const extensionToTypeMap = {
  jpg: "image",
  svg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  mp4: "video",
  webm: "video",
  mp3: "audio",
  wav: "audio",
  pdf: "document",
  doc: "document",
  docx: "document",
  xls: "document",
  xlsx: "document",
};

const getFileType = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return extensionToTypeMap[ext] || "unknown";
};

function camelCaseToText(str) {
  if (!str) return "";

  // Insert a space before all caps and capitalize the first word
  const withSpaces = str.replace(/([A-Z])/g, ' $1').trim();

  // Capitalize the first letter of the result
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

// utils or constants/reusableFun.js

const toTitleCase = (str = "") => {
  if (!str || typeof str !== "string") return "";

  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      // if word is wrapped in brackets
      if (/^\(.*\)$/.test(word)) {
        const inner = word.slice(1, -1);
        // keep acronym uppercase (HRA, PF, etc.)
        if (inner.length <= 4) {
          return `(${inner.toUpperCase()})`;
        }
        // otherwise title-case the inside
        return `(${inner.charAt(0).toUpperCase() + inner.slice(1)})`;
      }

      // normal word
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};


export { getLocationWithLatLong, camelCaseToText, getCurrentLocation, getParamsFromObject, getLocationWithLatLongFull, getBestGeocoderResult, removeEmptyStrings, getFileType, toTitleCase };
