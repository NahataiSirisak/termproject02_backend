var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

var postRoutes = require('./routes/posts.js');
var userRoutes = require('./routes/auth.js');
var commentRoutes = require('./routes/comments.js');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', "game-reviews")));
app.get('/game-reviews/*', function (req,res) {
    res.sendFile(path.join(__dirname, 'public', 'game-reviews', 'index.html'));
})

app.use('/posts', postRoutes);
app.use('/auth', userRoutes);
app.use('/comments', commentRoutes);

// Server running on port 3000
const port = process.env.PORT || 3000;

console.debug(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log(`Server running on port: ${port}`));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;