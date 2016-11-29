
var express         = require("express");
var app             = express();
var path            = require('path');
var http            = require('http').Server(app);
var fs              = require('fs');
var bodyParser      = require('body-parser');
var cors            = require('cors');
var open            = require('open');

var port = 3501;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());


app.engine('html', require('ejs').renderFile);
        app.set("view options", {layout: false});
        
        app.use(express.static(path.join(__dirname, ''))); //  "public" off of current is root
        
        app.get('/', function(req, res){
            res.render("index.html");
        });

app.listen(port);

open('http://localhost:' + port);