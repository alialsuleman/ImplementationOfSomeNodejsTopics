const { validationResult } = require('express-validator')
const User = require('../models/user.model');
const httpstatusText = require('../utils/httpstatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
//crypto.randomBytes(64).toString('hex');


const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        //   console.log(req.headers);
        const query = req.query;
        let limit = +query.limit || 10;
        limit = Math.min(limit, 10);

        const page = +query.page || 1;
        const skip = (page - 1) * limit;

        //get all courses from DB use Course model 
        const users = await User.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
        res.json({
            status: httpstatusText.SUCCESS,
            data: {
                users: users
            }
        });
    }
)

const register = asyncWrapper(
    async (req, res, next) => {
        let { firstName, lastName, email, password } = req.body;

        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const error = appError.create('user is already exists', 400, httpstatusText.FAIL);
            return next(error);
        }
        password = await bcrypt.hash(password, 10);
        console.log(password);
        const newUser = new User({ firstName, lastName, email, password });
        // genrate jwt token 
        const token = await generateJWT({ email: newUser.email, id: newUser._id });
        newUser.token = token;
        await newUser.save();
        res.status(201).json({
            status: httpstatusText.SUCCESS,
            data: {
                newUser
            }
        });

    }

)
const login = asyncWrapper(
    async (req, res, next) => {
        let { email, password } = req.body;
        password = password.toString();
        email = email.toString();


        if (!email || !password) {
            const error = appError.create('username and password are required', 400, httpstatusText.FAIL);
            return next(error);
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            const error = appError.create('wrong username  or  password ', 500, httpstatusText.FAIL);
            return next(error);
        }

        const matchedPassword = await bcrypt.compare(password, user.password);

        if (matchedPassword) {
            const token = await generateJWT({ email: user.email, id: user._id });
            res.json({
                status: httpstatusText.SUCCESS,
                data: {
                    token: token
                }
            });
        }
        else {
            const error = appError.create('wrong username  or  password ', 500, httpstatusText.FAIL);
            return next(error);
        }


    }
)

module.exports = {
    getAllUsers,
    register,
    login
}