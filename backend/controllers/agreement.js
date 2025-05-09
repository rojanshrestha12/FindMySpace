import express from "express";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import User from "../models/Users.js";
import Property from "../models/Property.js";

const agreementRouter = express.Router();

agreementRouter.post("/", async (req, res) => {
  try {
    const { tenant_id, property_id, movingDate, permanentAddress} = req.body;
    const duration = 10; // Ensure duration is an integer
    const dueDate = 323232; // Ensure dueDate is an integer

    const tenant = await User.findByPk(tenant_id);
    const property = await Property.findByPk(property_id);
    const landlord = await User.findByPk(property?.user_id);

    if (!tenant || !property || !landlord) {
      return res.status(404).json({ error: "Invalid tenant, property, or landlord" });
    }

    const doc = new PDFDocument();
    const pdfPath = `./agreement_${Date.now()}.pdf`;
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
    doc.text(`Address: ${permanentAddress}`);
    doc.text(`Phone Number: ${tenant.phone_number || "________________"}`);
    doc.moveDown();

    doc.text("1. Property Details");
    doc.text(`The Landlord agrees to rent out the ${property.type} located at:`);
    doc.text(`${property.location}`);
    doc.moveDown();

    doc.text("2. Term of Tenancy");
    doc.text(`The tenancy will begin on ${movingDate} and will continue:`);
    doc.text(`For a fixed period of ${duration} months`);
    doc.moveDown();

    doc.text("3. Rent Details");
    doc.text(`Monthly Rent: NPR ${rent}`);
    doc.text(`Due Date: ${dueDate} of each month`);
    doc.text("Mode of Payment: [ ] Cash  [ ] Bank Transfer  [ ] Other: ___________");
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

    stream.on("finish", async () => {
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
      fs.unlinkSync(pdfPath);

      res.status(200).json({ message: "Agreement created and emails sent!" });
    });
  } catch (error) {
    console.error("Error creating rental agreement:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default agreementRouter;
