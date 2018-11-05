const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
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
app.use(function (req, res, next) {
  next(new Error('NOT FOUND'));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  
  if (err.message == 'BAD REQUEST' || err.message.indexOf('Validation error') > -1) {
      err.statusCode = 400;
  } else if (err.message == 'UNAUTHORIZED') {
    err.statusCode = 401;
  } else if (err.message == 'NOT FOUND') {
    err.statusCode = 404;
  } else {
    err.statusCode = 500;
  }
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = app;