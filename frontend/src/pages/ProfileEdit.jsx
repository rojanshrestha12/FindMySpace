import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { getAuth } from "firebase/auth";

function Profile() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    location: "",
    gender: "",
    birth_date: "",
    about_me: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({ form: {}, password: {} });
  const [success, setSuccess] = useState({ profile: false, password: false });

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        if (!value.trim()) return "Name is required";
        if (/\d/.test(value)) return "Name should not contain numbers";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email is invalid";
        break;
      case "phone_number":
        if (!value) return "Phone number is required";
        if (!/^\d+$/.test(value)) return "Phone number should contain only numbers";
        if (value.length !== 10) return "Phone number must be 10 digits";
        break;
      case "location":
        if (!value.trim()) return "Location is required";
        break;
      case "gender":
        if (!value) return "Gender is required";
        break;
      case "birth_date": {
        const birthDateError = validateBirthDate(value);
        if (birthDateError) return birthDateError;
        break;
      }
      default:
        break;
    }
    return "";
  };

  const validateBirthDate = (dateString) => {
    if (!dateString) return "Birth date is required";
    const today = new Date();
    const birthDate = new Date(dateString);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 120);
    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(today.getFullYear() - 13);
    if (birthDate > today) return "Birth date cannot be in the future";
    if (birthDate < minAgeDate) return "Age cannot be more than 120 years";
    if (birthDate > maxAgeDate) return "You must be at least 13 years old";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      form: { ...prev.form, [name]: validateField(name, value) },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (name === "confirmPassword" && value !== passwordData.newPassword) {
      error = "Passwords do not match";
    } else if (name === "newPassword" && value.length < 6) {
      error = "New password must be at least 6 characters long";
    }

    setErrors((prev) => ({
      ...prev,
      password: { ...prev.password, [name]: error },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      newErrors[key] = validateField(key, value);
    }

    const hasErrors = Object.values(newErrors).some((err) => err);

    if (!hasErrors) {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("No authentication token available");

        await axios.post("http://localhost:5000/api/user/profile/update", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSuccess({ profile: true, password: false });
        setFormData({
          fullname: "",
          email: "",
          phone_number: "",
          location: "",
          gender: "",
          birth_date: "",
          about_me: "",
        });
        setErrors({ form: {}, password: {} });
      } catch (error) {
        console.error("Profile update error:", error);
        setErrors((prev) => ({
          ...prev,
          form: { ...prev.form, update: "Failed to update profile. Try again later." },
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        form: { ...prev.form, ...newErrors, update: "Please fix the errors before submitting." },
      }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        password: { ...prev.password, confirmPassword: "Passwords do not match" },
      }));
      return;
    }

    const hasErrors = Object.values(errors.password).some((err) => err);

    if (!hasErrors) {
      try {
        const auth = getAuth();
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("No authentication token available");

        await axios.post("http://localhost:5000/api/user/password/update", passwordData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSuccess({ profile: false, password: true });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setErrors({ form: {}, password: {} });
      } catch (error) {
        console.error("Password update error:", error);
        setErrors((prev) => ({
          ...prev,
          password: { ...prev.password, update: "Failed to update password. Try again later." },
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        password: { ...prev.password, update: "Please fix the errors before submitting." },
      }));
    }
  };

  const handleDeleteUser = async () => {
    if (typeof window !== "undefined") {
      const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!isConfirmed) return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("You must be signed in to delete your account");

      const token = await user.getIdToken(true);
      if (!token) throw new Error("Failed to get authentication token");

      const response = await axios.delete("http://localhost:5000/api/user/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && typeof window !== "undefined") {
        alert("Your account has been deleted successfully.");
        await auth.signOut();
        window.location.href = "/login";
      } else {
        alert("Failed to delete your account. Please try again later.");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      if (typeof window !== "undefined") {
        alert(error.message || "An error occurred while deleting your account. Please try again.");
      }
    }
  };
  
  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full max-w-[800px] mx-auto px-4 mt-4">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-4">
          ACCOUNT
        </h2>

        {/* Success Messages */}
        {success.profile && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded">
            Profile updated successfully!
          </div>
        )}
        {success.password && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded">
            Password changed successfully!
          </div>
        )}

        <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Profile</h3>

            <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded mt-4"
            onClick={handleDeleteUser}
          >
            Delete Account
          </button>
          </div>


          <div className="flex flex-col items-center mb-6">
            <img
              src="/assets/profile.png"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <h2 className="text-lg font-medium">Change Your Profile</h2>
          </div>

          <hr className="border-gray-300 mb-6" />

          <form onSubmit={handleSave}>
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-700">Contact Information</h3>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600">Name:</label>
                  <input
                    name="fullname"
                    type="text"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.fullname ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </div>
                {errors.form.fullname && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.fullname}</p>
                )}

                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600">Email:</label>
                  <input
                    name="email"
                    type="email"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.email ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                  {!errors.form.email && formData.email && (
                    <span className="text-green-600 text-xs">Verified</span>
                  )}
                </div>
                {errors.form.email && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.email}</p>
                )}

                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600">Phone:</label>
                  <input
                    name="phone_number"
                    type="tel"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.phone_number ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter phone no."
                  />
                </div>
                {errors.form.phone_number && (
                    <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.phone_number}</p>
                )}

                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600">Location:</label>
                  <input
                    name="location"
                    type="text"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.location ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                  />
                </div>
                {errors.form.location && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-700">Basic Information</h3>

              <div className="flex items-center gap-2">
                <label className="w-24 text-sm text-gray-600">Gender:</label>
                <select
                  name="gender"
                  className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                    errors.form.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              {errors.form.gender && (
                <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.gender}</p>
              )}

              <div className="flex items-center gap-2">
                <label className="w-24 text-sm text-gray-600">Birth Date:</label>
                <input
                  name="birth_date"
                  type="date"
                  className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                    errors.form.birth_date ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
              </div>
              {errors.form.birth_date && (
                <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.birth_date}</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700">About Me</h3>
              <textarea
                name="about_me"
                className="w-full p-2 border rounded bg-gray-50 text-sm h-16 mt-2 border-gray-300"
                placeholder="Brief description"
                value={formData.about_me}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-3 py-1 bg-orange-500 text-white rounded flex items-center gap-1 hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>

          <hr className="border-gray-300 my-6" />

          <form onSubmit={handlePasswordSubmit}>
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 text-lg mb-4">Update Password</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <input
                    name="oldPassword"
                    type="password"
                    className={`w-full p-2 border rounded bg-[#f0e6d6] text-sm ${
                      errors.password.oldPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.password.oldPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.oldPassword}</p>
                  )}
                </div>
                <div>
                  <input
                    name="newPassword"
                    type="password"
                    className={`w-full p-2 border rounded bg-[#f0e6d6] text-sm ${
                      errors.password.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.password.newPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.newPassword}</p>
                  )}
                </div>
                <div>
                  <input
                    name="confirmPassword"
                    type="password"
                    className={`w-full p-2 border rounded bg-[#f0e6d6] text-sm ${
                      errors.password.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  {errors.password.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.confirmPassword}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#e48f44] text-white rounded text-sm hover:bg-[#d87f34]"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;