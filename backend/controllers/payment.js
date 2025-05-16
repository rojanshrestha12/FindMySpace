// routes/paymentRoutes.js
import express from 'express';
import Payment from '../models/Payment.js';
import Request from '../models/Requests.js'; // Assuming you have a Request model
import User from '../models/Users.js'; // Assuming you have a User model
import Agreement from '../models/Agreement.js'; // Assuming you have an Agreement model
// Assuming you have a Payment model
import db from '../db/config.js'; // Adjust the path to your DB config
import nodemailer from 'nodemailer';
const paymentRouter = express.Router();
import dotenv from 'dotenv';
dotenv.config();


async function migrateAcceptedRentRequestsToPayments() {
  try {
    // Step 1: Get all accepted rent requests
    const requests = await Request.findAll({
      where: {
        status: 'ACCEPTED',
        request_type: 'rent',
      },
      attributes: ['request_id', 'landlord_id', 'tenant_id'],
    });

    const requestIds = requests.map(r => r.request_id);

    // Step 2: Get existing request_ids from Payment table
    const existingPayments = await Payment.findAll({
      where: {
        request_id: requestIds,
      },
      attributes: ['request_id'],
    });

    const existingRequestIds = new Set(existingPayments.map(p => p.request_id.toString()));
    // Step 3: Filter out requests already in Payment
    const newRequests = requests.filter(req => !existingRequestIds.has(req.request_id.toString()));

    if (newRequests.length === 0) {
      console.log('No new payments to insert.');
      return;
    }

    // Step 4: Fetch agreements for the new request IDs
    const agreements = await Agreement.findAll({
      where: {
        request_id: newRequests.map(r => r.request_id),
      },
      attributes: ['request_id', 'movingDate'],
    });

    const agreementMap = {};
    agreements.forEach(ag => {
      agreementMap[ag.request_id.toString()] = ag.movingDate;
    });

    // Step 5: Create new payment records
    const paymentRecords = newRequests.map(req => ({
      request_id: req.request_id,
      landlord_id: req.landlord_id,
      tenant_id: req.tenant_id,
      movingDate: agreementMap[req.request_id.toString()] || null,
      status: 'pending',
    }));

    await Payment.bulkCreate(paymentRecords);

    console.log(`${paymentRecords.length} new payment records inserted.`);
  } catch (err) {
    console.error('Error migrating requests to payment DB:', err);
  }
}

migrateAcceptedRentRequestsToPayments();




// GET /api/payments/history/:landlord_id
// GET /api/payments/history/:landlord_id
paymentRouter.get('/history/:landlord_id', async (req, res) => {
  try {
    const { landlord_id } = req.params;

    const payments = await Payment.findAll({
      where: {
        landlord_id,
        status: 'pending'
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Request,
          as: 'request',
          include: [
            {
              model: User,
              as: 'tenant',
              attributes: ['fullname', 'email', 'phone_number'],
            },
            {
              model: User,
              as: 'landlord',
              attributes: ['fullname', 'email', 'phone_number'],
            },
 
          ],
        },
      ],
    });

    const result = payments.map(payment => ({
      payment_id: payment.payment_id,
      request_id: payment.request_id,
      createdAt: payment.createdAt,
      tenant: {
        fullname: payment.request?.tenant?.fullname,
        email: payment.request?.tenant?.email,
        phone_number: payment.request?.tenant?.phone_number,
      },
      landlord: {
        fullname: payment.request?.landlord?.fullname,
        email: payment.request?.landlord?.email,
        phone_number: payment.request?.landlord?.phone_number,
      },
      movingDate: payment?.movingDate || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

paymentRouter.get('/history/paid/:landlord_id', async (req, res) => {
  try {
    const { landlord_id } = req.params;

    const payments = await Payment.findAll({
      where: {
        landlord_id,
        status: 'paid'
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Request,
          as: 'request',
          include: [
            {
              model: User,
              as: 'tenant',
              attributes: ['fullname', 'email'],
            },
            {
              model: User,
              as: 'landlord',
              attributes: ['fullname', 'email'],
            },
            {
              model: Agreement,
              as: 'agreement',
              attributes: ['movingDate'],
            },
          ],
        },
      ],
    });

    const result = payments.map(payment => ({
      payment_id: payment.payment_id,
      request_id: payment.request_id,
      createdAt: payment.createdAt,
      tenant: {
        fullname: payment.request?.tenant?.fullname,
        email: payment.request?.tenant?.email,
        phone_number: payment.request?.tenant?.phone_number,
      },
      landlord: {
        fullname: payment.request?.landlord?.fullname,
        email: payment.request?.landlord?.email,
      },
      movingDate: payment.request?.agreement?.movingDate || null,
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


paymentRouter.put('/update-status', async (req, res) => {
  const { requestId, paymentId, newDate } = req.body;

  try {
    const payments = await Payment.findAll({
      where: {

        payment_id: paymentId,
      },
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await Promise.all(
      payments.map(payment => {
        payment.status = 'paid';
        return payment.save();
      })
    );

    res.status(200).json({ message: `Updated ${payments.length} payment(s) to paid with new moving date.` });
  } catch (err) {
    console.error('Error updating payment status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



paymentRouter.post('/update-history', async (req, res) => {
  const { requestId, newDate } = req.body;
  try {
    const payment = await Payment.findOne({ where: { request_id: requestId } });

    if (!payment) {
      return res.status(404).json({ message: 'Original payment not found' });
    }

    const newPayment = await Payment.create({
      request_id: requestId,
      landlord_id: payment.landlord_id,
      tenant_id: payment.tenant_id,
      status: 'pending',
      movingDate: newDate,
    });

    res.status(201).json({ message: 'New payment record created', newPayment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




paymentRouter.post('/notify-tenant', async (req, res) => {
  const {
    tenantmail,
    tenantName,
    landlordmail,
    landlordName,
    landlordPhone,
    dueDate // Expected in ISO format: "2025-05-10"
  } = req.body;

  if (!tenantmail || !tenantName || !landlordmail || !landlordName || !landlordPhone || !dueDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const due = new Date(dueDate);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rental Management" <${process.env.EMAIL_USER}>`,
      to: tenantmail,
      subject: '⏰ Move-In Overdue – Reminder from Your Landlord',
      text: `
Dear ${tenantName},

We noticed that your scheduled move-in date of ${due.toDateString()} has already passed.

This is a gentle reminder from your landlord, ${landlordName}, regarding the pending move-in. Please get in touch as soon as possible to update your status or coordinate next steps.

📞 Landlord Contact: ${landlordPhone}
📧 Email: ${landlordmail}

If you’ve already moved in or made arrangements, kindly disregard this message.

Thank you for your attention.

Warm regards,  
${landlordName}  
Rental Management Team
      `.trim()
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Tenant notified successfully' });

  } catch (err) {
    console.error('Error sending notification email:', err);
    res.status(500).json({ message: 'Failed to notify tenant' });
  }
});

export default paymentRouter;
