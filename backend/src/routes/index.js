const authRoutes = require('./auth/auth');
const groupsRoutes = require('./groups/groups');
const chatRoutes = require('./chat/chat');
const PORT = process.env.PORT || 3000;
const init = () => {
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  const bodyParser = require('body-parser');
  const methodOverride = require('method-override');
  const flash = require('connect-flash');
  const passport = require('passport');
  const LocalStratetry = require('passport-local');
  const User = require('../models/user');
  const middleware = require('../middleware');
  const path = require('path');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(require('express-session')({
    secret: 'Huynh Quoc Dung :v',
    resave: true,
    saveUninitialized: false,
  }));

  app.use(methodOverride('_method'));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStratetry(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
  });

  app.use(express.static(path.join(__dirname, '../public')));
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.use(authRoutes);
  app.use('/groups', middleware.isLoggedIn, groupsRoutes);
  app.use('/chat/:id',middleware.isLoggedIn, chatRoutes);
  app.use(express.static('public'));

  server.listen(3000, function () {
    console.log(`Listening to port ${PORT}`);
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

module.exports = {
  init: init,
};