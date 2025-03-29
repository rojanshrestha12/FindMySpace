require("dotenv").config();
const express = require("express");
const userRoutes = require("./internals/routes/userRoute");
const propertyRoutes = require("./internals/routes/propertyRoutes");
const authRoutes = require("./internals/routes/authRoutes");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));

app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes);
app.use("/api", propertyRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));