const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

// Example middleware for role-based access control
const checkUserRole = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.headers.authorization; // Replace this with the actual JWT token
    const decodedToken = jwt.verify(token, tGlobalSecretKey);

   // console.log("requiredRole: ",requiredRole)
    //console.log("decodedToken---------------------",decodedToken);
    const userId = decodedToken.id;
    const user = await User.findByPk(userId);

    if(user){
        res.user = user;
        if (requiredRole.includes(user.user_type)) {
            next();
        }else{
            return res.status(403).json({ error: 'Unauthorized: Insufficient privileges.' });
        }
    }else{
        return res.status(403).json({ error: 'Unauthorized: Insufficient privileges.' });
    }
  };
};

module.exports = checkUserRole;
