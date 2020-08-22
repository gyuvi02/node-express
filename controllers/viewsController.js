const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');


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