const response = require('../model/response');
const logger = require('../loggers/logger');
const mail = require('../utilities/mailService');
const responseInfo = require('../constants/responseMessages');
const userService = require('../service/userService');

const createResponse = async(responseInfo) => {
    try{
       const {ticketId,respondedBy,message,ticket_ownerId,query,status} = responseInfo;
       const resCr = { ticketId,respondedBy,message};
       const createResponse = await response.create(resCr);
       logger.info(responseInfo.response_rec);
       const ticket_ownerInfo = await userService.viewMyProfile(ticket_ownerId);
       const reciptent_info = ticket_ownerInfo.email;
       const reciptent_name = ticket_ownerInfo.name;
       const mailArgs = {reciptent_info,respondedBy,message,ticketId,reciptent_name,query,status}
       await mail.sendNotification(mailArgs);
        return createResponse;
    }
    catch(err){
        logger.error(err);
        throw err;
    }
}


const findResponses = async(tiId) => {
    
    try{
        const all_responses = await response.find({ticketId:tiId});
       return all_responses;

    }
    catch(err){
        logger.error(err);
        throw err;
    }
}

module.exports = {
    createResponse,
    findResponses
}