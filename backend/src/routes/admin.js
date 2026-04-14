const express = require('express');
const {
  kulupPuanGuncelle,
  kulupBilgiGuncelle,
  kulupParaVer,
  ogrenciOlustur,
  kulupleriListele
} = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/kulup/puan', kulupPuanGuncelle);
router.put('/kulup/bilgi', kulupBilgiGuncelle);
router.post('/kulup/para', kulupParaVer);
router.post('/ogrenci', ogrenciOlustur);
router.get('/kulupler', kulupleriListele);

module.exports = router;
