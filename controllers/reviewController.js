const Review = require('./../models/reviewModel');
// const catchAsnyc = require('./../utils/catchAsyc');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = String(req.user._id);
  next();
};
exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
