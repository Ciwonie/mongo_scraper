//routing 
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var exphbs = require('express-handlebars');
var router = require('./controllers/controller.js');

//express
var app = express();

// setup handlebars templating engine
app.engine('handlebars', exphbs({defaultLayout: 'main', extname: '.handlebars'}));
app.set('view engine', 'handlebars');

//morgan and body parser with app
var logger = require("morgan");
app.use(logger("dev"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));
// app.use(express.static(process.cwd() + '/public'));

// BodyParser makes it easy for our server to interpret data sent to it - standard code below
app.use(bodyParser.urlencoded({extended: true}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//
app.use('/', router);


// Set up the server
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("App Server is listening on port " + port);
});
