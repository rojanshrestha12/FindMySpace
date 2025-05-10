import express from "express";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import User from "../models/Users.js";
import Property from "../models/Property.js";
import Request from "../models/Requests.js";
import Agreement from "../models/Agreement.js";
import { log } from "console";

const agreementRouter = express.Router();
agreementRouter.post("/agreement_save", async (req, res) => {
  try {
    const { movingDate, dueDate, permanentAddress, tenantId, requestId } = req.body;

    // Validate the required fields
    if (!movingDate || !dueDate || !permanentAddress || !tenantId || !requestId) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Find the request using the requestId from the database (assuming you're using a Request model)
    const request = await Request.findOne({ where: { request_id: requestId } });

    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    // Create a new agreement record in the Agreement model
    const newAgreement = await Agreement.create({
      movingDate,
      dueDate,
      permanentAddress,
      tenantId,  // assuming tenantId is part of Agreement model
      request_id: requestId,  // Save the associated request ID
    });

    // Respond with the newly created agreement
    res.status(201).json(newAgreement);
  } catch (error) {
    console.error('Error saving agreement:', error);
    res.status(500).json({ error: 'Failed to save agreement.' });
  }
});


agreementRouter.post("/agreement", async (req, res) => {
  const pdfPath = `./agreement_${Date.now()}.pdf`;

  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required." });
    }

    const request = await Request.findOne({ where: { request_id: requestId } });
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    const tenant = await User.findByPk(request.tenant_id);
    const property = await Property.findByPk(request.property_id);
    const landlord = await User.findByPk(request.landlord_id);
    const agreement = await Agreement.findOne({ where: { request_id: requestId } });

    if (!tenant || !property || !landlord || !agreement) {
      return res.status(404).json({ error: "Invalid related data for agreement." });
    }

    const { movingDate, dueDate, permanentAddress } = agreement;
    const rentAmount = property.price;
    const today = new Date().toLocaleDateString();

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(16).text("Flat Rental Agreement", { align: "center" }).moveDown(1.5);
    doc.fontSize(12);

    doc.text(`This Rental Agreement is made on ${today} between:`).moveDown();

    doc.text(`Landlord Name: ${landlord.fullname}`);
    doc.text(`Address: ${landlord.location || "_____________________________"}`);
    doc.text(`Phone Number: ${landlord.phone_number || "________________"}`).moveDown();

    doc.text(`Tenant Name: ${tenant.fullname}`);
    doc.text(`Permanent Address: ${permanentAddress || "_____________________________"}`);
    doc.text(`Phone Number: ${tenant.phone_number || "________________"}`).moveDown();

    doc.text("1. Property Details");
    doc.text(`The Landlord agrees to rent out the ${property.type} located at ${property.location}.`).moveDown();

    doc.text("2. Term of Tenancy");
    doc.text(`The tenancy shall commence on ${movingDate} and shall continue on a month-to-month basis unless otherwise terminated.`).moveDown();

    doc.text("3. Rent and Payment");
    doc.text(`The Tenant agrees to pay a monthly rent of NPR ${rentAmount}.`);
    doc.text(`Rent is due on the ${dueDate} of each month.`);

    doc.text("4. Security Deposit");
    doc.text("A security deposit amounting to one month's rent shall be paid by the tenant. This will be refunded upon termination of the agreement after deducting any damage charges, if applicable.").moveDown();

    doc.text("5. Utilities and Bills");
    doc.text("The Tenant shall be responsible for payment of electricity, water, internet, and other utility bills unless agreed otherwise.").moveDown();

    doc.text("6. Maintenance and Repairs");
    doc.text("Tenant shall maintain the premises in good condition. Damages beyond normal wear and tear shall be repaired at the Tenant’s cost.").moveDown();

    doc.text("7. Use of Property");
    doc.text(`The ${property.type} shall only be used for residential purposes and must not be used for any illegal or commercial activities.`).moveDown();

    doc.text("8. Alterations");
    doc.text("Tenant shall not make any structural alterations or install fixtures without prior written consent from the Landlord.").moveDown();

    doc.text("9. Visitors and Subletting");
    doc.text("Tenant may not sublet the premises. Visitors are allowed but must not cause disturbance or damage to the property.").moveDown();

    doc.text("10. Entry and Inspection");
    doc.text("The Landlord may enter the premises for inspection or maintenance with at least 24 hours’ notice to the Tenant.").moveDown();

    doc.text("12. Termination");
    doc.text("Either party may terminate this agreement by giving a 30-day written notice. On termination, the Tenant shall vacate the property and hand over the keys.").moveDown();

    doc.text("13. Legal Jurisdiction");
    doc.text("This agreement shall be governed under the laws of Nepal. Any disputes shall be subject to the local jurisdiction.").moveDown();

    doc.end();

    stream.on("finish", async () => {
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
          from: '"FindMyStay Rentals" <findmyspacenepal@gmail.com>',
          to: [tenant.email, landlord.email],
          subject: "Rental Agreement Confirmation",
          text: `Dear ${tenant.fullname},\n\nAttached is your rental agreement.\n\nRegards,\nFindMyStay Team`,
          attachments: [
            {
              filename: "Rental_Agreement.pdf",
              path: pdfPath,
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        fs.unlinkSync(pdfPath); // Cleanup

        res.status(200).json({ message: "Agreement created and emails sent!" });
      } catch (mailError) {
        console.error("Error sending email:", mailError);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        res.status(500).json({ error: "Failed to send agreement via email." });
      }
    });
  } catch (error) {
    console.error("Error creating rental agreement:", error);
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default agreementRouter;
