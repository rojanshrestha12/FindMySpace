require("dotenv").config();
const express = require("express");
const routes = require("./internals/routes");
const cors = require("cors");
// const passport = require("./internals/auth");
// const cookieSession = require("cookie-session");
// const passportStrategy = require("./internals/passport");


const app = express();
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));