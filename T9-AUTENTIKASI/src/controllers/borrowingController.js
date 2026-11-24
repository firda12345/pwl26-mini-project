const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBorrowing = async (req, res, next) => {
  const { bookId, borrowerName, quantity } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: Number(bookId) }
      });

      if (!book) {
        res.status(404);
        throw new Error('Buku tidak ditemukan di sistem.');
      }

      if (book.stock < quantity) {
        res.status(409);
        throw new Error(`Stok buku tidak cukup! Sisa stok saat ini: ${book.stock}`);
      }

      const newBorrowing = await tx.borrowing.create({
        data: {
          bookId: Number(bookId),
          borrowerName,
          quantity: Number(quantity)
        }
      });

      const updatedBook = await tx.book.update({
        where: { id: Number(bookId) },
        data: { stock: book.stock - quantity }
      });

      return { newBorrowing, updatedBook };
    });

    return res.status(201).json({
      status: 'success',
      message: 'Transaksi peminjaman berhasil disimpan dan stok buku dikurangi.',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { createBorrowing };