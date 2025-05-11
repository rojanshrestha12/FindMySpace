// routes/paymentRoutes.js
import express from 'express';
import Payment from '../models/Payment.js';
import Request from '../models/Requests.js'; // Assuming you have a Request model
import User from '../models/Users.js'; // Assuming you have a User model
 // Assuming you have a Payment model
const paymentRouter = express.Router();


async function migrateAcceptedRentRequestsToPayments() {
  try {
    const requests = await Request.findAll({
      where: {
        status: 'ACCEPTED',
        request_type: 'rent',
      },
      attributes: ['request_id', 'landlord_id', 'tenant_id'],
    });

    const paymentRecords = requests.map(req => ({
      request_id: req.request_id,
      landlord_id: req.landlord_id,
      tenant_id: req.tenant_id,
    }));

    await Payment.bulkCreate(paymentRecords, {
      ignoreDuplicates: true,
    });

    console.log(`${paymentRecords.length} payment records inserted.`);
  } catch (err) {
    console.error('Error migrating requests to payment DB:', err);
  }
}

migrateAcceptedRentRequestsToPayments();

// GET /api/payments/history/:landlord_id
paymentRouter.get('/history/:landlord_id', async (req, res) => {
  try {
    const { landlord_id } = req.params;
    console.log(`Fetching payment history for landlord_id: ${landlord_id}`);
    

    const payments = await Payment.findAll({
      where: { landlord_id },
      order: [['createdAt', 'DESC']],
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default paymentRouter;
