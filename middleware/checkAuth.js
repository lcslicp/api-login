const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userData = decoded;
        next();
    } catch(error){
        return res.status(401).json({
            message: 'Invalid.'
        });
    }
};

module.exports = {
    checkAuth:checkAuth
};