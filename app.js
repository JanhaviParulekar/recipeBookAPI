const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const createError = require('http-errors');
const db = require('./models').sequelize;
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const recipeRouter = require('./routes/recipe');

const app = express();
app.use(bodyParser.json());
app.use(logger('dev'));

const port = process.env.PORT || 3000;


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/recipes', recipeRouter);

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(500).send(err.message);
});

app.listen(port, () =>{
  console.log(`Started on port ${port}`);
});

module.exports = app;