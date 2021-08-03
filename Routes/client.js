const clientController = require('../Controller/clientController');
const autMiddleware= require('../Middleware/authMiddleware');


const express = require('express');

const router = express.Router();
router.use(autMiddleware.protect,autMiddleware.restrictto('admin'));
router.route('/')
    .get(clientController.getAllClient)
    .post( clientController.createClient);

router.route('/:id')
    .patch(clientController.updateClient);



module.exports = router