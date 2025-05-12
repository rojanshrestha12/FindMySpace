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
    const requests = await Request.findAll({
      where: {
        status: 'ACCEPTED',
        request_type: 'rent',
      },
      attributes: ['request_id', 'landlord_id', 'tenant_id'],
    });

    const requestIds = requests.map(r => r.request_id);

    const agreements = await Agreement.findAll({
      where: {
        request_id: requestIds,
      },
      attributes: ['request_id', 'movingDate'],
    });

    const agreementMap = {};
    agreements.forEach(ag => {
      agreementMap[ag.request_id.toString()] = ag.movingDate;
    });

    const paymentRecords = requests.map(req => ({
      request_id: req.request_id,
      landlord_id: req.landlord_id,
      tenant_id: req.tenant_id,
      movingDate: agreementMap[req.request_id.toString()] || null,
      status: 'pending',
    }));
    await Payment.bulkCreate(paymentRecords, {
      updateOnDuplicate: ['movingDate', 'status'],
    });

    console.log(`${paymentRecords.length} payment records inserted.`);
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
    console.log(`Fetching payment history for landlord_id: ${landlord_id}`);

    const payments = await Payment.findAll({
      where: { landlord_id },
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

paymentRouter.put('/update-moving-date', async (req, res) => {
  const { requestId } = req.body;
  try {
    const payment = await Payment.findOne({ where: { request_id: requestId} });

    if (!payment || !payment.movingDate) {
      return res.status(404).json({ message: 'Payment or movingDate not found' });
    }

    const currentDate = new Date(payment.movingDate);
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + 30));

    payment.movingDate = newDate;
    await payment.save();

    res.status(200).json({ message: 'Moving date updated in payments table', movingDate: newDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



paymentRouter.put('/notify-tenant', async (req, res) => {
  const { tenantmail } = req.body;

  if (!tenantmail) {
    return res.status(400).json({ message: 'Tenant email is required' });
  }

  try {
    // Setup email transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    
    // Create transporter

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: tenantmail,
      subject: 'Upcoming Move-in Reminder',
      text: 'Hello, this is a reminder that your move-in date is approaching. Please be prepared!',
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Tenant notified successfully' });

  } catch (err) {
    console.error('Error sending notification email:', err);
    res.status(500).json({ message: 'Failed to notify tenant' });
  }
});

export default paymentRouter;
