import express from 'express';
const router = express.Router();

import User from '../models/Users.js';
import Property from '../models/Property.js';
import Request from '../models/Requests.js';

// Create a new request (visit or rent)
router.post('/request', async (req, res) => {
  try {
    const { tenant_id, property_id, message, request_type, date_time } = req.body;
    console.log(date_time);

    if (!["visit", "rent"].includes(request_type)) {
      return res.status(400).json({ error: "Invalid request type. Must be 'visit' or 'rent'." });
    }

    const property = await Property.findByPk(property_id);

    
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (tenant_id === property.user_id) {
      return res.status(400).json({ error: "You cannot request your own property" });
    }

    const tenant = await User.findByPk(tenant_id);
    const landlord = await User.findByPk(property.user_id);
    if (!tenant || !landlord) {
      return res.status(404).json({ error: "User(s) not found" });
    }

    // Dynamic message based on request_type
    const defaultMessage = `${tenant.fullname} has requested to ${request_type} the ${property.type} at ${property.location}.`;
    const dynamicMessage = message || defaultMessage;
    const newRequest = await Request.create({
      tenant_id,
      landlord_id: landlord.user_id,
      property_id,
      request_type,
      message: dynamicMessage,
      date_time, // ⬅️ save the date and time
    });
    return res.status(201).json({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all requests for a landlord 
router.get('/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await Request.findAll({
      where: {
        landlord_id: userId,
        status: 'PENDING',
      },
      include: [
        {
          model: User,
          as: 'tenant',
          attributes: ['fullname', 'user_id', 'phone_number', 'email'],
        },
        {
          model: Property,
          attributes: ['type', 'location', 'property_id'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const notifications = requests.map(r => {
      const date = new Date(r.date_time).toISOString().split('T')[0];
      const time = new Date(r.date_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        message: `${r.tenant.fullname} requested to ${r.request_type} your ${r.Property.type} at ${r.Property.location} on ${date} at ${time}.`,
        tenant_number: r.tenant.phone_number,
        tenant_email: r.tenant.email,
        requestId: r.request_id,
        createdAt: r.createdAt,
      };
    });

    res.status(200).json({ requests, notifications });
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    res.status(500).json({ error: 'Could not fetch requests/notifications' });
  }
});


// POST: Respond to a request (approve or reject)
router.post('/respond', async (req, res) => {
  const { requestId, response } = req.body;

  try {
    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Booking request not found' });
    }

    if (response === 'approved') {
      request.status = 'ACCEPTED';
    } else if (response === 'rejected') {
      request.status = 'REJECTED';
    } else {
      return res.status(400).json({ error: 'Invalid response type' });
    }

    await request.save();

    return res.status(200).json({ message: `Booking ${response}` });
  } catch (error) {
    console.error('Error responding to booking:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET: Response Messages for a Tenant (based on request status)
router.get('/repondMes/:userId', async (req, res) => {
  try {
    const tenantId = parseInt(req.params.userId);

    if (isNaN(tenantId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const requests = await Request.findAll({
      where: { tenant_id: tenantId },
      include: [
        { model: User, as: 'landlord', attributes: ['fullname'] },
        { model: Property, attributes: ['location'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const notifications = requests.map(req => {
      let statusMsg = '';
      const action = req.request_type === 'rent' ? 'rent' : 'visit';
      const location = req.Property.location;
      const landlordName = req.landlord.fullname;

      switch (req.status) {
        case 'ACCEPTED':
          statusMsg = `✅ Your ${action} request for '${location}' to ${landlordName} was *approved*.`;
          break;
        case 'REJECTED':
          statusMsg = `❌ Your ${action} request for '${location}' to ${landlordName} was *rejected*.`;
          break;
        case 'PENDING':
        default:
          statusMsg = `⏳ Your ${action} request for '${location}' to ${landlordName} is still *pending*.`;
          break;
      }

      return {
        landlord_name: req.landlord.fullname,
        property_location: req.Property.location,
        request_type: req.request_type,
        landlord_email: req.landlord.email,
        landlord_number: req.landlord.phone_number, 
        request_id: req.request_id,
        message: statusMsg,
        status: req.status,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
      };
    });

    res.json({ notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/myproperties/:userId', async (req, res) => {
  const { userId } = req.params;

  const properties = await Property.findAll({
      where: { user_id: userId }
  });

  res.json(properties);
});

export default router;
