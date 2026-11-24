const jwt = require('jsonwebtoken');

const butuhLogin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Cek keberadaan header Authorization & format Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          pesan: 'Token autentikasi diperlukan',
          kode: 'TOKEN_DIPERLUKAN',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: {
          pesan: 'Token autentikasi diperlukan',
          kode: 'TOKEN_DIPERLUKAN',
        },
      });
    }

    // 2. Verifikasi token dengan jwt.verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Simpan id user ke request
    next();
  } catch (err) {
    // Jika token rusak, signature salah, atau expired
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          pesan: 'Token sudah kedaluwarsa',
          kode: 'TOKEN_KEDALUWARSA',
        },
      });
    }

    return res.status(401).json({
      error: {
        pesan: 'Token tidak valid',
        kode: 'TOKEN_TIDAK_VALID',
      },
    });
  }
};

module.exports = { butuhLogin };