const user = require('../model/user');
const logger = require('../loggers/logger');
const bcrypt = require('bcrypt');
const responseInfo = require('../constants/responseMessages');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const mysession = require('../config/cacheService');
require('dotenv').config();

const registerUser = async (userData) => {

   
    if(!userData.name || !userData.email || !userData.password){
        logger.info("Missing Fields, check user schema");
        return responseInfo.INCOMPLETE_USERDATA;
    }
    try{
        const _password = userData.password;
         const _encryptPassword = await encryptMyPassword(_password);
         userData.password = _encryptPassword;
         const _userRecord = await user.create(userData);
         logger.info(responseInfo.USER_CREATED);
         return _userRecord;
    }
    catch(err){
        logger.error(responseInfo.ERR_USER_CREATION,err);
        throw err;
    }

}

const viewUsers = async () => {
    try{
      const _allUsers = await user.find();
      logger.info(responseInfo.VIEW_USERS);
      return _allUsers;
    }
    catch(err){
       logger.error(responseInfo.ERR_VIEW_USERS,err);
       throw err;
    }

}

const viewMyProfile = async(parametr) => {
    try{
        if(mongoose.Types.ObjectId.isValid(parametr)){
        const user_data = await user.findOne({'_id':parametr});
        return user_data;
        }
        else{
            const user_data = await user.findOne({email:parametr});
            return user_data;
        }
    }
    catch(err){
        logger.error(err);
        throw err;
    }
}

const updateUser = async(user_id,data) => {
    try{
        const _updatedInfo = await user.findByIdAndUpdate({'_id': user_id},{$set:data},{new:true});
        if(_updatedInfo){
        logger.info(responseInfo.UPDATE_USER_INFO);
        return _updatedInfo;
        }else{
            return{
                message:responseInfo.INVALID_USERINFO
            }
        }
    }
    catch(err){
        logger.error(responseInfo.ERR_UPDATE_USER,err);
        throw err;
    }
}

const deleteUser = async (user_id) => {
    try{
       const deactivatedUser = await user.findByIdAndDelete({'_id':user_id});
       if(deactivatedUser){
       logger.info(responseInfo.USER_DEACTIVATED);
       return deactivatedUser;
       }
       else{
        return{
            message:responseInfo.INVALID_USERINFO
        }
    }
    }
    catch(err){
        logger.error(responseInfo.ERR_DEACTIVATING_USER);
        throw err;
    }
}

const encryptMyPassword = async (pass) => {
    try{
        const enc_password = await bcrypt.hash(pass,10);
        return enc_password;
    }
    catch(err){
       logger.error("Error hashing password at encryptPassword");
       throw err;
    }
}

const login = async (email, password) => {
    try {
        const _user = await user.findOne({ email });
          if (_user) {
            const _encpass = _user.password;
            const valid_user = await bcrypt.compare(password, _encpass);
            if (valid_user) {
                const role = _user.role;
                const token = jwt.sign({ email, role }, process.env.SECRET, { expiresIn: '900sec' });
                logger.info(responseInfo.LOGIN_SUCCESS);
                return {
                    token
                };
            }
            else {
                logger.info(responseInfo.INCORRECT_PASSWORD);
                return {
                    message: responseInfo.INCORRECT_PASSWORD
                }
            }
        }
        else {
            return {
                message: responseInfo.LOGIN_FAILED
            }
        }
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const getDataForSession = async (_email) => {
    try{
         const _requiredInfo = await viewMyProfile(_email);
         let session_data = {
          session_userid: _requiredInfo._id,
          session_email:_requiredInfo.email,
          session_name: _requiredInfo.name
         }
         return mysession.setSession(session_data);
    }
    catch(err){
        logger.error(err);
        throw err;
    }
}



module.exports = {
    registerUser,
    viewUsers,
    updateUser,
    deleteUser,
    login,
    viewMyProfile,
    getDataForSession
}

