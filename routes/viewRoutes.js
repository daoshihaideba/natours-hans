const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedin,
  viewController.getOverview
);
router.use(viewController.alerts);
router.get('/tour/:slug', authController.isLoggedin, viewController.getTour);

router.get('/login', authController.isLoggedin, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/signup', viewController.signupForm);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updataUserData
);

module.exports = router;
