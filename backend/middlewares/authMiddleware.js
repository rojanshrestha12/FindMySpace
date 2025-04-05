import { verify } from 'jsonwebtoken';
import admin from 'firebase-admin'; // assuming firebase admin is initialized
import { sign } from 'jsonwebtoken';
import User from '../models/Users.js'; // adjust path if needed

async function authenticate(req, res, next) {
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Got: ", firebaseToken)
    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;  // Firebase UID
        const userEmail = decodedToken.email;

        console.log("userUID firebase email, ", firebaseUID, userEmail)
        let user = await User.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        req.user = { userId: user.user_id, email: user.email };

        const jwtToken = sign(
            { userId: user.user_id },  // Your own user_id from the database
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.locals.jwtToken = jwtToken;  // Optionally store JWT token in locals
        return next();  // Continue to next middleware
    } catch (error) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            // Regular JWT verification
            const decoded = verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            // Continue to the next middleware/route
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired JWT' });
        }
    }
}

export default authenticate;