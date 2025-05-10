// routes/payments.js
import express from 'express';
import { Op } from 'sequelize';
import PaymentHistory from '../models/PaymentHistory.js';
import Agreement from '../models/Agreement.js';
import Request from '../models/Requests.js';
import User from '../models/Users.js';
import nodemailer from 'nodemailer';
import Property from '../models/Property.js';


const paymentRouter = express.Router();

// POST /payments/create
paymentRouter.post('/create', async (req, res) => {
  try {
    const { landlordId } = req.body;

    if (!landlordId) {
      console.log('❌ Missing landlordId');
      return res.status(400).json({ message: 'Missing landlordId' });
    }

    console.log('✅ landlordId received:', landlordId);

    // Step 1: Try to fetch agreement with Request and Property
    const agreement = await Agreement.findOne({
      include: {
        model: Request,
        where: { landlord_id: landlordId },
        include: {
          model: Property,
          attributes: ['price']
        }
      },
      order: [['id', 'DESC']],
    });

    if (!agreement) {
      console.log('❌ No agreement found for landlord:', landlordId);
      return res.status(404).json({ message: 'No agreement found for this landlord' });
    }

    console.log('✅ Agreement found:', agreement.id);
    console.log('📅 Moving Date:', agreement.movingDate);
    console.log('💰 Price from property:', agreement.Request?.Property?.price);

    const paymentDate = agreement.movingDate;
    const amount = agreement.Request?.Property?.price;

    if (!paymentDate || !amount) {
      console.log('❌ Missing required fields from agreement or property');
      return res.status(500).json({ message: 'Agreement or property data is incomplete' });
    }

    // Step 2: Create payment
    const newPayment = await PaymentHistory.create({
      agreement_id: agreement.id,
      payment_date: paymentDate,
      amount,
      remarks: 'Monthly Rent',
      status: 'PENDING',
    });

    console.log('✅ Payment created:', newPayment.id);

    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });

  } catch (error) {
    console.error('❌ Error in creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error });
  }
});






paymentRouter.get('/landlord/:landlordId/history', async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const now = new Date();

    const payments = await PaymentHistory.findAll({
      include: {
        model: Agreement,
        include: {
          model: Request,
          where: { landlord_id: req.params.landlordId },
        },
      },
    });

    const past = [];
    const present = [];
    const future = [];

    payments.forEach(payment => {
      const date = new Date(payment.payment_date);

      if (date < oneMonthAgo) {
        past.push(payment);
      } else if (date >= oneMonthAgo && date <= now) {
        present.push(payment);
      } else {
        future.push(payment);
      }
    });

    res.json({
      pastPayments: past,
      currentPayments: present,
      futurePayments: future,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categorized payments', error });
  }
});

// PUT /payments/:paymentId/mark-paid
paymentRouter.put('/:paymentId/mark-paid', async (req, res) => {
  try {
    const payment = await PaymentHistory.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'PAID';
    await payment.save();

    res.json({ message: 'Payment marked as PAID', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating payment', error: err });
  }
});


paymentRouter.post('/:paymentId/notify', async (req, res) => {
  try {
    const payment = await PaymentHistory.findByPk(req.params.paymentId, {
      include: {
        model: Agreement,
        include: {
          model: Request,
          include: [{ model: User, as: 'tenant' }],
        },
      },
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const tenantEmail = payment.Agreement.Request.tenant.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // ✔️ Store in .env
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: tenantEmail,
      subject: 'Rent Payment Reminder',
      text: `Hello ${payment.Agreement.Request.tenant.fullname},\n\nThis is a reminder to complete your pending rent payment.\n\nThank you.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Notification sent to tenant' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to notify tenant', error: err });
  }
});


export default paymentRouter;
