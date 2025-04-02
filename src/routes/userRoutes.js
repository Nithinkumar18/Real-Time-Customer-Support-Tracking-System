const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const authorizeUser = require('../middleware/authrorizeUser');
const userController = require('../controller/userController');


router.get('/users',authenticateUser,authorizeUser(["manager"]),userController.listUsers);
router.post('/register',userController.userSignUp);
router.post('/login',userController.userSignIn);
router.post('/logout', authenticateUser,authorizeUser(["customer","manager","Support Agent"]),userController.userLogout);
router.put('/profupdate/:userId',authenticateUser,authorizeUser(["manager","Support Agent"]),userController.updateProfile);
router.delete('/deactivate/:userId',authenticateUser,authorizeUser(["manager"]),userController.deactivateUser);



module.exports = router;