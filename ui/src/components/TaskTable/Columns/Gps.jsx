import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MapModal from "../../TaskMaps/MapModal";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";

const Gps = ({ data, idx, subData, subIdx, handleChange, details }) => {
  const actualData = subIdx == undefined ? data : subData;
  const { error } = useSelector((state) => state?.error);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(data?.GPSLocation ?? null);

  useEffect(() => {
    if (location) {
      let e = {
        target: {
          name: "GPSLocation",
          value: location,
        },
      };

      handleChange(e, idx, subIdx);
    }
  }, [location]);

  const FullAddress = ({ selectedLocation }) => {
    return (
      <div className="  flex gap-2  rounded-md px-4 p-2  flex-wrap ">
        {selectedLocation?.city && (
          <p>
            <span className="font-bold text-gray-100">City:</span>{" "}
            {selectedLocation?.city}
          </p>
        )}
        {selectedLocation?.state && (
          <p>
            <span className="font-bold text-gray-100">State:</span>{" "}
            {selectedLocation?.state}
          </p>
        )}
        {selectedLocation?.country && (
          <p>
            <span className="font-bold text-gray-100">Country:</span>{" "}
            {selectedLocation?.country}
          </p>
        )}
        {selectedLocation?.pincode && (
          <p>
            <span className="font-bold text-gray-100">Pincode:</span>{" "}
            {selectedLocation?.pincode}
          </p>
        )}
        {selectedLocation?.address && (
          <p>
            <span className="font-bold text-gray-100">Address:</span>{" "}
            {selectedLocation?.address}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {open && (
        <MapModal
          open={open}
          setOpen={setOpen}
          location={location}
          setLocation={setLocation}
        />
      )}
      <div
        className={`cursor-pointer prevent-modal-open text-sm hover:bg-gray-400 font-medium px-2 p-1 max-w-[20ch] truncate rounded-md flex self-center justify-self-center items-center  ${
          error?.[`GPSLocation-${idx}-${subIdx}`] &&
          `border-red-600 border-2 border-box  `
        }`}
        onClick={() => setOpen(true)}
      >
        {Object.values(data?.GPSLocation)?.length ? (
          <TooltipMaterial
            content={<FullAddress selectedLocation={location} />}
          >
            <div className="truncate max-w-[20ch]">{location?.address}</div>
          </TooltipMaterial>
        ) : (
          `Select location`
        )}
      </div>
    </>
  );
};

export default Gps;
