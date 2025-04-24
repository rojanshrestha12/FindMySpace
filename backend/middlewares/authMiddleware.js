import { verify } from 'jsonwebtoken';
import admin from 'firebase-admin'; // assuming firebase admin is initialized
import { sign } from 'jsonwebtoken';
import User from '../models/Users.js'; // adjust path if needed

async function authenticate(req, res, next) {
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Got: ", firebaseToken);

    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;
        const userEmail = decodedToken.email;

        console.log("userUID firebase email: ", firebaseUID, userEmail);
        let user = await User.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        req.user = { userId: user.user_id, email: user.email, user };

        const jwtToken = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.locals.jwtToken = jwtToken;
        return next();
    } catch (error) {
        
        const token = req.header('Authorization')?.replace('Bearer ', '') ;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const decoded = verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired JWT' });
        }
    }
}

export default authenticate;
