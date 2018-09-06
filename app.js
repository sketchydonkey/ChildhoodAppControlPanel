var express = require("express");
var app = express();
var port = 3001;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ChildhoodAppDB");
var db = mongoose.connection;


var userSchema = new mongoose.Schema(
{
                                     email: String,
                                     username: String,
                                     password: String,
                                     passwordConf: String
});

var users = mongoose.model("users", userSchema);

/*users.find(function(err, users) {
           if (err) return console.error(err);
           console.log(users);
           });
*/ //This Shows all the database contents of users

app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
        });

app.post("/addname", (req, res) => {
         var myData = new users(req.body);
         myData.save()
         .then(item => {
               res.send("item saved to database");
               })
         .catch(err => {
                res.status(400).send("unable to save to database");
                });
         });

app.listen(port, () => {
           console.log("Server listening on port " + port);
           });
