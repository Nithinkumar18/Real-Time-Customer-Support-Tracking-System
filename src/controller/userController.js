const logger = require('../loggers/logger');
const userService = require('../service/userService');
const constants = require('../constants/statusConstants');
const responseInfo = require('../constants/responseMessages');
const mysession = require('../config/cacheService');


const userSignUp = async(req,res) => {
    try{
       const _userData = req.body;
       const newUser = await userService.registerUser(_userData);
       if(newUser._id){
        const {_id,createdAt} = newUser;
         logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
         return res.status(constants.CREATED).json({message: responseInfo.USER_CREATED,_id,createdAt});
       }
       else{
         return res.status(constants.BAD_REQUEST).json({message:responseInfo.INCOMPLETE_USERDATA});
       }
    }
    catch(err){
       logger.error(`Error at METHOD: ${req.method} | URL: ${req.url}`,err);
       return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_USER_CREATION,err:err.message});
    }
}


const listUsers = async(req,res) => {
  try{
    const users = await userService.viewUsers();
    logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
    return res.status(constants.SUCCESS).json(users);
  }
  catch(err){
    logger.error(` Error at METHOD: ${req.method} | URL: ${req.url}`);
    return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_VIEW_USERS,err:err.message});
  }
}


const updateProfile = async (req,res) => {
    try{
       const _id = req.params.userId;
       const update_info = req.body;
       const user_profile = await userService.updateUser(_id,update_info);
       if(user_profile.message)
         {
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
        return res.status(constants.NOT_FOUND).json({messsage:user_profile.message});
       }
       else{
         logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
        return res.status(constants.SUCCESS).json({messsage:responseInfo.UPDATE_USER_INFO,lastUpdatedAt:updatedAt});
       }
       }
    catch(err){
       logger.error(` Error at METHOD: ${req.method} | URL: ${req.url}`);
       return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_UPDATE_USER,err:err.message});
    }
}


const deactivateUser = async (req,res) => {
    try{
         const id = req.params.userId;
         const deactivated_user = await userService.deleteUser(id);
         if(deactivated_user.message){
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({message:deactivated_user.message});
         }
         else{
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({message:responseInfo.USER_DEACTIVATED,lastActive:deactivated_user.updatedAt});
         }
    }
    catch(err){
       logger.error(`Error at METHOD: ${req.method} | URL: ${req.url}`);
       return res.status(constants.INTERNAL_SERVER_ERROR).json({message: responseInfo.ERR_DEACTIVATING_USER,err:err.message});
    }
}

const userSignIn = async (req,res) => {
   try{
      const email = req.body.email;
      const password = req.body.password;
      const valid_user = await userService.login(email,password);
      if(valid_user.token){
         logger.info(`METHOD: ${req.method} | URL: ${req.url} : login success,Token generated`);
         await userService.getDataForSession(email);
         return res.status(constants.SUCCESS).json({message:responseInfo.LOGIN_SUCCESS,token:valid_user.token});
      }
      else{
         logger.info(`METHOD: ${req.method} | URL: ${req.url} : login failed!`);
         return res.status(constants.UNAUTHORIZED).json({message:valid_user.message});
      }
   }
   catch(err){
       logger.error(`Error occured: METHOD: ${req.method} | URL: ${req.url}`,err);
       return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_LOGIN,err:err.message});
   }
}


const userLogout = async (req,res) => {
  mysession.clearSession("userSession");
   return res.status(constants.SUCCESS).json({message:responseInfo.USER_LOGOUT_SUCCESS});
}

module.exports = {
    userSignUp,
    listUsers,
    updateProfile,
    deactivateUser,
    userSignIn,
    userLogout
}