const authRouter = require('./Routes/auth');
const productRouter = require('./Routes/product');
const clientRouter = require('./Routes/client');
const invoiceRouter = require('./Routes/invoice');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));



//Routes

app.use('/IMS/api/auth',authRouter);
app.use('/IMS/api/product',productRouter);
app.use('/IMS/api/client',clientRouter);
app.use('/IMS/api/invoice',invoiceRouter);

app.all('*', (req,res,next)=>{
    next(new Error(`can't find ${req.originalUrl} on this server`,404));
});



module.exports = app;