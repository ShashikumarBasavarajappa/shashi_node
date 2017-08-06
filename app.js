/*
    we are importing the required files
*/
var express  = require('express');
var routes  = require('./routes');
var http  = require('http');
var path  = require('path');
var urlencoded  = require('url');
var bodyParser  = require('body-parser');
var json  = require('json');
var logger  = require('logger');
var methodOverride = require('method-override');
var nano  = require('nano')('http://localhost:5984');

var db = nano.use('address');

var app= express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());  
app.use(express.static(path.join(__dirname, 'public')));
 

app.get('/', routes.index);

app.post('/createdb', function(req,res){
    nano.db.create(req.body.dbname, function(err){
        if(err){
            res.send("Error IN creating the Database" + req.body.dbname);
            return;
        }
        
        res.send("database " + req.body.dbname + "created");
        
    });
});

app.post('/new_contact', function(req,res){
    var name = req.body.name;
    var phone = req.body.phone;
    db.insert({name: name, phone:phone, crazy: true}, phone, function(err, body, header){
       if(err){
           res.send("error in adding new contact");
           return;
       } 
        res.send("Contact created sucessfuly");
    });
});


app.post('/view_contact', function(req,res){
    var alldoc = "Allowing all the contact";
    
    db.get(req.body.phone,{revs_info: true}, function(err, body){
        if(err){
            res.send("con't able to view");
            return;
        }
        else{
            console.log(body);
        }
        if(body){
            alldoc += "Name: " +body.name+"<br />Phone Number: "+body.phone;
        }
        else{
            alldoc = "No records";
        }
        
        res.send(alldoc);
    });
});



app.post('/delete_contact', function(req, res){
    db.get(req.body.phone, {revs_info:true}, function(err, body){
        if(!err){
            db.destroy(req.body.phone, body._rev, function(err,body){
                if(err){
                    res.send("error in deleting");
                    return;
                } 
            });    
                res.send("Contacts deleted");            
        } 
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port" + app.get('port')); 
});






 