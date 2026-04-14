const express = require('express');
const { odemeYap, ogrenciAra } = require('../controllers/kantinciController');
const { authMiddleware, kantinciMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(kantinciMiddleware);

router.post('/odeme', odemeYap);
router.get('/ogrenci-ara', ogrenciAra);

module.exports = router;
