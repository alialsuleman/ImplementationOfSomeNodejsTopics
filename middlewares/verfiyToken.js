const jwt = require('jsonwebtoken');
const asyncWrapper = require('./asyncWrapper');



const verfiyToken =
    (req, res, next) => {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if (!authHeader) {

            const error = appError.create('token is required', 401, httpstatusText.FAIL);
            return next(error);
        }

        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            next();
        } catch (err) {
            const error = appError.create('invaliad token', 401, httpstatusText.FAIL);
            return next(error);
        }

    }


module.exports = verfiyToken;