const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    state: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasn\'t been defined'
  })
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasn\'t been defined'
  })
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route hasn\'t been defined'
  })
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has\'nt been defined'
  })
};
