const User = require('../Models/User');
const AppError = require('../utils/Error');
const jwt = require('jsonwebtoken');

const {promisify} = require('util');



exports.protect = async (req,res,next)=>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
         token  = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.jwt){
        token =req.cookies.jwt;
    }
    if(!token) return res.status(401).send('You are not logged in! Please log in to get access.');

    const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    const curentuser = await User.findById(decode.id);
    if(!curentuser) return res.status(401).send('The user belonging to this token does no longer exist.');

    req.user = curentuser ;

    next();

}


exports.restrictto = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('not allow to access this URL',403));
        }
        next();
    };
    
};