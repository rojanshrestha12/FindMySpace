import Property from '../models/Property.js';
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
        // Get the property based on propertyId
        const property = await Property.findOne({
            where: { property_id: propertyId },
        });

        // If property not found
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Get the user details based on the user_id in the property
        const userDetails = await getUserDetails({ params: { userId: property.user_id } }, res);

        if (userDetails.error) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            property,
            userDetails: userDetails.body,  // Assuming userDetails returns the body in the response
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
