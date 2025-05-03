// routes/booking.js
import express from 'express';
const router = express.Router();

import User from '../models/Users.js';        // ✅ Make sure this is correct
import Property from '../models/Property.js';
import Request from '../models/Requests.js';

// Your POST handler
router.post('/request', async (req, res) => {
  try {
    const { tenant_id, property_id, message } = req.body;

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

    const dynamicMessage = message || `${tenant.fullname} has requested to visit the ${property.type} at ${property.location}.`;

    const newRequest = await Request.create({
      tenant_id,
      landlord_id: landlord.user_id,
      property_id,
      message: dynamicMessage,
    });

    return res.status(201).json({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


// GET /api/booking/requests/:userId
// router.get('/requests/:userId', async (req, res) => {
//     try {
//       const { userId } = req.params;
  
//       const requests = await Request.findAll({
//         where: { landlord_id: userId },
//         include: [
//           {
//             model: User,
//             as: 'tenant',
//             attributes: ['fullname', 'user_id'],
//           },
//           {
//             model: Property,
//             attributes: ['type', 'location', 'property_id'],
//           },
//         ],
//         order: [['createdAt', 'DESC']],
//       });
  

  
//       const notifications = requests
//         .filter(r => r.message)
//         .map(r => ({
//           message: r.message,
//           requestId: r.request_id, // ✅ Corrected from r.id
//           createdAt: r.createdAt,
//         }));
  
//       res.status(200).json({
//         requests,
//         notifications,
//       });
  
//     } catch (error) {
//       console.error('❌ Error fetching requests/notifications:', error);
//       res.status(500).json({ error: 'Could not fetch requests/notifications' });
//     }
//   });

  router.get('/requests/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const requests = await Request.findAll({
        where: {
          landlord_id: userId,
          status: ['PENDING'] // ✅ Only fetch accepted or rejected
        },
        include: [
          {
            model: User,
            as: 'tenant',
            attributes: ['fullname', 'user_id'],
          },
          {
            model: Property,
            attributes: ['type', 'location', 'property_id'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
  
      const notifications = requests
        .filter(r => r.message)
        .map(r => ({
          message: r.message,
          requestId: r.request_id,
          createdAt: r.createdAt,
        }));
  
      res.status(200).json({
        requests,
        notifications,
      });
  
    } catch (error) {
      console.error('❌ Error fetching requests/notifications:', error);
      res.status(500).json({ error: 'Could not fetch requests/notifications' });
    }
  });
  

  router.post('/respond', async (req, res) => {
    const { requestId, response } = req.body;
    console.log(requestId); // Log requestId to debug if necessary
  
    try {
      // Find the booking request by ID
      const request = await Request.findByPk(requestId);
  
      if (!request) {
        return res.status(404).json({ error: 'Booking request not found' });
      }
  
      // Update the request status based on the response
      if (response === 'approved') {
        request.status = 'ACCEPTED';
      } else if (response === 'rejected') {
        request.status = 'REJECTED';
      } else {
        return res.status(400).json({ error: 'Invalid response type' });
      }
  
      // Save the updated status in the database
      await request.save();
  
      // Send success message back to the frontend
      return res.status(200).json({ message: `Booking ${response}` });
    } catch (error) {
      console.error('Error responding to booking:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });


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
        switch (req.status) {
          case 'ACCEPTED':
            statusMsg = `✅ Your request for '${req.Property.location}' to ${req.landlord.fullname} has been *approved*.`;
            break;
          case 'REJECTED':
            statusMsg = `❌ Your request for '${req.Property.location}' to ${req.landlord.fullname} was *rejected*.`;
            break;
          case 'PENDING':
            statusMsg = `⏳ Your request for '${req.Property.location}' to ${req.landlord.fullname} is still *pending*.`;
            break;
        }
  
        return {
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
  
  



export default router;