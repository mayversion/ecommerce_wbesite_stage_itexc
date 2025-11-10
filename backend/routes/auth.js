const express = require('express');
const { register, login, logout, forgotPassword, resetPassword, getMe, updateProfile, updatePassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;





