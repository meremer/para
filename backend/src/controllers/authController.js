const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const girisYap = async (req, res) => {
  try {
    const { kullanici_adi, sifre } = req.body;

    const kullanici = db.prepare('SELECT * FROM kullanicilar WHERE kullanici_adi = ?').get(kullanici_adi);

    if (!kullanici) {
      return res.status(401).json({ hata: 'Kullanıcı adı veya şifre hatalı' });
    }

    const sifreDogrumu = await bcrypt.compare(sifre, kullanici.sifre);

    if (!sifreDogrumu) {
      return res.status(401).json({ hata: 'Kullanıcı adı veya şifre hatalı' });
    }

    const token = jwt.sign(
      {
        id: kullanici.id,
        kullanici_adi: kullanici.kullanici_adi,
        tip: kullanici.tip,
        kulup_id: kullanici.kulup_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      kullanici: {
        id: kullanici.id,
        kullanici_adi: kullanici.kullanici_adi,
        tip: kullanici.tip,
        kulup_id: kullanici.kulup_id
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ hata: 'Sunucu hatası' });
  }
};

module.exports = { girisYap };
