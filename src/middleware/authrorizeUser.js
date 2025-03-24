
const logger = require('../loggers/logger');
const constants = require('../constants/statusConstants');


const authorizeUser = (validRoles) => {
    return (req,res,next) => {
        try{
          const role = req.role;
          const _authorizedUser = validRoles.contains(role);
          if(_authorizedUser){
            logger.info(`validated user role for request: ${req.URL}`);
            next();
          }
          else{
            logger.info(`User not authorized to perform this operation:${req.URL}`);
            return res.status(constants.UNAUTHORIZED).json({message: 'you are not allowed to perform this action'});
          }
        }
        catch(err){
           logger.error(`Error validating user role ${req.URL}`);
           return res.status(constants.INTERNAL_SERVER_ERROR).json({message: 'Error validating user role',err: err.message});
        }
    }
}

module.exports = authorizeUser;