const mongoose = require('mongoose');
const { invoice } = require('../Controller/invoiceController');
const Client =  require('./Client');


const invoiceSchema = new  mongoose.Schema({
    client:{
        type: mongoose.Schema.ObjectId,
        ref:'Customer'    
    },
    items : [{
        itemID : {
            type: mongoose.Schema.ObjectId,
            required: [true, 'A invoice must a a ID'],
            ref:'Product' 
        },
        quantity: {
            type:Number,
            required: [true, 'A item must a a weight'],
        },
        weight:{
            type:Number,
            enum: [5,3,2,1],
            
        },
        price:{
            type:Number,
           
        },
        sale:{
            type:Number,
            default:0.00,
            required: [true, 'Ads']
        },
        subtotal :{
            type:Number
        }
    }],
    invoiceDate: {
        type:Date,
        default:Date.now(),
        required: [true, 'Date']
    },
    total:{
        type:Number,
        required: [true, 'Date']
    }


})


invoiceSchema.pre('save',async function(next){
    console.log(this.client);
    const client  = await Client.findByIdAndUpdate({_id:this.client},{
        $push:{
            invoices: this._id
        }
    });
    next()
   
});


const Invoice =  mongoose.model('Invoice' , invoiceSchema);


module.exports = Invoice;