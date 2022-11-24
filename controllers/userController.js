const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');

const models = require('../models');

dotenv.config();
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

    if (user && !duplicate) {
        return res.status(201).json({
            message: 'Account created successfully!'
        });
    }
    return res.status(500).json({
        message: 'Failed to create account. Please try again.'
    });
    
};

const logIn = async (req, res) => {

    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({
        message: 'All fields are required.'
    });

    const foundUser = await models.User.findOne({where: { username: username }});
    if(!foundUser) return res.status(401).json({
        message: 'Invalid credentials.'
    });

    const matchPass = await bcrypt.compare(password, foundUser.password);
    if(matchPass){
        const token = jwt.sign({
            username: foundUser.username,
            userId: foundUser.id
        }, '' + process.env.ACCESS_TOKEN_SECRET
        )

        res.status(200).json({
            message: 'Login successful!',
            token: token
        });
    }
    res.status(401).json({
        message: 'Invalid credentials.'
    });
}

const updateUser = async (req, res) => {
    const id = req.params.id;

    const { firstName,
        lastName,
        address,
        postCode,
        contactNumber,
        email,
        username,
        password } = req.body;

    const userUpdated = await models.User.update({
        firstName,
        lastName,
        address,
        postCode,
        contactNumber,
        email,
        username,
        password
    }, 
    {
        where: { id: id },
    });

    if(userUpdated) return res.status(200).json({
        message: 'User updated successfully!'
    })
    res.status(400).json({
        message: 'Failed to update user, please try again.'
    });
}

const deleteUser = async (req, res) => {
    const id = req.params.id;

    const userDeleted = await models.User.destroy({
        where: { id: id }
    });

    if(userDeleted) return res.status(204).json({
        message: 'Account deleted successfully!'
    })
    res.status(400).json({
        message: 'Failed to delete account.'
    });
}

const getAllUsers = async (req, res) => {
    
    await models.User.findAll().then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong.'
        })
    });
};

const deleteAllUsers = async (req, res) => {

    const usersDeleted = await models.User.destroy({
        where: {}
    });

    if(usersDeleted) return res.status(204).json({
        message: 'All accounts deleted successfully!'
    })
    res.status(400).json({
        message: 'Something went wrong.'
    });
}

// When removing multiply users with specific attributes
// In this samplecase, users with NYC address
const removeNYCUsers = async (req, res) => {

    const usersInNYC = await models.User.findAll({
        where: { address: 'NYC' },
    });

    if(usersInNYC){ 
        await usersInNYC.destroy();
        }
    return res.status(400).json({
        message: 'Something went wrong.'
    });
}


module.exports = {
    signUp: signUp,
    logIn: logIn,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getAllUsers: getAllUsers,
    getAllUsers: getAllUsers,
    deleteAllUsers: deleteAllUsers,
    removeNYCUsers, removeNYCUsers
};