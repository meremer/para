const express = require('express');
const { girisYap } = require('../controllers/authController');

const router = express.Router();

router.post('/giris', girisYap);

module.exports = router;
