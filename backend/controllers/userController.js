import User from '../models/Users.js';

export async function getUserDetails(req, res) {
    const userId = req.params.userId;

    try {
        const user = await User.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);  
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function findUserById(userId) {
    return await User.findOne({ where: { user_id: userId } });
}
