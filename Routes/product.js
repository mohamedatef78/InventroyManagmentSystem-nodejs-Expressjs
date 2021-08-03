const productController = require('../Controller/productController');
const autMiddleware= require('../Middleware/authMiddleware');

const express = require('express');
const router = express.Router();

//Routes

router.route('/')
    .get(productController.getAllProducts)
    .post(autMiddleware.protect,autMiddleware.restrictto('admin'),productController.addProduct);


router.route('/:id')
    .get(productController.getProductById)
    .patch(autMiddleware.protect,autMiddleware.restrictto('admin'),productController.updateProduct);



module.exports = router ;