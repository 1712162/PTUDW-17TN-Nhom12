require('dotenv').config();
const express         =   require('express'),
      app             =   express(),
      bodyParser      =   require('body-parser'),
      mongoose        =   require('mongoose'),
      passport        =   require('passport'),
      LocalStratetry  =   require('passport-local'),
      methodOverride  =   require('method-override'),
      flash           =   require('connect-flash'),
      User            =   require('./models/user'),
      authRoutes      =   require('./routes/auth'),
      groupsRoutes    =   require('./routes/groups'),
      middleware      =   require('./middleware')
app.use(require('express-session')({
  secret: "Huynh Quoc Dung :v",
  resave : true,
  saveUninitialized : false
}));

app.use(methodOverride("_method"));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratetry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static( __dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true})
        .then(() => {
            console.log("Database is running");
        })
        .catch(err => {
            console.log(err);
        })

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(authRoutes);
app.use('/groups', middleware.isLoggedIn, groupsRoutes);
app.listen(3000, function() {
  console.log('Server is running on port ' + 3000);
})
