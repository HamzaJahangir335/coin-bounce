const express = require('express');
const auth = require('../middlewares/auth');
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');
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
// CRUD // Create
router.post('/blog', auth, blogController.create)
// Read all blogs
router.get('/blog/all', auth, blogController.getAll)
// Read blog by id 
router.get('/blog/:id', auth, blogController.getById)
// update
router.put('/blog', auth, blogController.update)
// delete
router.delete('/blog/:id', auth, blogController.delete)

// comments
// create
router.post('/comment', auth, commentController.create);
// get by id
router.get('/comment/:id', auth, commentController.getById);


module.exports = router;