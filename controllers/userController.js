const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken'); 

const models = require('../models');


const signUp = async (req, res) => {

    const { firstName,
        lastName,
        address,
        postCode,
        contactNumber,
        email,
        username,
        password } = req.body;

    const duplicate = await models.User.findOne({ where: { username: username }});
    if (duplicate) return res.status(409).json({
        message: 'Account already exists! Please try again.'
    })

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await models.User.create({
        firstName,
        lastName,
        address,
        postCode,
        contactNumber,
        email,
        username,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            message: 'Account created successfully!'
        });
    }
    res.status(500).json({
        message: 'Failed to create account. Please try again.'
    });
    
};




module.exports = {
    signUp: signUp
};