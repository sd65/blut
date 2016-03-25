// Npm includes
var https = require('https');
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Init Express
var app = express();

// My external functions
app.locals.myFunctions = require('./includes/functions.js');
app.locals.config = require('./package.json').config;

// Other init
var port = app.locals.config.PORT;  
var jsonParser = bodyParser.json();

// DB
var Journey = require('./models/journey.js');
mongoose.connect('mongodb://localhost/test');

// Sessions with Cookies
app.use(session({
  secret: app.locals.config.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24*60*60*1000 }
}));

// Public dir
app.use(express.static('static'));

// Use Jade
app.set('view engine', 'jade');
app.set('views', './views');

// Auth system
app.all('*', function(req, res, next){
  if(req.session.user == "Sylvain Doignon") {
    if (req.session.redirectTo) {
      var tmp = req.session.redirectTo;
      req.session.redirectTo = "";
      res.redirect(tmp);
    } else {
      res.locals.USER_FULLNAME=req.session.user;
      next();
    }
  } else {
    if (req.path.match(/^\/login|^\/welcome|^\/about/) ) 
      next();
    else {
      req.session.redirectTo=req.url;
      res.redirect("/welcome");
    }
  }
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/welcome', function (req, res) {
  res.render('welcome');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect(app.locals.config.CAS_LOGOUT_URL);
});

app.get('/login', function (req, res) {
  if (req.query.ticket) {
    var request = {
      hostname: 'cas.utc.fr',
      port: 443,
      path: '/cas/serviceValidate?service=' + app.locals.config.SITE_URL 
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
      console.log(e)
      res.redirect("/welcome");
    });
  } else res.render('login');
});

app.get('/offer', function (req, res) {
  res.render('offer');
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
  journey.twoWay = (req.body.twoWay == 1) ? true : false;
  if(journey.twoWay) {
    journey.returnDatetime = req.body.returnDatetime;
    journey.returnDatetimeArrival = req.body.returnDatetimeArrival;
  }
  journey.availableSeats = req.body.availableSeats;
  journey.comment = req.body.comment;
  journey.price = req.body.price;
  journey.driverFullName = req.session.user;
  journey.driverLogin = req.session.login;
  journey.price = req.body.price;
  journey.distance = req.body.distance;
  journey.duration = req.body.duration;
  journey._created_at = new Date();
  journey.save(function(err, obj) {
    if (err) {
      console.log(err)
      var message;
      if (err.name == 'ValidationError') {
         message = "Vos informations saisies ne sont pas correctes :\n";
        for (field in err.errors) {
          message += err.errors[field].message + "\n"; 
        }
      } else message = "Erreur";
      res.status(403).send(message);
    } else res.send(app.locals.config.SITE_URL + '/journey/' + obj.id);
  });
});

app.get('/search', function (req, res) {
  res.render('search', { query: req.query });
});

app.post('/search', jsonParser, function (req, res) {
  var query = {}
  var limit = app.locals.myFunctions.defaultString(req.body.limit, 100);
  var sort = { datetime: 'asc' };
  if (req.body.latest)
    sort = { _created_at: 'desc' };
  if(req.body.from) {
    query.fromLatLng = {
      $near : req.body.from.split(","),
      $maxDistance: app.locals.myFunctions.kmToRadius(req.body.radius)
    }
  }
  if(req.body.to) {
    query.toLatLng = {
      $near : req.body.to.split(","),
      $maxDistance: app.locals.myFunctions.kmToRadius(req.body.radius)
    }
  }
  if (req.body.date) {
    var beginTime = parseInt(req.body.time[0]);
    var endTime = parseInt(req.body.time[1]);
    var date = req.body.date.split('/')
    beginDay = new Date(date[2], date[1] - 1, date[0], beginTime);
    endDay = new Date(date[2], date[1] - 1, date[0], endTime);
    query.datetime = { 
      $gte: beginDay,
      $lt : endDay
    }
  }
  Journey.find(query).limit(limit).sort(sort).exec(function(err, journeys) {
    if (err) res.status(500).send(err);
    else res.render("_tileJourney", { journeys: journeys });
    }); 
});

app.get('/journey/:journeyId', function (req, res) {
  Journey.findById(req.params.journeyId, function(err, journey) {
    if (err)
      res.render('404'); 
    else res.render('journey', { journey: journey });
  });
});

app.get('*', function(req, res){
    res.render('404');
});

app.listen(port, function () {
  console.log(app.locals.config.SITE_TITLE + " listening on port " + port + "!");
});
