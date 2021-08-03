const invoiceController = require('../Controller/invoiceController');
const autMiddleware= require('../Middleware/authMiddleware');


const express = require('express');

const router = express.Router();
router.use(autMiddleware.protect,autMiddleware.restrictto('admin'));
router.route('/')
    .post( invoiceController.createinvoice)
   .get(invoiceController.getAllInvoices);
    

router.route('/:id')
    .get(invoiceController.getInvoice)
    .delete(invoiceController.deleteInvoice)
    .patch(invoiceController.updateInvoice);



module.exports = router