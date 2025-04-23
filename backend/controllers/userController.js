// Import the User model
import User from '../models/Users.js';

// Get user details by userId
export async function getUserDetails(req, res) {
    const userId = req.params.userId;

    try {
        // Find user by ID
        const user = await User.findOne({ where: { user_id: userId } });

        // If user not found, send 404
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send user data
        res.status(200).json(user);  
    } catch (error) {
        // Handle server error
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
