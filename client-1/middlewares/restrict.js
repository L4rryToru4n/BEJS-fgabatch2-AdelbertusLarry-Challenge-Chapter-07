// https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn

const jwt = require('jsonwebtoken');
let { JWT_SECRET_KEY } = process.env;

async function restrict(req, res, next) {
  // const { authorization } = req.headers;
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Token is required, please log in first." });
  }

  try {
    //Trim for whitespaces
    // const TOKEN_VALUE = token.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token, Authorization denied." });
  }
}

module.exports = restrict;