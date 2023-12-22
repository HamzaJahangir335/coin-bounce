const express = require('express');
const auth = require('../middlewares/auth');
const authController = require('../controller/authController');
const router = express.Router();

// testing
router.get('/test', (req, res)=>res.json({msg:'Hello Worlds'}));

// user

// register
router.post('/register', authController.register);
// login
router.post('/login', authController.login);
// logout
router.post('/logout', auth, authController.logout);
// refresh
router.get('/refresh', authController.refresh)
// blog
// CRUD
// Create
// Read all blogs
// Read blog by id 
// update
// delete

// comments


module.exports = router;