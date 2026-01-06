import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosApi from "../axiosApi";

const UserProfile = () => {
  const navigate = useNavigate();

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Real User Data State
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    number: "",
    role: "",
  });

  // Password Update State
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * 1. FETCH USER DATA ON LOAD
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosApi.get("/users/getUserProfile");
        setUserData(response.data.data);
      } catch (error) {
        // ONLY redirect if the error is 401 (Unauthorized)
        // This prevents redirection during temporary network glitches
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/signin");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  /**
   * 2. LOGOUT LOGIC
   */
  const handleLogout = async () => {
    toast.promise(axiosApi.post("/users/logout"), {
      loading: "Logging out...",
      success: () => {
        navigate("/signin");
        return <b>Logged out!</b>;
      },
      error: <b>Logout failed.</b>,
    });
  };

  /**
   * 3. UPDATE PROFILE (NAME/NUMBER)
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    toast.promise(
      axiosApi.patch("/users/update", {
        name: userData.name,
        number: userData.number,
      }),
      {
        loading: "Updating profile...",
        success: (res) => {
          setUserData(res.data.data); // Sync state with updated backend data
          setIsEditing(false);
          return <b>Profile updated successfully!</b>;
        },
        error: (err) => <b>{err.response?.data?.message || "Update failed"}</b>,
      }
    );
  };

  /**
   * 4. CHANGE PASSWORD
   */
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword.trim() !== passwordData.confirmPassword.trim()
    ) {
      return toast.error("Passwords do not match!", { icon: "⚠️" });
    }

    toast.promise(
      axiosApi.patch("/users/update", { password: passwordData.newPassword }),
      {
        loading: "Updating password...",
        success: () => {
          setIsChangingPassword(false);
          setPasswordData({ newPassword: "", confirmPassword: "" });
          return <b>Password updated!</b>;
        },
        error: (err) => <b>{err.response?.data?.message || "Change failed"}</b>,
      }
    );
  };

  /**
   * 5. DELETE ACCOUNT
   */
  const handleDeleteAccount = () => {
    toast(
      (t) => (
        <span className="flex flex-col gap-2">
          <b className="text-red-600">Delete account permanently?</b>
          <div className="flex gap-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axiosApi.delete("/users/delete");
                  toast.success("Account Deleted");
                  navigate("/signup");
                } catch (error) {
                  toast.error("Failed to delete account");
                }
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-200 px-3 py-1 rounded text-xs"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 5000 }
    );
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                  Role: {userData.role}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition font-medium"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      pattern="^[a-zA-Z\s\-']+$"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.number || ""}
                      name="number"
                      required
                      // pattern: Starts with 03, followed by 9 more digits
                      pattern="03[0-9]{9}"
                      maxLength="11"
                      title="Number must be 11 digits starting with 03 (e.g., 03001234567)"
                      onChange={(e) =>
                        setUserData({ ...userData, number: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    {userData.number || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Security</h3>
          </div>
          <div className="p-6">
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Change your password
              </button>
            ) : (
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-sm"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white shadow rounded-lg border border-red-100 overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <h3 className="text-lg font-medium text-red-800">Danger Zone</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Deleting your account is permanent and cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
