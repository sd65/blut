// Npm includes
var https = require('https');
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// My external functions
var myFunctions = require('./includes/functions.js');

// Init
var app = express();
var config = require('./package.json').config;
var port = config.PORT;  
var jsonParser = bodyParser.json()

// DB
var Journey = require('./models/journey.js');
mongoose.connect('mongodb://localhost/test');

// Sessions with Cookies
app.use(session({
  secret: config.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Public dir
app.use(express.static('static'));

// Use Jade
app.set('view engine', 'jade');
app.set('views', './views');

// Auth system
app.all('*', function(req, res, next){
  if(req.session.user == "Sylvain Doignon") {
    config.USER_FULLNAME=req.session.user;
    next();
  } else {
    if (req.path.match(/login|welcome/) ) next();
    else res.redirect("/welcome");
  }
});

app.get('/', function (req, res) {
  res.render('index', { config: config });
});

app.get('/welcome', function (req, res) {
  res.render('welcome', { config: config });
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect(config.CAS_LOGOUT_URL);
});

app.get('/login', function (req, res) {
  if (req.query.ticket) {
    var request = {
      hostname: 'cas.utc.fr',
      port: 443,
      path: '/cas/serviceValidate?service=' + config.SITE_URL 
            + '/login&ticket=' + req.query.ticket,
    };
    https.get(request, function(resp){
      resp.setEncoding('utf8');
      resp.on('data', function(data){
        var login = data.match(/<cas:user>([^<]*)<\/cas:user>/i)[1];
        var fullName = data.match(/<cas:cn>([^<]*)<\/cas:cn>/i)[1];
        req.session.login = login;
        req.session.user = fullName;
        res.redirect("/");
      });
    }).on("error", function(e){
      res.redirect("/welcome");
    });
  } else res.render('login', { config: config });
});

app.get('/offer', function (req, res) {
  res.render('offer', { config: config });
});

app.post('/offer', jsonParser, function (req, res) {
  var journey = new Journey();
  journey.fromLatLng = req.body.fromLatLng;
  journey.fromAddress = req.body.fromAddress;
  journey.fromCity = req.body.fromCity;
  journey.toLatLng = req.body.toLatLng;
  journey.toAddress = req.body.toAddress;
  journey.toCity = req.body.toCity;
  journey.datetime = req.body.datetime;
  journey.datetimeArrival = req.body.datetimeArrival;
  journey.returnDatetime = req.body.returnDatetime;
  journey.returnDatetimeArrival = req.body.returnDatetimeArrival;
  journey.availableSeats = req.body.availableSeats;
  journey.comment = req.body.comment;
  journey.price = req.body.price;
  journey.driverFullName = req.session.user;
  journey.driverLogin = req.session.login;
  journey.price = req.body.price;
  journey.distance = req.body.distance;
  journey.duration = req.body.duration;
  journey.validate(function(err) {
    if (err) res.status(403).send(err);       
  });
  if(!req.body.dry_run)
    journey.save(function(err, obj) {
      if (err) res.status(403).send(err);
      res.send(config.SITE_URL + '/journey/' + obj.id);
    });
});

app.get('/journey/:journeyId', function (req, res) {
  Journey.findById(req.params.journeyId, function(err, journey) {
    if (err)
      res.render('404', { config: config }); 
    else res.render('journey', { 
      journey: journey, 
      config: config, 
      myFunctions: myFunctions
    });
  });
});

app.get('*', function(req, res){
    res.render('404', { config: config });
});

app.listen(port, function () {
  console.log(config.SITE_TITLE + " listening on port " + port + "!");
});
