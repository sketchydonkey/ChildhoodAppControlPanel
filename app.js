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
        res.sendFile(__dirname + "/add.html");
        });

app.get("/update", (req, res) => {
        res.sendFile(__dirname + "/update.html");
        });

app.get("/search", (req, res) => {
        res.sendFile(__dirname + "/search.html");
        });

app.get("/remove", (req, res) => {
        res.sendFile(__dirname + "/remove.html");
        });

app.post("/addname", (req, res) => { //adds users
         var myData = new users(req.body);
         myData.save()
         .then(item => {
               //res.send("item saved to database"); //use this for debugging!  -- Add checking for existing user
               res.sendFile(__dirname + "/add.html") // Redirects to home page
               })

         .catch(err => {
                res.status(400).send("unable to save to database");
                });
         });

app.post("/search", (req, res) => { //searches users
         var searchString = req.body.data;
         console.log("This is a search post");
         console.log(searchString);
         var query = users.findOne({});

         query.where('password').in([searchString]);
         query.exec(function (err, docs) {
                   if (docs == [])
                    {
                    console.log("nothing found")
                    }
                    else
                    {
                    console.log(docs);
                    docs.set({ email: 'newemail' });
                    docs.save();
                    console.log(docs);
                    res.send(docs);
                    }
          });
           //Finds entry that is sent by user and stored in searchString
         });


app.post("/remove", (req, res) => { //removes users
         var removeString = req.body.password;
         console.log("This is a search post");
         console.log(removeString);
         var query = users.deleteOne({});

         query.where('password').in([removeString]);
         query.exec(function (err) {

                    });

         //need to add error handling
         });


app.post("/update", (req, res) => { //Updates users password
         var userUpdate = req.body.email;
         var updatePassword = req.body.password;
         var updatePasswordConf = req.body.passwordConf;
         console.log("This is a update post");
         console.log(userUpdate);
         console.log(updatePassword);
         console.log(updatePasswordConf);

         var updateUserInfo = new users({ email: userUpdate, username: userUpdate, password: updatePassword, passwordConf: updatePasswordConf});

         console.log(updateUserInfo);







         });


app.listen(port, () => {
           console.log("Server listening on port " + port);
           });
