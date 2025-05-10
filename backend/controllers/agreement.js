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

    // Use findOne instead of findAll
    const request = await Request.findOne({ where: { request_id: requestId } });
    if (!request) {
      return res.status(404).json({ error: "Request not found." });
    }

    const tenant_id = request.tenant_id;
    const property_id = request.property_id;
    const landlord_id = request.landlord_id;

    const tenant = await User.findByPk(tenant_id);
    const property = await Property.findByPk(property_id);
    const landlord = await User.findByPk(landlord_id);
    const agreement = await Agreement.findOne({ where: { request_id: requestId } });

    if (!tenant || !property || !landlord || !agreement) {
      return res.status(404).json({ error: "Invalid related data for agreement." });
    }

    const { movingDate, dueDate, permanentAddress } = agreement;

    // Generate the PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const today = new Date().toLocaleDateString();
    const rent = property.price;

    doc.fontSize(16).text("Flat Rental Agreement", { align: "center" }).moveDown(1.5);
    doc.fontSize(12);

    doc.text(`This Rental Agreement is made on this ${today} between:`);
    doc.moveDown();

    doc.text(`Landlord Name: ${landlord.fullname}`);
    doc.text(`Address: ${landlord.location || "_____________________________"}`);
    doc.text(`Phone Number: ${landlord.phone_number || "________________"}`);
    doc.moveDown();

    doc.text(`Tenant Name: ${tenant.fullname}`);
    doc.text(`Permanent Address: ${permanentAddress || "_____________________________"}`);
    doc.text(`Phone Number: ${tenant.phone_number || "________________"}`);
    doc.moveDown();

    doc.text("1. Property Details");
    doc.text(`The Landlord agrees to rent out the ${property.type} located at:`);
    doc.text(`${property.location}`);
    doc.moveDown();

    doc.text("2. Term of Tenancy");
    doc.text(`The tenancy will begin on ${movingDate} and will continue.`);
    doc.moveDown();

    doc.text("3. Rent Details");
    doc.text(`Monthly Rent: NPR ${rent}`);
    doc.text(`Due Date: ${dueDate} of each month`);
    doc.text("Mode of Payment: [ ] Cash  [ ] Bank Transfer  [ ] Others");
    doc.moveDown();

    doc.text("6. Maintenance and Repairs");
    doc.text("The tenant shall keep the premises clean and in good condition. Any damage caused by the tenant must be repaired at the tenant's expense.");
    doc.moveDown();

    doc.text("7. Use of Premises");
    doc.text(`The ${property.type} shall be used for residential purposes only and not for any commercial or illegal activities.`);
    doc.moveDown();

    doc.text("8. Termination");
    doc.text("Either party must give at least 30 days written notice to terminate the tenancy. The tenant must vacate the premises and return the keys on or before the last day.");
    doc.end();

    // After PDF generation
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
        fs.unlinkSync(pdfPath); // delete PDF after sending

        res.status(200).json({ message: "Agreement created and emails sent!" });
      } catch (mailError) {
        console.error("Error sending email:", mailError);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        res.status(500).json({ error: "Failed to send agreement via email." });
      }
    });
  } catch (error) {
    console.error("Error creating rental agreement:", error);
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath); // cleanup on error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default agreementRouter;
