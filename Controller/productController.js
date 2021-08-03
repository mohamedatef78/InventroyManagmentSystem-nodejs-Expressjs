const catchAsync = require('../Middleware/catchAsync');
const AppError = require('../utils/Error');
const {Product} = require('../Models/Product');
const CRUD = require('../utils/CRUD');

const _ = require('lodash');




exports.addProduct = CRUD.Create(Product);

exports.getAllProducts = catchAsync( async (req,res,next)=>{
    const products = await Product.find(req.query);
    res.status(200).json({
        status : 'success',
        data:{
            products
        }
    })
});

exports.getProductById = catchAsync( async (req,res,next)=>{
    let ID = req.params.id;
    
    const product = await Product.findById(ID);
    if(!product) return next( new AppError('Product Not found',404));
    res.status(200).json({
        status:'success',
        data:{
            product
        }
    })    

});

exports.updateProduct = catchAsync( async (req,res,next)=>{
    let ID = req.params.id;
    let product = req.body ;

    const updateproduct = await Product.findByIdAndUpdate(ID , product , {
        new: true,
        runValidators: true
    });

    if(!updateproduct) return next(new AppError('there is no product with that ID' , 404));

    res.status(200).json({
        status:'success',
        data:{
            updateproduct
        }
    });
    
});