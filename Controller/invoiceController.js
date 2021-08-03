const catchAsync = require('../Middleware/catchAsync');
const Invoice = require('../Models/Invoice');
const {Product} = require('../Models/Product');
const Client = require('../Models/Client')
const CRUD = require('../utils/CRUD');
const AppError = require('../utils/Error');
const mongoose = require('mongoose');
const  Fawn = require('fawn');
const fs = require("fs");
const PDFDocument = require("pdfkit");


Fawn.init(mongoose);    


const createInvoice = (invoice, path)=>  {
    let doc = new PDFDocument({ margin: 50 });
  
    generateHeader(doc);
    // generateCustomerInformation(doc, invoice);
    // generateInvoiceTable(doc, invoice);
    generateFooter(doc);
    

    doc.end();
    doc.pipe(fs.createWriteStream(path));
  }

const generateHeader  = doc => {
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("شركه السلام ", 110, 57 ,{rtl: true })
      .fontSize(10)
      .text("123 Main Street", 200, 65, { align: "right" })
      .text("New York, NY, 10025", 200, 80, { align: "right" })
      .moveDown();
  }
const generateFooter = doc => {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }

const  generateCustomerInformation = (doc, invoice) =>{
    const shipping = invoice.shipping;
  
    doc
      .text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
      .text(`Invoice Date: ${new Date()}`, 50, 215)
      .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)
  
      .text(shipping.name, 300, 200)
      .text(shipping.address, 300, 215)
      .text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 300, 130)
      .moveDown();
  } 
exports.createinvoice = catchAsync(async (req,res,next)=>{
    req.body.invoiceDate = Date.now();
    const client =  await Client.findById(req.body.client);
    if(!client  )   return  next(new AppError('There this no Client with this  ID !!!',404));
   
    //let items  = req.body.items ;
    if(!req.body.items  )   return  next(new AppError('There this no items !!!',404));
    
    let task  =  new Fawn.Task();
    let total = 0 ;
    for(let i  in req.body.items){
        let prod =  await Product.findById(req.body.items[i].itemID).select('productprice productweight productquantity ');
        if(prod.productquantity < req.body.items[i].quantity) return next( new AppError('the quantity not enough',400));
        
        req.body.items[i].price = prod.productprice ;
        req.body.items[i].wegiht = prod.productweight ;
        
        subtotal =prod.productprice * prod.productweight * req.body.items[i].quantity;
        req.body.items[i].subtotal = subtotal - (subtotal * (req.body.items[i].sale / 100));
        total = total+ req.body.items[i].subtotal;
        req.body.total =total ;
        //task=
        task.update('products' ,{
            _id: mongoose.Types.ObjectId(req.body.items[i].itemID) 
        },{
            $inc:{
                productquantity:  -req.body.items[i].quantity
            }
        });
    }
    
    let invoice = new Invoice(req.body);
    task.update('clients',{_id : invoice.client}, {
        $push:{
            invoices : invoice._id
        }
    })
    task.save('invoices',invoice);
    task.run();
    const path = 'output.pdf'
    createInvoice(invoice ,path );
    res.status(200).json({
        status:'success'
    })
}) ;



exports.updateInvoice = catchAsync(async(req,res, next)=>{
    const  ID = req.params.id ;
    let  invoice = await  Invoice.findById(ID);
    if(!invoice) return  next( new  AppError('there  is  no invoice with this ID',404));
    let taskupdata  =  new Fawn.Task();
    let task  = new Fawn.Task();
    for( let  i  in  invoice.items){
        taskupdata.update('products' ,{
            _id: mongoose.Types.ObjectId( invoice.items[i].itemID) 
        },{
            $inc:{
                productquantity:  +invoice.items[i].quantity
            }
        });

    }
    taskupdata.run();
    let total = 0 ;
    for(let i  in req.body.items){
        let prod =  await Product.findById(req.body.items[i].itemID).select('productprice productweight productquantity ');
        if(prod.productquantity < req.body.items[i].quantity) return next( new AppError('the quantity not enough',400));
        
        req.body.items[i].price = prod.productprice ;
        req.body.items[i].wegiht = prod.productweight ;
        
        subtotal =prod.productprice * prod.productweight * req.body.items[i].quantity;
        req.body.items[i].subtotal = subtotal - (subtotal * (req.body.items[i].sale / 100));
        total = total+ req.body.items[i].subtotal;
        req.body.total =total ;
        //task=
        task.update('products' ,{
            _id: mongoose.Types.ObjectId(req.body.items[i].itemID) 
        },{
            $inc:{
                productquantity:  -req.body.items[i].quantity
            }
        });
    }
    task.run();
    const updateinvoice = await Invoice.findByIdAndUpdate(ID , req.body ,{new: true,
        runValidators: true});  
    
    res.status(200).json({
        status:'success'
    })

})


exports.deleteInvoice = catchAsync(async (req,res,next)=>{
    const  ID = req.params.id ;
    let task  = new Fawn.Task();
    const clientID = await Invoice.findById(ID).select('client -_id');
    
    task.update('clients' ,{_id: clientID.client} ,
    {
        $pull:{
            invoices : mongoose.Types.ObjectId(ID)
        }
    });
    task.remove('invoices', {_id : mongoose.Types.ObjectId(ID)});
    task.run();
  

    res.status(200).json({
        status:'success'
    })

});

exports.getAllInvoices = CRUD.GetAll(Invoice);
exports.getInvoice = CRUD.GetOne(Invoice);
