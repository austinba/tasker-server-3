import * as userActions from './actions/users';


/** This only checks if user is authenticated, but doesn't block unauthenticated requests */
export function checkAuth(req, res, next) {
  if (req.headers && req.headers.authorization) {
    userActions.authenticate({jwtToken: req.headers.authorization})
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        next();
      })
  }
}

/** this will block unauthenticated requests */
export function auth(req, res, next) {
  checkAuth(req, res, function() {
    if(req.user && req.user.username && req.user.teamdomain) {
      next();
    } else {
      res.sendStatus(401);
    }
  })
}
