// Import models and user controller
import Property from '../models/Property.js';
import User from '../models/Users.js';
import { getUserDetails } from './userController.js';

// Create a new property
export async function createProperty(req, res) {
    const { amenities, type, price, location, description } = req.body;
    const user_id = req.user.userId;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    // Check required fields
    if (!user_id || !type || !price || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Save property to database
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

// Get all properties
export async function getAllProperties(req, res) {
  try {
    // Fetch properties ordered by the creation date in descending order (most recent first)
    const properties = await Property.findAll({
      order: [['createdAt', 'DESC']],  // Assuming 'createdAt' is the column storing the creation timestamp
    });

    // If no properties found
    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    res.status(200).json(properties);  // Return all properties in LIFO order
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get single property details
export async function getPropertyDetails(req, res) {
    const propertyId = req.params.propertyId;

    try {
        // Find property by ID
        const property = await Property.findOne({
            where: { property_id: propertyId },
        });
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Get user info for this property
        const user = property.user_id;
        const userDetails = await User.findOne({
            where: { user_id : user},
        })
        
        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }

        res.status(200).json({
            property,
            userDetails, // Assumes userDetails returns user data in body
        });
    } catch (error) {
        console.error('Error fetching property details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// To handle file paths
export async function editProperty(req, res) {
    const propertyId = req.params.propertyId;
    const { amenities, type, price, location, description } = req.body;

    // If there are image uploads, process them
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
        // Find property by ID
        const property = await Property.findOne({
            where: { property_id: propertyId },
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if required fields are provided
        if (!type || !price || !location) {
            return res.status(400).json({ error: 'Type, price, and location are required' });
        }

        // Handle amenities: Parse if it's a string, otherwise use as-is if it's an object
        let updatedAmenities = property.amenities;
        if (amenities) {
            try {
                updatedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
            } catch (err) {
                return res.status(400).json({ error: 'Invalid amenities format' });
            }
        }

        // Handle images: Keep existing images if no new uploads
        const updatedImages = imagePaths.length > 0 ? imagePaths : property.images;

        // Update property details
        await Property.update(
            {
                amenities: updatedAmenities,
                type,
                price,
                location,
                description,
                images: updatedImages,
            },
            { where: { property_id: propertyId } }
        );

        res.status(200).json({ message: 'Property updated successfully' });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export async function deleteProperty(req, res) {
    const propertyId = req.body.property_id || req.params.propertyId;

    try {
        const property = await Property.findOne({ where: { property_id: propertyId } });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        await Property.destroy({ where: { property_id: propertyId } });

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
