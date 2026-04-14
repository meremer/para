const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ hata: 'Token bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.kullanici = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ hata: 'Geçersiz token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.kullanici.tip !== 'admin') {
    return res.status(403).json({ hata: 'Yetkiniz yok' });
  }
  next();
};

const kulupMiddleware = (req, res, next) => {
  if (req.kullanici.tip !== 'kulup') {
    return res.status(403).json({ hata: 'Yetkiniz yok' });
  }
  next();
};

const kantinciMiddleware = (req, res, next) => {
  if (req.kullanici.tip !== 'kantinci') {
    return res.status(403).json({ hata: 'Yetkiniz yok' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  kulupMiddleware,
  kantinciMiddleware
};
