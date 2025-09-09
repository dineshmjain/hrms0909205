import { Input, Typography } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { EmployeeUpdatePasswordAction } from '../../redux/Action/Employee/EmployeeAction';
import axiosInstance from '../../config/axiosInstance';
const Profile = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user, "User from Profile");
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
    const imagePath = user?.profileImage ? (user?.profileImage.startsWith("/") ? user?.profileImage : `/${user?.profileImage}`) : ""; // Ensure the path starts with /
    setProfileImage(baseURL + imagePath);
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log(file, "recived");
    if (!file) {
      console.error("No file provided");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("self", true);

      const response = await axiosInstance.post(
        "user/upload/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response.data?.data?.imagePath);
      const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
      const imagePath = response.data?.data?.imagePath.startsWith("/") ? response.data?.data?.imagePath : `/${response.data?.data?.imagePath}`; // Ensure the path starts with /
      setProfileImage(baseURL + imagePath);
    } catch (error) {
      console.error(
        "Image upload failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    } else {
      const payload = {
        password: password,
      }
      dispatch(EmployeeUpdatePasswordAction(payload))
        .then(() => {
          setPassword('');
          setConfirmPassword('');
        })
        .catch((err) => console.log("Assignment failed"));
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center">
          <div className="relative group">
            <img
              src={profileImage}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            <label
              htmlFor="file-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 
              text-white text-sm opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer"
            >Change</label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {user?.name?.firstName} {user?.name?.lastName}
          </h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-gray-500 text-sm">{user?.mobile}</p>

          <div className="w-full mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Details</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">👤</span> Role:
                <span className="font-medium text-gray-800">{user.roleName}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">📅</span> Joined:
                <span className="font-medium text-gray-800">{user.joinDate}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
              focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 
              focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handlePasswordChange}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 active:scale-95 
              text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-transform duration-200"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};
export default Profile;