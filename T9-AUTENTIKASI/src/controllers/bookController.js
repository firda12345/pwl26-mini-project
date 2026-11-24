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

    const data = {
      title,
      author,
      stock: stock !== undefined && stock !== null && stock !== '' ? Number(stock) : 0,
    };

    if (year !== undefined && year !== null && year !== '') {
      const parsedYear = Number(year);
      if (Number.isNaN(parsedYear)) {
        return res.status(400).json({
          error: {
            pesan: 'Field year harus berupa angka yang valid',
            kode: 'INVALID_YEAR',
          },
        });
      }
      data.year = parsedYear;
    }

    if (price !== undefined && price !== null && price !== '') {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice)) {
        return res.status(400).json({
          error: {
            pesan: 'Field price harus berupa angka yang valid',
            kode: 'INVALID_PRICE',
          },
        });
      }
      data.price = parsedPrice;
    }

    if (publishedDate !== undefined && publishedDate !== null && publishedDate !== '') {
      const parsedDate = new Date(publishedDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          error: {
            pesan: 'Field publishedDate harus berupa format tanggal yang valid',
            kode: 'INVALID_PUBLISHED_DATE',
          },
        });
      }
      data.publishedDate = parsedDate;
    }

    const newBook = await prisma.book.create({ data });

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