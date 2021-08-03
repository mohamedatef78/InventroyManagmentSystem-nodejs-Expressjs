const catchAsync = require('../Middleware/catchAsync');
const AppError = require('./Error');


exports.Create = Model => catchAsync( async (req,res,next)=> {
    console.log('1');
    const doc  = await  Model.create(req.body);
    res.status(201).json({
        status : "success",
        data :{
            doc
        }
    });
});

exports.GetAll = Model => catchAsync( async (req,res,next)=>{
    const doc  = await  Model.find(req.query);
    res.status(201).json({
        status : "success",
        data :{
            doc
        }
    });
})

exports.Update  = Model  => catchAsync( async (req,res ,next)=>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
  
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      });
});


exports.GetOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.Delete =  Model =>
catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});