const jwt  = require('jsonwebtoken');
const config = require('../config');
const authenticateUser = (req, res, next) =>{
   const authHeader = req.header('Authorization');
   
  const token = authHeader && authHeader.split(' ')[1];
   //const token = req.header('Authorization')
    if(!token){
        return res.status(401).json({error: 'Unauthorired-Token not provided'})
    }
    try{
const decoded =jwt.verify(token, config.jwtSecret)
req.user = decoded.user
next();

    }catch(error){
        res.status(401).json({error: 'Unauthorized- Invalid token',error})
    }
}

const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden - Access denied' });
      }
      next();
    };
  };

module.exports ={
    authenticateUser,
    authorizeRole
} 