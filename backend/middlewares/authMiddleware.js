import { verify } from 'jsonwebtoken';
import admin from 'firebase-admin'; // Firebase Admin SDK (already initialized)
import { sign } from 'jsonwebtoken';
import User from '../models/Users.js'; // Sequelize User model

// Authentication middleware for verifying Firebase or JWT token
async function authenticate(req, res, next) {
    // Extract token from Authorization header
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Got: ", firebaseToken)

    try {
        // Attempt to verify token as a Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;
        const userEmail = decodedToken.email;

        console.log("userUID firebase email, ", firebaseUID, userEmail)

        // Find the user in your local database by email
        let user = await User.findOne({ where: { email: userEmail } });

        if (!user) {
            // If no user is found, respond with 404
            return res.status(404).json({ error: 'User not found in database' });
        }

        // Attach user info to request object for further use
        req.user = { userId: user.user_id, email: user.email };

        // Optionally generate a JWT token for internal use
        const jwtToken = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store JWT token in res.locals if needed later in the response cycle
        res.locals.jwtToken = jwtToken;

        // Proceed to the next middleware or route
        return next();
    } catch (error) {
        // If Firebase token verification fails, try verifying as a regular JWT
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            // No token at all
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            // Verify the JWT with your secret key
            const decoded = verify(token, process.env.JWT_SECRET);

            // Attach decoded payload to request
            req.user = decoded;

            // Proceed to next middleware or route
            return next();
        } catch (err) {
            // JWT is invalid or expired
            return res.status(401).json({ error: 'Invalid or expired JWT' });
        }
    }
}

export default authenticate;
