// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/Users"; // Import the Sequelize model for User

// Update Profile
export const updateProfile = async (req, res) => {
  const { fullname, email, phone_number, location, gender, birthDate, aboutMe } = req.body;
  const userId = req.user.userId; // Changed from req.user.id to req.user.userId

  try {
    const user = await User.findByPk(userId); // Find user by primary key (ID)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile
    user.fullname = fullname;
    user.email = email;
    user.phone_number = phone_number;
    user.location = location;
    user.gender = gender;
    user.birthDate = birthDate;
    user.aboutMe = aboutMe;

    await user.save(); // Save changes to the database

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.userId;  // Ensure req.user is correctly populated
  
    try {
      const user = await User.findByPk(userId);  // Fetch user from DB
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // If the user is authenticated via Google (i.e., no password stored)
      if (!user.password) {
        // For Google-authenticated users, we don't need to verify the old password
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "New passwords do not match" });
        }
  
        // Hash and save the new password for Google-authenticated user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
  
        return res.status(200).json({ message: "Password updated successfully" });
      }
  
      // For regular email/password users, verify old password
      console.log("Entered old password:", oldPassword);  // Log the entered password
      console.log("Stored hashed password in DB:", user.password);  // Log the stored hashed password
  
      const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" });
      }
  
      // Optional: Add additional password validation (e.g., min length, complexity) here
  
      // Hash the new password and save it
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while updating password" });
    }
  };
  



export  const handleDeleteUser = async () => {
    // Show confirmation dialog to prevent accidental deletions
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
  
    if (!isConfirmed) {
      return; // If the user cancels the deletion, do nothing
    }
  
    try {
      // API call to delete the user using aioz.post or aioz.delete
      const response = await axios.delete('/api/user/delete');
  
      if (response.status === 200) {
        // Handle successful user deletion
        alert("Your account has been deleted successfully.");
        // Redirect to a different page, such as the login page
        window.location.href = "/login"; // Or use React Router's `history.push('/login')` if using React Router
      } else {
        // Handle error response
        alert("Failed to delete your account. Please try again later.");
      }
    } catch (error) {
      // Handle any network or API errors
      console.error(error);
      alert("An error occurred while deleting your account. Please try again.");
    }
  };
  