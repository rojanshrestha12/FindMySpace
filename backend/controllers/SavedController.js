import express from "express";

import SavedProperty  from "../models/SavedProperty.js";
import Property from "../models/Property.js"; // Assuming you have a Property model
const Savedrouter = express.Router();

SavedProperty.belongsTo(Property, { foreignKey: 'propertyId' });

// Save a property
Savedrouter.post("/save-property", async (req, res) => {
  const { userId, propertyId } = req.body;
  try {
    const exists = await SavedProperty.findOne({ where: { userId, propertyId } });
    if (exists) {
      return res.status(409).json({ message: "Property already saved." });
    }

    await SavedProperty.create({ userId, propertyId });
    res.status(201).json({ message: "Property saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save property.", error: error.message });
  }
});

// Unsave a property
Savedrouter.delete("/save-property", async (req, res) => {
  const { userId, propertyId } = req.body;

  try {
    const result = await SavedProperty.destroy({ where: { userId, propertyId } });
    if (result === 0) {
      return res.status(404).json({ message: "Saved property not found." });
    }

    res.status(200).json({ message: "Property unsaved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to unsave property.", error: error.message });
  }
});

Savedrouter.get("/saved-properties/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const savedProperties = await SavedProperty.findAll({
        where: { userId },
        include: [
          {
            model: Property,
          }
        ],
      });
  
      // Return only property data if desired
      const properties = savedProperties.map(sp => sp.Property);
  
      res.status(200).json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching saved properties", error: error.message });
    }
  });
  

export default Savedrouter;
