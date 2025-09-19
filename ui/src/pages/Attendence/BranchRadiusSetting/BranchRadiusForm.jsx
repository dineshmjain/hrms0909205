import { Form, useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AddressNew from "../../../components/Address/AddressNew";
import Header from "../../../components/header/Header";
import toast from "react-hot-toast";
import {
  BranchRadiusUpdateAction,
  BranchPolygonUpdateAction,
} from "../../../redux/Action/Branch/BranchAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const BranchRadiusForm = () => {
  const [isEditAvailable, setIsEditAvailable] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef(null);

  const { user } = useSelector((state) => state?.user);
  const { values, setFieldValue, isValid, dirty } = useFormikContext();
  const prefix = "branchAddress";
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location?.state) {
      toast.error("No branch data provided");
      navigate("../");
      return;
    }

    const data = location.state;
    const address = { ...data?.address } || {};
    const coords = data?.geoJson?.coordinates || [];
    const lng = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);
    const isValidCoords = !isNaN(lat) && !isNaN(lng);

    const structuredAddress = {
      address,
      geoJson: isValidCoords
        ? { type: "Point", coordinates: [lng, lat] }
        : { type: "Point", coordinates: [] },
      geoLocation: data?.geoLocation || {},
    };
    // Initialize polygon paths from geoBoundary if available
    let polygonPaths = [];
    if (
      data?.geoBoundary?.type === "Polygon" &&
      data.geoBoundary.coordinates.length > 0
    ) {
      const coords = data.geoBoundary.coordinates[0];
      polygonPaths = coords.map(([lng, lat]) => ({ lat, lng }));
    }

    setFieldValue(prefix, {
      hno: address?.hno || "",
      city: address?.city || "",
      state: address?.state || "",
      district: address?.district || "",
      country: address?.country || "",
      pincode: address?.pincode || "",
      street: address?.street || "",
      landmark: address?.landmark || "",
      taluk: address?.taluk || "",
      addressTypeId: address?.addressTypeId || "",
      radius: data?.radius || 0,
      mapCenter: isValidCoords ? { lat, lng } : { lat: 28.6139, lng: 77.209 }, // default: Delhi
      structuredAddress,
      geoAddress: data?.geoLocation?.address || "",
      polygon: { paths: polygonPaths }, // Add this line to initialize polygon data
      geoType: data?.geoBoundary ? "polygon" : "radius", // Set appropriate geoType
    });

    setMapReady(true);
  }, [location, setFieldValue, navigate]);

  const updateRadius = async () => {
    // if (!isValid || !dirty) {
    //   toast.error("Please make changes before updating");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      console.log("Updating branch radius with values:", location);
      const updateParams = {
        ...removeEmptyStrings(values?.branchAddress?.structuredAddress),
        branchId: location?.state?._id,
        subOrgId: user?.suborganization?.r ? location?.state?.subOrg : "",
        radius: values?.branchAddress?.radius,
        clientMappedId: location?.state?.clientMappedId
          ? location?.state?.clientMappedId || ""
          : "",
      };

      const result = await dispatch(
        BranchRadiusUpdateAction(removeEmptyStrings(updateParams))
      );

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success("Radius updated successfully");
        navigate("../");
      } else {
        toast.error("Failed to update radius");
      }
    } catch (error) {
      console.error("Update radius error:", error);
      toast.error("Failed to update radius");
    } finally {
      setIsSubmitting(false);
    }
  };
  const updatePolygon = async () => {
    setIsSubmitting(true);
    try {
      const paths = values.branchAddress.polygon.paths;
      if (!paths || paths.length < 3) {
        toast.error("Polygon must have at least 3 points");
        setIsSubmitting(false);
        return;
      }

      // Close polygon
      const coords = paths.map((p) => [p.lng, p.lat]);
      if (
        coords.length > 0 &&
        (coords[0][0] !== coords[coords.length - 1][0] ||
          coords[0][1] !== coords[coords.length - 1][1])
      ) {
        coords.push(coords[0]);
      }

      const updateParams = {
        branchId: location?.state?._id,
        // subOrgId: user?.suborganization?.r ? location?.state?.subOrg : "",
        // clientMappedId: location?.state?.clientMappedId || "",
        geoBoundary: {
          type: "Polygon",
          coordinates: [coords],
        },
      };

      const result = await dispatch(BranchPolygonUpdateAction(updateParams));

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success("Polygon updated successfully");
        navigate("../");
      } else {
        toast.error("Failed to update polygon");
      }
    } catch (error) {
      console.error("Update polygon error:", error);
      toast.error("Failed to update polygon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("../");
  };

  if (!location?.state) {
    return null; // or a loading spinner
  }

  return (
    <Form>
      <div className="flex flex-col w-full p-2 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
        <Header
          isBackHandler
          headerLabel="Edit Geo Fencing Settings"
          subHeaderLabel="Manage your Branch and Geo Fencing Setting"
          handleClick={
            values.branchAddress?.geoType === "polygon"
              ? updatePolygon
              : updateRadius
          }
          isButton
          isEditAvaliable={isEditAvailable}
          handleEdit={() => setIsEditAvailable(!isEditAvailable)}
          buttonTitle={isSubmitting ? "Updating..." : "Update"}
          isButtonDisabled={isSubmitting || !isValid || !dirty}
          handleBack={handleBack}
        />
        <div className="flex flex-col gap-2 p-4 mb-2">
          {mapReady && (
            <AddressNew
              isEditAvaliable={isEditAvailable}
              prefix={prefix}
              isMap={true}
              isRadius={true}
              isCitySearchWithTimezone={false}
            />
          )}
        </div>
      </div>
    </Form>
  );
};

export default BranchRadiusForm;
