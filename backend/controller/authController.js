const Joi = require('joi');
const User = require('../models/user');
const UserDto = require('../dto/user');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');
const bcrypt = require('bcryptjs');

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const authController = {
    async register(req, res, next) {

        // 1. Validate user input
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        })

        const { error } = userRegisterSchema.validate(req.body)

        // 2. If error in validation --> return error via middleware
        if (error) {
            return next(error);
        }

        // 3. If username or email already exists, return an error
        const { username, name, email, password } = req.body;

        try {
            const emailInUse = await User.exists({ email });

            const usernameInUse = await User.exists({ username });

            if (emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email Already Exists'
                }
                return next(error);
            }

            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: 'Username Already in Use'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        // 4. password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. store user data in db
        let accessToken;
        let refreshToken;
        let user;
        try {
            const userToRegister = new User({
                username,
                email,
                name,
                password: hashedPassword
            })

            user = await userToRegister.save();

            // token generation
            accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');

            refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');
        }
        catch (error) {
            return next(error);
        }

        // store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id)

        //send tokens in cookies
        res.cookie('accessToken ', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        res.cookie('refreshToken ', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        // 6. response send

        const userDto = new UserDto(user);
        return res.status(201).json({ user: userDto, auth: true });

    },
    async login(req, res, next) {

        // valid user input
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern)
        })

        const { error } = userLoginSchema.validate(req.body);

        // if validation error, return error
        if (error) {
            return next(error);
        }

        // match username and password
        const { username, password } = req.body;

        let user;
        try {
            user = await User.findOne({ username: username });

            if (!user) {
                const error = {
                    status: 401,
                    message: 'Invalid Username'
                }
                return next(error);
            }

            // match password
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                const error = {
                    status: 401,
                    message: "Invalid Password"
                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
        const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

        // update refresh token in db

        try {
            await RefreshToken.updateOne({
                _id: user._id
            },
                { token: refreshToken },
                { upsert: true }
            )
        }
        catch (error) {
            return next(error)
        }


        // send data in cookies
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        // return response
        const userDto = new UserDto(user);
        return res.status(200).json({ userDto , auth: true});
    },

    //user logout
    async logout(req, res, next){
        // delete refreshToken from db
        const {refreshToken} = req.cookies;
        try{
            await RefreshToken.deleteOne({token: refreshToken})
        }
        catch(error){
            return next(error);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // response
        res.status(200).json({user: null, auth: false})
    },

    // refresh
    async refresh(req, res, next){
        // get refresh tokens from cookies
        const originalRefreshToken = req.cookies.refreshToken;

        let _id;

        try {
            _id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
            
        } catch (e) {
            const error = {
                status: 401,
                message: 'Unauthorized user'
            }
            return next(error)
        }
        
        // verify refresh tokens
        try {
            const match = RefreshToken.findOne({_id: _id, token: originalRefreshToken});

            if(!match){
                const error={
                    status: 401,
                    message: 'Unauthorized user'
                }
                return next(error)
            }
        } catch (error) {
            return next(error);
        }

        // generate new tokens after verifying
        try {
            const accessToken = JWTService.signAccessToken({_id: _id}, '30m');
        const refreshToken = JWTService.signRefreshToken({_id: _id}, '60m');

        await RefreshToken.updateOne({_id: _id}, {token: refreshToken});

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        } catch (error) {
            return next(error);
        }
        
        // update in db and return response
        const user = await User.findOne({_id: _id});

        const userDto = new UserDto(user);

        return res.status(200).json({user: userDto, auth: true})
    }
}

module.exports = authController;