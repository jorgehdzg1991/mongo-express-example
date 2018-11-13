const { verifyJWT } = require('../helpers/auth.helper');
const { UNAUTHORIZED } = require('http-status-codes');

function verifyJWTMiddleware(req, res, next) {
  let token = req.headers['auth-jwt-token'];

  verifyJWT(token)
    .then((decodedToken) => {
      req.user = decodedToken.data;
      next();
    })
    .catch((err) => {
      res.status(UNAUTHORIZED)
        .json({ message: "Invalid auth token provided." });
    })
}

module.exports = { verifyJWTMiddleware };
