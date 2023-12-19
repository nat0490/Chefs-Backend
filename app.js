require('dotenv').config();
require('./models/connection');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userProfilRouter = require('./routes/userProfil');
var userChefRouter = require('./routes/userChef');
var recipesRouter = require('./routes/recipes');
var ordersRouter = require('./routes/orders');
var feedbackRouter = require('./routes/feedback');
var userPreferenceRouter = require('./routes/userPreference');
var ustensilsRouter = require('./routes/ustensils');
var userChefAvailabilityRouter = require('./routes/userChefAvailability');

const cors = require('cors');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/profil', userProfilRouter);
app.use('/users/chef', userChefRouter);
app.use('/recipes', recipesRouter);
app.use('/orders', ordersRouter);
app.use('/feedback', feedbackRouter);
app.use('/userPreference', userPreferenceRouter);
app.use('/ustensils', ustensilsRouter);
app.use('/userChefAvailability', userChefAvailabilityRouter);

module.exports = app;
