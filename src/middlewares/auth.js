const passport = require('passport');
const httpStatus = require('http-status');
const AppError = require('../common/errors/app-error');

const auth = (requiredRole) => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect('/login');
    }

    if (requiredRole && user.role !== requiredRole) {
      return next(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
