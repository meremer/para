const express = require('express');
const { cuzdanGoruntule } = require('../controllers/ogrenciController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/cuzdan', cuzdanGoruntule);

module.exports = router;
