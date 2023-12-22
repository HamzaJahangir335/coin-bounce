const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/token');
const ACCESS_TOKEN_SECRET = '9c7539a46718baba00b5cf34629a854b928221f12f1e6d08b34a55eb8c01b71efc2c389c30277534ddff5f787c5884bca19e67f5894132aaf3c47019203f3784';
const REFRESH_TOKEN_SECRET='05a65287a25a47f1296f0b0c979f41f94704dbdcf0e90c312a4b1209296254a8c97ccb3986d6e633c2a348aaa83108fb2bb13125db24c40a53b9afca204a29a6'

class JWTService{
    //sign access token
    static signAccessToken(payload, expiryTime){
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime})
    }

    //sign refresh token
    static signRefreshToken(payload, expiryTime){
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: expiryTime})
    }

    //verify access token 
    static verifyAccessToken(token){
        return jwt.verify(token, ACCESS_TOKEN_SECRET)
    }

    //verify refresh token
    static verifyRefreshToken(token){
        return jwt.verify(token, REFRESH_TOKEN_SECRET)
    }

    //store refresh token
    static async storeRefreshToken(token, userId){
        try {
            const newToken = new RefreshToken({
                token: token,
                userId: userId
            });

            //store in db
            await newToken.save();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = JWTService;