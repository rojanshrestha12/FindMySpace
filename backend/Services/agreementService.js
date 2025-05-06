import express from 'express';
const router = express.Router();

import User from '../models/Users.js';
import Property from '../models/Property.js';

router.post('/', async (req, res) => {
    try {
        const { tenant_id, landlord_id, property_id, moveInDate, duration, message } = req.body;
        console.log(req.body);
        
    
        // Validate the input data
        if (!tenant_id || !landlord_id || !property_id || !moveInDate || !duration) {
        return res.status(400).json({ error: 'All fields hhhare required' });
        }
    
        // Check if the property exists
        const property = await Property.findByPk(property_id);
        if (!property) {
        return res.status(404).json({ error: 'Property not found' });
        }
    
        // Check if the users exist
        const tenant = await User.findByPk(tenant_id);
        const landlord = await User.findByPk(landlord_id);
        if (!tenant || !landlord) {
        return res.status(404).json({ error: 'User(s) not found' });
        }
    
        // Create the agreement (assuming you have an Agreement model set up)
        const newAgreement = await Agreement.create({
        tenant_id,
        landlord_id,
        property_id,
        moveInDate,
        duration,
        message,
        });
    
        return res.status(201).json({ message: 'Agreement created successfully', agreement: newAgreement });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;