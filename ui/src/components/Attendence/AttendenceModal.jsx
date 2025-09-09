import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../Modal/Modal";
import { FiCameraOff, FiCamera, FiMapPin } from "react-icons/fi";
import {
  getCurrentLocation,
  getLocationWithLatLong,
} from "../../constants/reusableFun";
import moment from "moment/moment";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  AddAttendenceAction,
  GetCurrentDayAction,
} from "../../redux/Action/Attendence/attendenceAction";

const AttendanceModal = ({ showModal, setShowModal }) => {
  const DashboardData = useSelector((state) => state?.dashboard?.dashboard);
  const [cameraAccess, setCameraAccess] = useState(null); // null = not checked, true = granted, false = denied
  const [time, setTime] = useState(moment().format("HH:mm:ss"));
  const [locationAccess, setLocationAccess] = useState(null);
  const { punching } = useSelector((state) => state?.attendence);
  const [error, setError] = useState({});
  const [hasError, setHasError] = useState(false);
  const [attendanceData, setAttendeanceData] = useState({
    location: {},
    transactionDate: "",
    imgFile: "",
    imgPath: "",
    type: showModal == 1 ? "checkIn" : "checkOut",
  });
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  // Function to capture an image from the video feed and return a Blob
  const captureImage = () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject("Video feed not available");
        return;
      }

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas dimensions equal to video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame from video
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob and return it
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject("Failed to capture image");
        }
      }, "image/png");
    });
  };

  // Function to handle attendance submission
  const handleAddAttendence = async () => {
    try {
      const blob = await captureImage();

      // Create a preview URL
      const previewUrl = URL.createObjectURL(blob);

      // Convert Blob to File for API submission
      const file = new File([blob], `attendance_${Date.now()}.png`, {
        type: "image/png",
      });

      let { imgPath, imgFile, ...rest } = attendanceData;
      let transactionDate = moment().format();
      let reqbody = { ...rest, transactionDate };

      dispatch(AddAttendenceAction(reqbody))?.then(() => {
        dispatch(GetCurrentDayAction());
        handleClose();
      });
      // Update attendance data state
      // setAttendeanceData((prev) => ({
      //   ...prev,
      //   transactionDate: moment().format(),
      //   imgPath: previewUrl, // For preview
      //   imgFile: file,
      // }));
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  // Request Camera Access & Show Live Feed
  const requestCameraAccess = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraAccess((prev) => {
        return { error: "", status: "granted" };
      });
      setCameraAccess("granted");
      setError((prev) => {
        let temp = { ...prev };
        delete temp?.camera;
        return { ...temp };
      });
      setStream(mediaStream);
    } catch (error) {
      setCameraAccess("denied");
      setError((prev) => {
        return { ...prev, camera: "Please allow camera access!" };
      });
    }
  };

  // Request Location Access
  const requestLocationAccess = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // get location using coords if failed set error
        try {
          let data = await getLocationWithLatLong({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setAttendeanceData((prev) => {
            return { ...prev, location: data };
          });
          setLocationAccess("granted");
          setError((prev) => {
            let temp = { ...prev };
            delete temp?.location;
            return { ...temp };
          });
        } catch {
          setLocationAccess("error");
          setError((prev) => {
            return { ...prev, location: "Error getting location to try again" };
          });
        }
      },
      () => {
        setLocationAccess("denied");
        setError((prev) => {
          return { ...prev, location: "Allow location access!" };
        });
      }
    );
  };

  // Stop Camera Stream on Modal Close
  const handleClose = async () => {
    if (stream) {
      for (const track of stream.getTracks()) {
        await track.stop();
      }
    }
    setShowModal(0);
  };

  // Check if camera is available
  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput"
        );
        if (!hasCamera) {
          setCameraAccess("notfound");
          setError((prev) => {
            return { ...prev, camera: "Camera not found!" };
          });
        }
      })
      .catch(() => {
        setCameraAccess("errorAccess");
        setError((prev) => {
          return { ...prev, camera: "Error Accessing Camera!" };
        });
        setCameraAccess(false);
      });
  }, []);

  const AttendanceTiming = ({ shift }) => {
    console.log(shift);

    return shift?.startTime == "WO" ? (
      <span className="bg-green-200 px-2 p-1 text-green-900  rounded-md">
        {" "}
        Week off
      </span>
    ) : (
      <span className="bg-blue-100  font-medium px-2 p-1 rounded-md min-w-[8ch] items-center text-center h-fit maxsm:text-sm">
        {shift?.name} : {moment(shift?.startTime, "HH:mm").format("h:mm A")}{" "}
        {"  "}
        {moment(shift?.endTime, "HH:mm").format("h:mm A")}
      </span>
    );
  };

  useEffect(() => {
    setHasError(Object?.values(error)?.length > 0);
  }, [error]);

  useEffect(() => {
    requestCameraAccess();
    requestLocationAccess();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Modal
      heading={showModal === 1 ? "Check In" : "Check Out"}
      size={"sm"}
      onClose={handleClose}
      contentCss="px-4 maxsm:px-2 max-h-[90vh] overflow-y-auto scrolls"
    >
      <div className="flex flex-col gap-2 ">
        <div className="w-full flex justify-between text-sm text-blue-800 maxsm:text-sm">
          <span className="bg-blue-100  font-medium px-2 p-1 rounded-md min-w-[8ch] items-center text-center h-fit maxsm:text-sm">
            {time}
          </span>
          <AttendanceTiming shift={DashboardData?.currentDay?.shift} />
        </div>
        <div
          className={`w-[300px] self-center aspect-square bg-gray-800 rounded-md flex items-center justify-center overflow-hidden border-2 ${
            error?.camera ? `border-red-500` : `border-gray-500`
          }`}
        >
          {cameraAccess == "granted" && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <div
              className={`flex items-center justify-center flex-col gap-2 text-center text-gray-100`}
            >
              <FiCameraOff className="w-10 h-10" />
              <span>
                {cameraAccess == null ? "Accessing camera" : error?.camera}

                {cameraAccess == null || (
                  <span
                    className="underline cursor-pointer ml-1"
                    onClick={requestCameraAccess}
                  >
                    click here
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div
          className={`w-full h-[50%] bg-gray-200 maxsm:h-full p-2 rounded-md  ${
            locationAccess == "denied" && " border-2 border-red-400"
          }`}
        >
          <span>
            <b>Location:</b>{" "}
            {locationAccess == "granted" ? (
              <span className="text-gray-900 text-sm font-regular">
                {attendanceData?.location?.address}
              </span>
            ) : (
              <>
                {locationAccess == null ? "Fetching location" : error?.location}
                {locationAccess == null || (
                  <span
                    className="underline cursor-pointer ml-1"
                    onClick={requestLocationAccess}
                  >
                    click here
                  </span>
                )}
              </>
            )}
          </span>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className="w-[50%] bg-red-800 rounded-md p-2 text-red-100"
            onClick={handleClose}
          >
            Cancel
          </button>
          {showModal == 1 ? (
            <button
              className={`w-[50%] bg-blue-800 rounded-md p-2 text-blue-50 flex items-center gap-2 justify-center ${
                (hasError || punching) && `bg-blue-400 `
              }`}
              onClick={handleAddAttendence}
              disabled={hasError || punching}
            >
              {punching ? `Checking in...` : `Check in`}
              <CgLogIn className="w-4 h-4" />
            </button>
          ) : (
            <button
              className={`w-[50%] bg-orange-800 rounded-md p-2 text-orange-50 flex items-center gap-2 justify-center ${
                (hasError || punching) && `bg-orange-400 `
              }`}
              onClick={handleAddAttendence}
              disabled={hasError || punching}
            >
              {punching ? `Checking out...` : `Check out`}
              <CgLogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceModal;
