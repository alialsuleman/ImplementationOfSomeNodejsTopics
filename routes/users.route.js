const router = require('express').Router();
const validationSchema = require('../middlewares/validationSchema');
const usersControllers = require('../controllers/user.controller')
const verfiyToken = require('../middlewares/verfiyToken');




router.route('/')
    .get(verfiyToken, usersControllers.getAllUsers);


router.route('/register')
    .post(usersControllers.register);

router.route('/login')
    .post(usersControllers.login);

module.exports = router;