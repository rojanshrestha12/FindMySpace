// controllers/adminController.js
import { Op } from 'sequelize';
import User from '../models/Users.js';
import Property from '../models/Property.js';

// Modify User
export const modifyUser = async (req, res) => {
  try {
    const { user_id, fullname, email, phone_number, location, gender, birth_date, about_me, role } = req.body;
    console.log(fullname);
    
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).send('User not found');
    console.log(user.fullname);
    user.fullname = "changing";
    await user.save();
    console.log(user.fullname);
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;
    if (location) user.location = location;
    if (gender) user.gender = gender;
    if (birth_date) user.birth_date = birth_date;
    if (about_me) user.about_me = about_me;
    if (role) user.role = role;

    await user.save();
    console.log(user.fullname);
    res.status(200).send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Modify Property
export const modifyProperty = async (req, res) => {
  try {
    const { property_id, amenities, type, price, location, description, images } = req.body;

    const property = await Property.findByPk(property_id);
    if (!property) return res.status(404).send('Property not found');

    if (amenities) property.amenities = amenities;
    if (type) property.type = type;
    if (price !== undefined) property.price = price;
    if (location) property.location = location;
    if (description) property.description = description;
    if (images) property.images = images;

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

// Search Users by Name
// import { Op } from 'sequelize';

export const searchUsers = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send('Name query is required');

    const users = await User.findAll({
      where: {
        fullname: {
          [Op.like]: `%${name}%`
        }
      },
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Search Properties by Location
export const searchProperties = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) return res.status(400).send('Location query is required');

    const properties = await Property.findAll({
      where: {
        location: {
          [Op.like]: `%${location}%`
        }
      }
    });

    res.status(200).json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
export const validateAdmin = async (req, res) => {
  console.log(req.user.role);
  res.status(200).json({ isAdmin: true });
};
