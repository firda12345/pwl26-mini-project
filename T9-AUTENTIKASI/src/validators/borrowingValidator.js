const Joi = require('joi');

const borrowingValidationSchema = Joi.object({
  bookId: Joi.number().integer().positive().required().messages({
    'number.base': 'ID buku harus berupa angka.',
    'number.integer': 'ID buku harus berupa bilangan bulat.',
    'number.positive': 'ID buku harus bernilai positif.',
    'any.required': 'ID buku wajib diisi.'
  }),
  borrowerName: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Nama peminjam harus berupa teks.',
    'string.empty': 'Nama peminjam tidak boleh kosong.',
    'string.min': 'Nama peminjam minimal harus terdiri dari 3 karakter.',
    'string.max': 'Nama peminjam maksimal 100 karakter.',
    'any.required': 'Nama peminjam wajib diisi.'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Jumlah pinjam harus berupa angka.',
    'number.integer': 'Jumlah pinjam harus berupa bilangan bulat.',
    'number.min': 'Jumlah pinjam minimal adalah 1.',
    'any.required': 'Jumlah pinjam wajib diisi.'
  })
});

const validateBorrowing = (req, res, next) => {
  const { error } = borrowingValidationSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validasi input gagal.',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  next(); 
};

module.exports = { validateBorrowing };

module.exports = errorHandler;