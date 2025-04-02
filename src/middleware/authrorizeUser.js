
const logger = require('../loggers/logger');
const constants = require('../constants/statusConstants');
const responseInfo = require('../constants/responseMessages');


const authorizeUser = (validRoles) => {
    return (req,res,next) => {
        try{
          const role = req.role;
          const _authorizedUser = validRoles.includes(role);
          if(_authorizedUser){
            logger.info(`validated user role for request: ${req.path}`);
            next();
          }
          else{
            logger.info(`User not authorized to perform this operation:${req.path}`);
            return res.status(constants.UNAUTHORIZED).json({Access_Denied: responseInfo.ACCESS_DENIED});
          }
        }
        catch(err){
           logger.error(`Error validating user role ${req.path}`,err);
           return res.status(constants.INTERNAL_SERVER_ERROR).json({message: 'Error validating user role',err: err.message});
        }
    }
}

module.exports = authorizeUser;