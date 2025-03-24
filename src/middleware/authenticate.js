
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../loggers/logger');
const constants = require('../constants/statusConstants');

async function authenticate(req,res,next){
    try{
      
        const extractedToken = req.headers.authorization;
        if(!extractedToken || !extractedToken.startsWith('Bearer')){
            logger.error(`No token found / Invalid token format ${constants.BAD_REQUEST}`);
            return res.status(constants.BAD_REQUEST).json({message:"Please login and try again"});
        }

        const token = extractedToken.split(' ')[1];
        const _validateToken =  jwt.verify(token,process.env.SECRET);
        req.role = _validateToken.role;
        logger.info(`authenticating user ${req.url}`);
        next();
 }
    catch(err){
        logger.error(`Error authenticating user: ${req.url}`,err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({message: 'Authenticating user failed',err:err.message});
    }
}

module.exports = authenticate;