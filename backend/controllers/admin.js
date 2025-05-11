// controllers/adminController.js
import { Op } from 'sequelize';
import User from '../models/Users.js';
import Property from '../models/Property.js';

// Modify User
// Modify User
export const modifyUser = async (req, res) => {
  try {
    const {
      user_id,
      fullname,
      email,
      phone_number,
      location,
      gender,
      birth_date,
      about_me,
      role,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).send('User not found');

    // Only update fields if values are passed
    if (fullname !== undefined) user.fullname = fullname;
    if (email !== undefined) user.email = email;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (location !== undefined) user.location = location;
    if (gender !== undefined) user.gender = gender;
    if (birth_date !== undefined) user.birth_date = birth_date;
    if (about_me !== undefined) user.about_me = about_me;
    if (role !== undefined) user.role = role;

    await user.save();
    res.status(200).send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


// Modify Property
// Modify Property
export const modifyProperty = async (req, res) => {
  try {
    const {
      property_id,
      amenities,
      type,
      price,
      location,
      description,
      images,
    } = req.body;

    const property = await Property.findByPk(property_id);
    if (!property) return res.status(404).send('Property not found');
    // Update only if values are provided
    if (amenities !== undefined) property.amenities = amenities;
    if (type !== undefined) property.type = type;
    if (price !== undefined) property.price = price;
    if (location !== undefined) property.location = location;
    if (description !== undefined) property.description = description;
    if (images !== undefined) property.images = images;

    await property.save();
    res.status(200).send('Property updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).send('User not found');

    await user.destroy();
    res.status(200).send('User deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete Property
export const deleteProperty = async (req, res) => {
  try {
    const { property_id } = req.params;

    const property = await Property.findByPk(property_id);
    if (!property) return res.status(404).send('Property not found');

    await property.destroy();
    res.status(200).send('Property deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
