var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000;

app.configure(function() {
    app.use('/public',express.static(__dirname + '/public'));
    app.engine('html', require('ejs').renderFile);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.cookieParser());
    
    app.use(express.session({
      secret: 'cs secret',
      maxAge: new Date(Date.now() + 3600000)
    }));
    app.use(express.bodyParser()); // REQUIRED
    app.use(express.logger());
    
});

app.get('/',function(req,res){
    res.render('index',{});
});


exports.server = app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});



