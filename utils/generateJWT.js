
const jwt = require('jsonwebtoken')
module.exports = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: "5d" });
    return token;
}