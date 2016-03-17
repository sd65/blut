var http = require('http');
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var config = require('./package.json').config;
var port = process.env.PORT || 8080;  
var jsonParser = bodyParser.json()
var Journey = require('./models/journey.js');

mongoose.connect('mongodb://localhost/test');

app.use(session({
  secret: 'sd',
  resave: true,
  saveUninitialized: true
}));

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index', { config: config });
});

app.get('/login', function (req, res) {
    if(req.session.user) res.redirect("/");
    else if (req.query.ticket) {
      var request = {
        host: 'https://cas.utc.fr',
        //port: 443,
        path: '/cas/serviceValidate?service=' + config.SITE_URL + '&ticket=' + req.query.ticket
      };
      http.get(request, function(resp){
        resp.on('data', function(data){
          var fullName = data.match(/<cas:cn>([^<]*)<\/cas:cn>/i)[1];
          req.session.user = fullName;
        });
      }).on("error", function(){
        console.log("Got error:");
      });
    }
    else res.render('login', { config: config });
});

app.get('/offer', function (req, res) {
    res.render('offer', { config: config });
});

app.post('/offer', jsonParser, function (req, res) {
    var journey = new Journey();
    journey.from = req.body.from;
    journey.to = req.body.to;
    journey.datetime = req.body.datetime;
    journey.validate(function(err) {
          if (err) res.status(403).send(err);       
    });
    if(!req.body.dry_run)
      journey.save(function(err, obj) {
        if (err) res.status(403).send(err);
        res.send(req.protocol + '://' + req.get('host') + '/journey/' + obj.id);
      });
});

app.get('/journey/:journeyId', function (req, res) {
  Journey.findById(req.params.journeyId, function(err, journey) {
    if (err) res.status(404).send(err);
    res.render('journey', { journey: journey, config: config});
  });
});

app.listen(port, function () {
    console.log('Example app listening !');
});


