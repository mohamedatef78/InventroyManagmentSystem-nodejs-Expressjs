const mongoose = require('mongoose');
const slugify = require('slugify');


const ClientSchema =  new  mongoose.Schema({
    clientname:{
        type:String,
        unique:true,
        trim: true,
        maxlength: [40, 'A clien name must have less or equal then 40 characters'],
        minlength: [5, 'A clien name must have more or equal then 10 characters'],
        required: [true, 'A clien must have a name']
    },
    clientphone:{
        type:Number ,
        maxlength: [11, 'A clien name must have less or equal then 11 characters'],
        minlength: [11, 'A clien name must have more or equal then 11 characters'],
        required: [true, 'A clien must have a name']
    },
    clientaddress:{
        type:String,
        required: [true, 'A clien must have a address']
    },
    invoices :[
        {
            type: mongoose.Schema.ObjectId,
            ref : 'Invoice'
        }
    ]
    
});


const Client =  mongoose.model('Client' , ClientSchema);

module.exports = Client ;


