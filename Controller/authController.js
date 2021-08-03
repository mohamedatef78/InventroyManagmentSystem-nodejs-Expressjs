const catchAsync = require('../Middleware/catchAsync');
const AppError = require('../utils/Error');
const User = require('../Models/User');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const signToken =  id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
       expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createToken = (user , statuscode ,req ,res)=>{
    const token  =  signToken(user._id);
    res.cookie('jwt',token , {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
          secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    res.status(200).json({
        token : token ,
        user: user
    });
}

exports.signup =catchAsync( async (req,res,next)=>{
    // 1 ) check if user or password  is not emp
    if(!_.pick(req.body , ['username', 'email','password','passwordConfirm'])) 
        return next(new AppError('Please provide email and password!', 400));

    const newuser = await User.create(_.pick(req.body,['username','email','password','passwordConfirm']));
    createToken(newuser , 201 ,req,res);
});

exports.login = catchAsync(async (req,res,next)=>{
    if(!_.pick(req.body,['email','password']))  return next(new AppError('Please provide email and password!', 400)) ;

    const user = await User.findOne({email:req.body.email}).select('+password');
    if(!user || !(await user.comparePassword(req.body.password , user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }
    createToken(user,200,req,res);
});