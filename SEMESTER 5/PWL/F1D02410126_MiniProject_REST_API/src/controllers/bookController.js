const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ambil semua daftar buku
const getAllBooks = async (req, res, next) => {
  try {
    const books = await prisma.book.findMany({
      include: { borrowings: true }
    });
    return res.status(200).json({
      status: 'success',
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Tambah buku baru
const createBook = async (req, res, next) => {
  try {
    const { title, author, year, price, stock, publishedDate } = req.body;
    
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        year: Number(year),
        price: Number(price),
        stock: Number(stock),
        publishedDate: new Date(publishedDate)
      }
    });

    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan.',
      data: newBook
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, createBook };