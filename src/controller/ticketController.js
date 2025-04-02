const ticketService = require('../service/ticketService');
const logger = require('../loggers/logger');
const constants = require('../constants/statusConstants');
const responseInfo = require('../constants/responseMessages');
const { rawListeners } = require('../model/user');

const registerTicket = async (req, res) => {
    try {
        const ticket_info = req.body;
        const _ticketData = await ticketService.createTicket(ticket_info);
        if (_ticketData) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`, responseInfo.TICKET_GENERATED);
            return res.status(constants.CREATED).json({ message: responseInfo.TICKET_GENERATED, Ticket: _ticketData });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`, responseInfo.TICKET_GENRATAION_FAIL);
            return res.status(constants.BAD_REQUEST).json({ message: responseInfo.TICKET_GENRATAION_FAIL });
        }
    }
    catch (err) {
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`, err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.TICKET_GENRATAION_FAIL, err: err.message });
    }
}


const listAlltickets = async (req, res) => {
    try {
        const _listOfTickets = await ticketService.viewTickets();
        if (_listOfTickets.length > 0) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ tickets: _listOfTickets });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ message: responseInfo.TICKETS_DATA_NIL });
        }
    }
    catch (err) {
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`, err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.ERR_TICKETS, Error: err.message });
    }
}

const viewTicketsByPriority = async (req, res) => {
    try {
        const _priority = req.params.priority;
        const _allTickets = await ticketService.ticketsByPriority(_priority);
        if (_allTickets.length > 0) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ ticketsPriority: _allTickets });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ message: responseInfo.TICKETS_NOT_AVAILABLE_PC });
        }
    }
    catch (err) {
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`, err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.ERR_TICKETS, Error: err.message });
    }
}

const getAgentTickets = async (req,res) => {
    try{
         const a_id = req.params.agent_id;
         const _tickets = await ticketService.findAgentTickets(a_id);
         if(_tickets.length > 0){
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({_tickets});
         }
         else{
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({message: responseInfo.AGENT_TICKETS_NOT_ASSIGNED});
         }
    }
    catch(err){
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`,err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({Error:err.message});
    }
}
const viewTicketsByStatus = async (req, res) => {
    try {
        const _status = req.params.status;
        const _currentTickets = await ticketService.ticketsByStatus(_status);
        if (_currentTickets.length > 0) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ ticketsStatus: _currentTickets });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ message: responseInfo.TICKETS_NOT_AVAILABLE_PC });
        }
    }
    catch (err) {
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`, err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.ERR_TICKETS, Error: err.message });
    }
}

const updateTicketInfo = async (req, res) => {
    try {
        const _tId = req.params.ticketId; 
        const info = req.body;
        const updatedDetails = await ticketService.updateTicket(_tId, info);
        if (updatedDetails.message) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.NOT_FOUND).json({ message: responseInfo.TICKETS_DATA_NIL });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ message: responseInfo.TICKET_DETAILS_UPDATED, updatedTicket: updatedDetails });
        }
    }
    catch (err) {
        logger.error(err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.TICKET_UPDATION_FAILED, Error: err.message });
    }
}


const unlinkTicket = async (req, res) => {
    try {
        const t_id = req.params.ticketId;
        const unregisterTicket = await ticketService.deleteTicket(t_id);
        if (unregisterTicket.message) {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.NOT_FOUND).json({ message: unregisterTicket.message });
        }
        else {
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({ message: responseInfo.UNLINK_TICKET, ticket_Id: unregisterTicket._id });
        }
    }
    catch (err) {
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`, err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({ message: responseInfo.ERR_UNLINK_TICKET, Error: err.message });
    }
}



const trackMyTicket = async (req,res) => {
  try{

      const ticketId = req.params.id;
      const _email = req.email;
      const _ticketStatus = await ticketService.ticketCurrentStatus(ticketId,_email);
      if(_ticketStatus.message){
         logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
         const statuscode = _ticketStatus.message === responseInfo.INVALID_TICKET_ID ? constants.NOT_FOUND : constants.UNAUTHORIZED;
         return res.status(statuscode).json({message:_ticketStatus.message});
      }
      else{
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
          return res.status(constants.SUCCESS).json({_ticketStatus});
      }

  }
  catch(err){
      logger.error(`METHOD: ${req.method} | URL: ${req.url}`,err);
      return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_TICKET_ACCESS_INFO,Error:err.message});
  }
}

const getDDPTickets = async(req,res) => {
    try{
       const ddTickets = await ticketService.dueDatePassed();
       if(ddTickets.length > 0){
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
        return res.status(200).json(ddTickets);
       }
       else{
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
         return res.status(200).json({message:responseInfo.DUE_DATE_NIL});
       }

    }
    catch(err){
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`,err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_DUE_DATE,Error:err.message});

    }
}

const triggerEscalation = async (req,res) => {
    try{
       const _escaltedInfo = await ticketService.escalateTickets();
       if(_escaltedInfo.message === responseInfo.ESCALATE_SUCCESS){
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
         return res.status(constants.SUCCESS).json({message:_escaltedInfo.message});
       }
       else{
        logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
           return res.status(constants.FORBIDDEN).json({message:_escaltedInfo.message});
       }
    }
    catch(err){
         logger.error(`METHOD: ${req.method} | URL: ${req.url}`,err);
         return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ESCALATE_FAIL,Error:err.message});

    }
}

const weeklyReportData = async(req,res) => {
    try{
        const weekly_report = await ticketService.getReportsOfTicketResolution();
        if(weekly_report.message){
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({message:weekly_report.message});
        }
        else{
            logger.info(`METHOD: ${req.method} | URL: ${req.url}`);
            return res.status(constants.SUCCESS).json({weekly_report,Note:responseInfo.DATA_IN_MINS});
        }

    }
    catch(err){
        logger.error(`METHOD: ${req.method} | URL: ${req.url}`,err);
        return res.status(constants.INTERNAL_SERVER_ERROR).json({message:responseInfo.ERR_FETCHING_WEEKLYREPORTS,Error:err.message});
    }
}
module.exports = {
   
    registerTicket,
    listAlltickets,
    viewTicketsByPriority,
    viewTicketsByStatus,
    updateTicketInfo,
    unlinkTicket,
    trackMyTicket,
    getDDPTickets,
    triggerEscalation,
    weeklyReportData,
    getAgentTickets
}