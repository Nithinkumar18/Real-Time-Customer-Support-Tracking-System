const ticket = require('../model/ticket');
const logger = require('../loggers/logger');
const responseInfo = require('../constants/responseMessages');
const userService = require('../service/userService');
const myCache = require('../config/cacheService');
const responseService = require('../service/responseService');
const response = require('../model/response');


const createTicket = async (ticket_Info) => {
    let customer_Id, priority, status, dueDate, query, category;
    try {
        const user_info = myCache.getSession("userSession");
        const puser_info = JSON.parse(user_info);
        customer_Id = puser_info.session_userid;
        priority = responseInfo.DEFAULT_PRIORITY;
        status = responseInfo.DEFAULT_STATUS;
        const currentDate = new Date();
        dueDate = new Date(currentDate);
        dueDate.setDate(dueDate.getDate() + 30);

        let _ticketCr = {
            customer_Id,
            query: ticket_Info.query,
            category: ticket_Info.category,
            priority,
            status,
            dueDate
        }

        const _ticket = await ticket.create(_ticketCr);
        return _ticket;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}


const viewTickets = async () => {
    try {
        const _tickets = await ticket.find();
        return _tickets;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const ticketsByPriority = async (ticketPriority) => {
    try {
        const _ticketList = await ticket.find({ priority: ticketPriority });
        return _ticketList;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}


const ticketCurrentStatus = async (ticket_id, cemail) => {
    let current_ticketInfo = {
        status: " ",
        priority: " ",
        category: " ",
        createdOn: " ",
        lastUpdatedOn: " ",
        dueDate: " ",
    }
    let assigneDetails = {
        assigneeEmail: " ",
        assigneeName: " ",
    }
    try {
        const _info = await ticket.findOne({ '_id': ticket_id });
        if (_info) {
            const _currentUser = _info.customer_Id;
            const _currentUserInfo = myCache.getSession();
            const parsedUserInfo = JSON.parse(_currentUserInfo);
            const _usrId = parsedUserInfo.session_userid;
            if (_currentUser == _usrId) {
                current_ticketInfo.status = _info.status;
                current_ticketInfo.priority = _info.priority;
                current_ticketInfo.category = _info.category;
                current_ticketInfo.createdOn = _info.createdAt;
                current_ticketInfo.lastUpdatedOn = _info.updatedAt;
                current_ticketInfo.dueDate = _info.dueDate;
                const assigineInfo = await userService.viewMyProfile(_info.assignedAgent);
                let assigneName, assigneEmail;
                if (assigineInfo == null) {
                    assigneName = "";
                    assigneEmail = "";
                } else {
                    assigneName = assigineInfo.name;
                    assigneEmail = assigineInfo.email;
                }
                assigneDetails.assigneeEmail = assigneEmail;
                assigneDetails.assigneeName = assigneName;
                const responses_data = await responseService.findResponses(ticket_id);
                const responses = responses_data.map(respon => ({
                    respondedBy: respon.respondedBy,
                    message: respon.message
                }))
                let Ticket_Details = {
                    current_ticketInfo,
                    assigneDetails,
                    responses
                }
                return Ticket_Details;
            }
            else {
                return {
                    message: responseInfo.TICKET_ACCESS_INFO
                }
            }
        }
        else {
            return {
                message: responseInfo.INVALID_TICKET_ID
            }
        }
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}


const ticketsByStatus = async (t_status) => {
    try {
        const tickets = await ticket.find({ status: t_status });
        return tickets;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}


const updateTicket = async (ticketId, updateInfo) => {
    try {
        const updated_ticket = await ticket.findByIdAndUpdate({ '_id': ticketId }, { $set: updateInfo }, { new: true });
        if (updated_ticket) {
            const ticket_ownerId = updated_ticket.customer_Id;
            const query = updated_ticket.query;
            const status = updated_ticket.status;
            const respondedByInfo = myCache.getSession("userSession");
            const prespondedByInfo = JSON.parse(respondedByInfo);
            const respondedBy = prespondedByInfo.session_name;
            if (updateInfo.assignedAgent) {
                const message = responseInfo.TICKET_UPDATE_MSG;
                const resInf = { ticketId, ticket_ownerId, respondedBy, message, query, status };
                await responseService.createResponse(resInf);
            }
            else {
                const message = responseInfo.TICKET_STATUS_UPDATE;
                const resInf = { ticketId, ticket_ownerId, respondedBy, message, query, status };
                await responseService.createResponse(resInf);
            }


            return updated_ticket;
        }
        else {
            return {
                message: responseInfo.INVALID_TICKET_ID
            }
        }
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const deleteTicket = async (ticket_Id) => {
    try {
        const unlinked_ticket = await ticket.findByIdAndDelete({ '_id': ticket_Id });
        if (unlinked_ticket) {
            return unlinked_ticket;
        }
        else {
            return {
                message: responseInfo.INVALID_TICKET_ID
            }
        }
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const dueDatePassed = async () => {
    try {
        const cr = responseInfo.DEFAULT_STATUS;
        const priority = responseInfo.HIGH_PRIORITY;
        const date = new Date().toISOString().replace('Z', '+00:00');
        const ticketPassedDueDates = await ticket.find({ $and: [{ dueDate: { $lte: date } }, { status: cr }, { priority: { $ne: priority } }] });
        return ticketPassedDueDates;
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const escalateTickets = async () => {
    try {
        const sts = responseInfo.DEFAULT_STATUS;
        const new_priority = responseInfo.HIGH_PRIORITY;
        const ndate = new Date().toISOString().replace('z', '+00:00');
        const _allTicketsddp = await ticket.find({ $and: [{ dueDate: { $lte: ndate } }, { status: sts }, { priority: { $ne: new_priority } }] }).updateMany({ $set: { priority: new_priority } });
        if (_allTicketsddp.matchedCount > 0) {
            return {
                message: responseInfo.ESCALATE_SUCCESS
            }


        }
        else {
            return {
                message: responseInfo.DUE_DATE_NIL
            }
        }

    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

const getReportsOfTicketResolution = async () => {

    try {
        let date_range1 = new Date();
        let date_range2 = new Date(date_range1);
        date_range2.setDate(date_range2.getDate() - 7);
        date_range1.toISOString().replace('Z', '+00:00');
        date_range2.toISOString().replace('Z', '+00:00');
        const ticketsData = await ticket.find({ $and: [{ status: responseInfo.RESOLVE_STATUS }, { updatedAt: { $gte: date_range2, $lte: date_range1 } }] });
        const total_resolved_tickets = ticketsData.length;
        if (total_resolved_tickets > 0) 
            {
                
            const average_resolution_time = ticketsData.map((tickket) => {
                const createdAtDate = new Date(tickket.createdAt);
                const updatedAtDate = new Date(tickket.updatedAt);
                const ResolutionTimeInSec = updatedAtDate - createdAtDate;
                const ResolutionTimeInMin = Math.floor(ResolutionTimeInSec / (1000 * 60));
                
                return ResolutionTimeInMin;
            })
            const MaxResolutionTime = Math.max(...average_resolution_time);
            const MinResolutionTime = Math.min(...average_resolution_time);
            const SumOfAverageResolutionTime = average_resolution_time.reduce((sum, minutes) => sum + minutes, 0);
            const averageResolutionTime = Math.round(SumOfAverageResolutionTime / total_resolved_tickets);
            let weekly_report = {
                totalResolvedTickets: total_resolved_tickets,
                averageResolutionTimeForEachTicket: averageResolutionTime,
                minimumTimeTakenToResolveTicket: MinResolutionTime,
                maximumTimeTakenToResolveTicket: MaxResolutionTime

            }
           
            return weekly_report;
        }
        else {
            return {
                message: responseInfo.DATA_NOT_FOUND_LWEEK
            }
        }

    }

    catch (err) {
        logger.error(err);
        throw err;
    }

}

const findAgentTickets = async (agentId) => {
    try{
         const agentAssignedTickets = await ticket.find({assignedAgent:agentId});
         return agentAssignedTickets;
    }
    catch(err){
        logger.error(err);
        throw err;
    }
}

module.exports = {
    createTicket,
    viewTickets,
    updateTicket,
    deleteTicket,
    ticketsByPriority,
    ticketsByStatus,
    ticketCurrentStatus,
    dueDatePassed,
    escalateTickets,
    getReportsOfTicketResolution,
    findAgentTickets
    
}
