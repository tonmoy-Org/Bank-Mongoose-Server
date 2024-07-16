const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'Unauthorized access: No authorization header' });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'Unauthorized access: Invalid token' });
        }
        req.decoded = decoded;
        next();
    });
};

// Middleware to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
    try {
        const email = req.decoded.email;
        const query = { email: email };

        const user = await adminUsersCollection.findOne(query);

        if (!user || user.role !== 'admin') {
            return res.status(403).send({ error: true, message: 'Forbidden: Admins only' });
        }

        next();
    } catch (error) {
        console.error('Error in verifyAdmin middleware:', error);
        return res.status(500).send({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = { verifyJWT, verifyAdmin };
