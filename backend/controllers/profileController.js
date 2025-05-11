// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/Users";

// Update Profile
export const updateProfile = async (req, res) => {
  const { fullname, email, phone_number, location, gender, birth_date, about_me } = req.body;
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
    user.birth_date = birth_date;
    user.about_me = about_me;

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
    const userId = req.user?.userId;
  
    // Check if all fields are provided
    if (!oldPassword || !newPassword || !confirmPassword) {
      console.log("All password fields are required");
      return res.status(400).json({ error: "Old, new, and confirm passwords are required" });
    }
  
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (!isPasswordValid) {
        console.log("Old password is incorrect");
        return res.status(400).json({ error: "Old password is incorrect" });
      }
  
      if (newPassword !== confirmPassword) {
        console.log("New passwords do not match");
        return res.status(400).json({ error: "New passwords do not match" });
      }
  
      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      console.log("Password updated successfully for user:", userId);
      return res.status(200).json({ message: "Password updated successfully" });
  
    } catch (err) {
      console.error("Error updating password:", err);
      return res.status(500).json({ error: "Internal server error" });
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
  