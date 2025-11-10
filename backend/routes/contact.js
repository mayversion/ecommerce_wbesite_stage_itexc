const express = require('express');
const { submit } = require('../controllers/contact');

const router = express.Router();

router.post('/submit', submit);

module.exports = router;
