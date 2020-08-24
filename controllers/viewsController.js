const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  //Get all tour data from collection
  const tours = await Tour.find();

  //Build template
  //Render the template using the tour data

  res.status(200).render('overview', {
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  //Get tour data from collection (including reviews and guides)
  const myTour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!myTour) {
    return next(new AppError('There is no tour with that name', 404))
  }
  //Build template

  //Render the template using the tour data


  res.status(200).render('tour', {
    title: `${myTour.name} Tour`,
    tour: myTour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    });
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });

};