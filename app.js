var express = require("express");
var app = express();
var port = 3001;
var bodyParser = require('body-parser');
var foundUserEmail = '';
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

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


app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
        console.log(req.protocol);
        console.log(req.get('host'));
        console.log(req.originalUrl);
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

app.post("/addname", (req, res) => {
         var userToAdd = new users(req.body);

         userToAdd.save(); // Need to check is user already here?
         res.redirect("/add");
         });

app.post("/search", (req, res) => { //searches users
         var searchString = req.body.data;
         var query = users.findOne({});

         query.where('email').in([searchString]);

         query.exec(function (err, result)
         {
                   if (result == null)
                    {
                    console.log("nothing ")
                    }
                    else
                    {
                    console.log(result);
                    foundUserEmail = result.email;
                    res.redirect("/search")
                    }
          });

         });


app.post("/remove", (req, res) => { //removes users
         var removeString = req.body.data;
         var query = users.deleteOne({});

         query.where('email').in([removeString]);
         query.exec(function (err, delUser) {

                      if (delUser.n == 1) // A user exists and was deleted
                      {
                         res.redirect("/remove");
                      }

                      else
                      {
                        //  console.log("Nothing exists!")
                      }

                    });


         });


app.post("/update", (req, res) => { //Updates users password

  var searchString = req.body.email;
  var newPassword = req.body.password;
  var passwordConfirm = req.body.passwordConf;
  var query = users.findOne({});

  query.where('email').in([searchString]);
  query.exec(function (err, updateDoc) {
            if (updateDoc == [] || updateDoc == null)
             {
             res.send("No Records Matching that email found! Try Searching for it!")
             }

             else if(newPassword !== passwordConfirm)
             {
               res.send("Passwords do not match! Try Again!");
             }

             else
             {
             updateDoc.set({ password: newPassword });
             updateDoc.set({ passwordConf: passwordConfirm });
             updateDoc.save();
             res.redirect("/update");
             }
   });

           });


app.listen(port, () => {
           console.log("Server listening on port " + port);
           });
