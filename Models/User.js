const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username:{
        type:String ,
        trim: true,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      role: {
        type: String,
        enum: ['manager', 'admin'],
        default: 'admin'
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
      },  
    
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.comparePassword =  async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword , userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
