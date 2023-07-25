const jwt = require('jsonwebtoken');

// Middleware to check JWT authentication
const checkAuth = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  //console.log("checkAuth-----------------------", token);

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  // Verify the token
  jwt.verify(token, tGlobalSecretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }else{
        //console.log("Valud Auth ----------------------------------------------------------", decodedToken);
    }

    // The token is valid, you can access the decoded information in `decodedToken`
    // For example, you might have a userId in the token, and you can access it as `decodedToken.userId`

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = checkAuth;
