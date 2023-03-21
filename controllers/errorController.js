const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value} Please use another value`;
  return new AppError(message, 500);
};

const handlevalidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const messages = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(messages, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token, Please login again', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired!,Please login again', 401);
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    console.error('ERROR 💥', err);

    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
};
const sendErrorProd = (err, req, res) => {
  //APIS
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error('ERROR 💥', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.staticCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === 'Validation failed')
      error = handlevalidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(err, req, res);
  }
};
