const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. POST /auth/register
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Cek email duplikat
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: {
          pesan: 'Email sudah terdaftar',
          kode: 'EMAIL_DUPLIKAT',
        },
      });
    }

    // Hash password dengan cost 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Simpan ke DB dan hanya select id & email (jangan kirim passwordHash!)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

// 2. POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Pesan gagal login HARUS sama persis untuk email tidak ada & password salah
    if (!user) {
      return res.status(401).json({
        error: {
          pesan: 'Email atau password salah',
          kode: 'LOGIN_GAGAL',
        },
      });
    }

    // Wajib pakai await pada bcrypt.compare!
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          pesan: 'Email atau password salah',
          kode: 'LOGIN_GAGAL',
        },
      });
    }

    // Buat JWT berisi { id } dan expiresIn: '2h'
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

// 3. GET /auth/saya (Wajib Login)
const getSaya = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: {
          pesan: 'User tidak ditemukan',
          kode: 'USER_TIDAK_DITEMUKAN',
        },
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getSaya };