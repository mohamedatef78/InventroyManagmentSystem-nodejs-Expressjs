const Client = require('../Models/Client');
const CRUD = require('../utils/CRUD');
const catchAsync = require('../Middleware/catchAsync');
const AppError = require('../utils/Error');



exports.createClient = CRUD.Create(Client);
exports.updateClient = CRUD.Update(Client);
exports.deleteClient = CRUD.Delete(Client);
exports.getAllClient = CRUD.GetAll(Client);