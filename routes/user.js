const express = require('express');
const userController = require('../controllers/userController');
const checkAuthMiddleware = require('../middleware/checkAuth');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.logIn);
router.patch('/:id', checkAuthMiddleware.checkAuth, userController.updateUser);
router.delete('/:id', checkAuthMiddleware.checkAuth, userController.deleteUser);

module.exports = router;