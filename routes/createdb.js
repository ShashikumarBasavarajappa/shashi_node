exports.create = function(req, res){
    nano.db.create(req.body.dbname, function(){
        if(err){
            res.send("error in creating DB");
            return;
        }
        res.send("database created sucess");
    });  
};