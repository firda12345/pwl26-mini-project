const Joi = require('joi');

const authSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      'string.email': 'Format email tidak valid',
      'string.max': 'Email maksimal 100 karakter',
      'any.required': 'Email wajib diisi',
    }),
  password: Joi.string()
    .min(8)
    .max(72)
    .required()
    .messages({
      'string.min': 'Password minimal 8 karakter',
      'string.max': 'Password maksimal 72 karakter',
      'any.required': 'Password wajib diisi',
    }),
});

const validateAuth = (req, res, next) => {
  const { error } = authSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const pesan = error.details.map((detail) => detail.message).join(', ');
    return res.status(422).json({
      error: {
        pesan,
        kode: 'VALIDATION_ERROR',
      },
    });
  }
  next();
};

module.exports = { authSchema, validateAuth };