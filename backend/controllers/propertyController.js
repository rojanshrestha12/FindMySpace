import Property from '../models/Property.js';
import User from '../models/Users.js';
import { getUserDetails } from './userController.js';

export async function createProperty(req, res) {
    const { amenities, type, price, location, description } = req.body;
    const user_id = req.user.userId;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    if (!user_id || !type || !price || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const property = await Property.create({
            user_id,
            amenities: amenities ? JSON.parse(amenities) : null,
            type,
            price,
            location,
            description,
            images: imagePaths,
        });

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getAllProperties(req, res) {
    try {
        const properties = await Property.findAll();

        if (properties.length === 0) {
            return res.status(404).json({ message: 'No properties found' });
        }

        res.status(200).json(properties);  // Return all properties
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getPropertyDetails(req, res) {
    const propertyId = req.params.propertyId;

    try {
        const property = await Property.findOne({
            where: { property_id: propertyId },
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
            
        const user = await User.findOne({
            where: { user_id: property.user_id },
            attributes: ['fullname', 'phone_number']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            property,
            userDetails: user,
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}