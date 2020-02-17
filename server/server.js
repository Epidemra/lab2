var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var fs = require("fs");

var app = express();
var cors = require('cors');
var jsonParser = bodyParser.json();

//app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(cookieParser());

app.get("/api/cars",function(req, res){



    var content = fs.readFileSync("cars.json", "utf8");
    var cars = JSON.parse(content);
    
    res.status(200).send(cars);
});

//get car by id
app.get("/api/cars/:id", function(req, res){
      
    var id = req.params.id; //get id
    var content = fs.readFileSync("cars.json", "utf8");
    var cars = JSON.parse(content);
    var car = null;

    //searsch car by id
    for(var i=0; i<cars.length; i++){
        if(cars[i].id==id){
            car = cars[i];
            break;
        }
    }

    //send car
    if(car){
        res.send(car);
    }
    else{ 
        res.sendStatus(404);
    }
});

//add car
app.post("/api/cars", jsonParser, function (req, res) {

    console.log(req.body);
    if(!req.body) 
        return res.sendStatus(400);
    
    console.log(req);
    var car = {mark: req.body.mark, model: req.body.model, year: req.body.year};
     
    var data = fs.readFileSync("cars.json", "utf8");
    var cars = JSON.parse(data);
     
    //search max id
    var id = Math.max.apply(Math,cars.map(function(o){return o.id;}))
    //inc it
    car.id = id+1;
    //add car
    cars.push(car);
    var data = JSON.stringify(cars);
    //rewrite file
    fs.writeFileSync("cars.json", data);
    res.send(car);
});

//delete by id
app.delete("/api/cars/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("cars.json", "utf8");
    var cars = JSON.parse(data);
    var index = -1;

    //search car index
    for(var i=0; i<cars.length; i++){
        if(cars[i].id==id){
            index=i;
            break;
        }
    }

    if(index > -1){
        //delete car 
        var car = cars.splice(index, 1)[0];//deleted element
        var data = JSON.stringify(cars);
        fs.writeFileSync("cars.json", data);
        //send deleted car
        res.send(car);
    }
    else{
        res.status(404).send();
    }
});

//modify car
app.put("/api/cars", jsonParser, function(req, res){
      
    if(!req.body) 
        return res.sendStatus(400);
     
    var carId = req.body.id;     
    var data = fs.readFileSync("cars.json", "utf8");
    var cars = JSON.parse(data);
    var car;
    console.log(carId);

    for(var i=0; i<cars.length; i++){
        if(cars[i].id==carId){
            car = cars[i];
            break;
        }
    }
    //modify data
    if(car){
        car.mark = req.body.mark;
        car.model = req.body.model;
        car.year = req.body.year;
        var data = JSON.stringify(cars);
        fs.writeFileSync("cars.json", data);
        res.status(200).send();
    }
    else{
        res.status(404).send(car);
    }
});

app.listen(3003, function(){
    console.log("Server started...");
});