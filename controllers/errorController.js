const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, '400');
};

const handleDuplicateFieldDB = err => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, '400');
};

  const handleValidationErrorDB = err => {
  const message = `Validation error`;
  return new AppError(message,'400')
}

const handleJWTError = () => new AppError('Invalid token, please log in again!', 401);

const hadnleJWTExpiredError = () => new AppError('Your token has expired, please log in again!', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack
  });
}
const sendErrorProd = (err, res) => {

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR', err)

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
}

  module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      if (err.name === 'JsonWebTokenError' ) error = handleJWTError();
      if (err.name === 'TokenExpiredError') error = hadnleJWTExpiredError();
      if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
      else if (error.code === 11000) error = handleDuplicateFieldDB(error);
      // else if (error.name === 'ValidationError') error = handleValidationErrorDB(error); //a name mezo nem letezik ezen a helyen
      else error = new AppError(err.message, 400);
      sendErrorProd(error, res);
    }


  }