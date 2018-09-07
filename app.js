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

  app.get("/add", (req, res) => {
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
         var userToAdd = new users(req.body);
         userToAdd.save();

               //res.send("item saved to database"); //use this for debugging!  -- Add checking for existing user
               res.sendFile(__dirname + "/addConf.html"); // Redirects to home page
               //Need to have a success page and then redirect to the /add part!
         });

app.post("/search", (req, res) => { //searches users
         var searchString = req.body.data;
         console.log("This is a search post");
         console.log(searchString);
         var query = users.findOne({});

         query.where('email').in([searchString]);
         query.exec(function (err, result) {
                   if (result == null)
                    {
                    console.log("nothing found")
                    }
                    else
                    {
                    console.log(result);

                    }
          });
           //Finds entry that is sent by user and stored in searchString
         });


app.post("/remove", (req, res) => { //removes users
         var removeString = req.body.data;
         var query = users.deleteOne({});

         query.where('email').in([removeString]);
         query.exec(function (err) {
                      //  console.log("Nothing exists!")
                    });


         });


app.post("/update", (req, res) => { //Updates users password

  var searchString = req.body.email;
  var newPassword = req.body.password;
  var passwordConfirm = req.body.passwordConf;
  console.log("This is a search post");
  console.log(searchString);
  var query = users.findOne({});

  query.where('email').in([searchString]);
  query.exec(function (err, docs) {
            if (docs == [])
             {
             console.log("nothing found")
             }
             else
             {
             console.log(docs);
             docs.set({ password: newPassword });
             docs.set({ passwordConf: passwordConfirm });
             docs.save();
             console.log(docs);
             res.send(docs);
             }
   });

           });


app.listen(port, () => {
           console.log("Server listening on port " + port);
           });
