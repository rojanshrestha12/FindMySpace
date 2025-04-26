// routes/request.js
import express from 'express';
import Request from '../models/Requests.js';
import Property from '../models/Property.js';

const router = express.Router();

router.post('/request', async (req, res) => {
    try {
        const { tenant_id, property_id } = req.body;
        const property = await Property.findByPk(property_id);

        if (!property) return res.status(404).json({ error: 'Property not found' });

        if (tenant_id === property.user_id) {
            return res.status(400).json({ error: "You cannot request your own property" });
        }

        const newRequest = await Request.create({
            tenant_id,
            landlord_id: property.user_id,
            property_id,
        });

        res.status(201).json({ message: "Request created successfully", request: newRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/requests/incoming/:landlordId', async (req, res) => {
    try {
        const { landlordId } = req.params;
        const requests = await Request.findAll({
            where: { landlord_id: landlordId }
            // include: ['Tenant', 'Property']
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/requests/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await Request.update(
            { status },
            { where: { request_id: requestId } }
        );

        res.json({ message: `Request ${status.toLowerCase()}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/requests/my/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const requests = await Request.findAll({
            where: { tenant_id: tenantId },
            // include: ['Property']
        });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




export default router;