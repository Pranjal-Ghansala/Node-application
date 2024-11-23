const jwt = require("jsonwebtoken")

const secret = "$uperMan@123";

const createTokenForUser = (user) =>{
    const payload = {
        _id: user._id,
        email: user.email,
    }
    const token = jwt.sign(payload, secret)
    return token
}

const validateToken = (token) => {
    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
module.exports = {
    createTokenForUser,
    validateToken,
  };