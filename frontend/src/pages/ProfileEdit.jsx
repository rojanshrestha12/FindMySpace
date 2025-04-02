import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
    aboutMe: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({ 
    form: {}, 
    password: {} 
  });
  
  const [touched, setTouched] = useState({
    form: {},
    password: {}
  });

  const [success, setSuccess] = useState({ 
    profile: false, 
    password: false 
  });

  // Validate date of birth
  const validateBirthDate = (dateString) => {
    if (!dateString) return "Birth date is required";
    
    const today = new Date();
    const birthDate = new Date(dateString);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 120); // Max age 120 years
    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(today.getFullYear() - 13); // Min age 13 years

    if (birthDate > today) {
      return "Birth date cannot be in the future";
    }
    if (birthDate < minAgeDate) {
      return "Age cannot be more than 120 years";
    }
    if (birthDate > maxAgeDate) {
      return "You must be at least 13 years old";
    }
    return "";
  };

  // Real-time validation for form fields
  useEffect(() => {
    const newErrors = { ...errors.form };
    let hasChanges = false;

    // Name validation
    if (touched.form.name) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (/\d/.test(formData.name)) {
        newErrors.name = "Name should not contain numbers";
      } else {
        delete newErrors.name;
      }
      hasChanges = true;
    }

    // Email validation
    if (touched.form.email) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      } else {
        delete newErrors.email;
      }
      hasChanges = true;
    }

    // Phone validation
    if (touched.form.phone) {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d+$/.test(formData.phone)) {
        newErrors.phone = "Phone number should contain only numbers";
      } else if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be 10 digits";
      } else {
        delete newErrors.phone;
      }
      hasChanges = true;
    }

    // Address validation
    if (touched.form.address) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      } else {
        delete newErrors.address;
      }
      hasChanges = true;
    }

    // Gender validation
    if (touched.form.gender) {
      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      } else {
        delete newErrors.gender;
      }
      hasChanges = true;
    }

    // Birth date validation
    if (touched.form.birthDate) {
      const birthDateError = validateBirthDate(formData.birthDate);
      if (birthDateError) {
        newErrors.birthDate = birthDateError;
      } else {
        delete newErrors.birthDate;
      }
      hasChanges = true;
    }

    if (hasChanges) {
      setErrors(prev => ({ ...prev, form: newErrors }));
    }
  }, [formData, touched.form]);

  // Real-time validation for password fields
  useEffect(() => {
    const newErrors = { ...errors.password };
    let hasChanges = false;

    if (touched.password.oldPassword) {
      if (!passwordData.oldPassword.trim()) {
        newErrors.oldPassword = "Current password is required";
      } else {
        delete newErrors.oldPassword;
      }
      hasChanges = true;
    }

    if (touched.password.newPassword) {
      if (!passwordData.newPassword.trim()) {
        newErrors.newPassword = "New password is required";
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = "Must be at least 8 characters";
      } else {
        delete newErrors.newPassword;
      }
      hasChanges = true;
    }

    if (touched.password.confirmPassword) {
      if (!passwordData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      } else {
        delete newErrors.confirmPassword;
      }
      hasChanges = true;
    }

    if (hasChanges) {
      setErrors(prev => ({ ...prev, password: newErrors }));
    }
  }, [passwordData, touched.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched(prev => ({
      ...prev,
      form: { ...prev.form, [name]: true }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setTouched(prev => ({
      ...prev,
      password: { ...prev.password, [name]: true }
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name should not contain numbers";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number should contain only numbers";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    const birthDateError = validateBirthDate(formData.birthDate);
    if (birthDateError) {
      newErrors.birthDate = birthDateError;
    }

    setErrors(prev => ({ ...prev, form: newErrors }));
    setTouched(prev => ({
      ...prev,
      form: Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    }));
    
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    let newErrors = {};

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(prev => ({ ...prev, password: newErrors }));
    setTouched(prev => ({
      ...prev,
      password: {
        oldPassword: true,
        newPassword: true,
        confirmPassword: true
      }
    }));
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess({ profile: false, password: false });

    if (validateForm()) {
      setSuccess(prev => ({ ...prev, profile: true }));
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSuccess({ profile: false, password: false });

    if (validatePassword()) {
      setSuccess(prev => ({ ...prev, password: true }));
      setPasswordData({ 
        oldPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      });
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
                    name="name"
                    type="text"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </div>
                {errors.form.name && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.name}</p>
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
                    name="phone"
                    type="tel"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone no."
                  />
                </div>
                {errors.form.phone && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.phone}</p>
                )}

                <div className="flex items-center gap-2">
                  <label className="w-24 text-sm text-gray-600">Address:</label>
                  <input
                    name="address"
                    type="text"
                    className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                      errors.form.address ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </div>
                {errors.form.address && (
                  <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.address}</p>
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
                  name="birthDate"
                  type="date"
                  className={`flex-1 p-2 border rounded bg-gray-50 text-sm ${
                    errors.form.birthDate ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
              </div>
              {errors.form.birthDate && (
                <p className="text-red-500 text-xs ml-24 mt-1">{errors.form.birthDate}</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700">About Me</h3>
              <textarea
                name="aboutMe"
                className="w-full p-2 border rounded bg-gray-50 text-sm h-16 mt-2 border-gray-300"
                placeholder="Brief description"
                value={formData.aboutMe}
                onChange={handleInputChange}
              />
            </div>


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
            <div className="mt-6">
              <button
                type="submit"
                className="px-3 py-1 bg-orange-500 text-white rounded flex items-center gap-1 hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;