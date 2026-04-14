const express = require('express');
const {
  bakiyeGoruntule,
  ogrenciyeParaVer,
  ogrencileriListele
} = require('../controllers/kulupController');
const { authMiddleware, kulupMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(kulupMiddleware);

router.get('/bakiye', bakiyeGoruntule);
router.post('/para-ver', ogrenciyeParaVer);
router.get('/ogrenciler', ogrencileriListele);

module.exports = router;
