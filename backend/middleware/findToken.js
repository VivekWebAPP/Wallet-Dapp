import jwt from 'jsonwebtoken';

const findToken = async (req, res, next) => {
    try {
        const token = await req.header('Auth-Token' || 'auth-token');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const decodedToken = await jwt.decode(token);
        req.user = decodedToken.userId.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send('Internal Error Occurred');
    }
}

export default findToken;