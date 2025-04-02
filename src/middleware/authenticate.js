
const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../loggers/logger');
const constants = require('../constants/statusConstants');
const responseInfo = require('../constants/responseMessages');
const userService = require('../service/userService');
const mysession = require('../config/cacheService');

async function authenticate(req,res,next){
    try{
      
        const extractedToken = req.headers.authorization;
        if(!extractedToken || !extractedToken.startsWith('Bearer')){
            logger.error(`No token found / Invalid token format ${constants.BAD_REQUEST}`);
            return res.status(constants.BAD_REQUEST).json({message:responseInfo.TOKEN_UNDEFINED});
        }

        const token = extractedToken.split(' ')[1];
        const _validateToken =  jwt.verify(token,process.env.SECRET);
        req.role = _validateToken.role;
        req.email = _validateToken.email;
        logger.info(`authenticating user ${req.url}`);
        next();
 }
    catch(err){
        mysession.clearSession("userSession");
        logger.error(`Error authenticating user: ${req.url}`,err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({message: responseInfo.TOKEN_EXPIRED,err:err.message});
    }
}

module.exports = authenticate;