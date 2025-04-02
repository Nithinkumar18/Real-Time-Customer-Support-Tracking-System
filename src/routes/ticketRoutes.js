const ticketController = require('../controller/ticketController');
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const authrorizeUserRole = require('../middleware/authrorizeUser');
const authenticate = require('../middleware/authenticate');


router.post('/createticket',authenticateUser,authrorizeUserRole(["customer","manager","Support Agent"]),ticketController.registerTicket);
router.get('/alltickets',authenticateUser,authrorizeUserRole(["manager","Support Agent"]),ticketController.listAlltickets);
router.get('/ddptickets',authenticateUser,authrorizeUserRole(["manager"]),ticketController.getDDPTickets);
router.get('/byPriority/:priority',authenticateUser,authrorizeUserRole(["Support Agent","manager"]),ticketController.viewTicketsByPriority);
router.get('/byStatus/:status',authenticateUser,authrorizeUserRole(["manager"]),ticketController.viewTicketsByStatus);
router.get('/track/:id',authenticateUser,authrorizeUserRole(["customer"]),ticketController.trackMyTicket);
router.get('/reports',authenticateUser,authrorizeUserRole(["manager"]),ticketController.weeklyReportData);
router.get('/mytickets/:agent_id',authenticateUser,authrorizeUserRole(["manager","Support Agent"]),ticketController.getAgentTickets);
router.delete('/close-ticket/:ticketId',authenticateUser,authrorizeUserRole(["Support Agent","manager"]),ticketController.unlinkTicket);
router.put('/update-ticket/:ticketId',authenticateUser,authrorizeUserRole(["Support Agent","manager"]),ticketController.updateTicketInfo);
router.put('/escalate',authenticateUser,authrorizeUserRole(["manager"]),ticketController.triggerEscalation);
module.exports = router;