const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new  mongoose.Schema({
    productname :{
        type:String,
        unique:true,
        trim: true,
        maxlength: [40, 'A product name must have less or equal then 40 characters'],
        minlength: [5, 'A product name must have more or equal then 10 characters'],
        required: [true, 'A product must have a name']
    },
    productcode:{
        type:String,
        unique:true,
        trim: true,
        maxlength: [15, 'A product code must have less or equal then 40 characters'],
        minlength: [5, 'A product code must have more or equal then 10 characters'],
        required: [true, 'A product must have a price']
    },
    
    productprice:{
        type:Number,
        required: [true, 'A product must have a price']
    },
    productquantity:{
        type:Number,
        required: [true, 'A product must have a quatity']
    },
    productweight:{
        type:Number,
        required: [true, 'A product must have a wegiht']
    }
    ,
    productiondate:{
        type:Date,
        required: [true, 'A product must have a production Date']
    },
    slug:String
});

productSchema.pre('save',function(next){
    this.slug = slugify(this.productname,{lower : true , replacement: '-'});
    next();
});

const Product = mongoose.model('Product',productSchema);

exports.productSchema = productSchema;
exports.Product = Product;