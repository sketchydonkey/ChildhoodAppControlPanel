var express = require("express");
var app = express();
var port = 3001;
var bodyParser = require('body-parser');
var foundUserEmail = '';
var foundUserName = '';
const mongoose = require("mongoose");
const workingDir = __dirname;
var mustache = require('mustache');
var fs = require('fs');
var searchResults;
var milestoneResults;
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

var milestoneSchema = new mongoose.Schema(
  {
    email: String,
    milestoneName: String,
    startDate: String,
    endDate: String,
    dir: []
  });
var milestone = mongoose.model("milestone", milestoneSchema);


//_____________GET METHODS__________//


app.get("/", (req, res) => {
        res.sendFile(workingDir + "/html/index.html");

        });



app.get("/add", (req, res) => {
        console.log(res.natname);
        res.sendFile(workingDir + "/html/add.html");
        });



app.get("/addConfirmed", (req, res) => {
        res.sendFile(workingDir + "/html/addConfirmed.html");
        });



app.get("/update", (req, res) => {
        res.sendFile(workingDir + "/html/update.html");
        });

app.get("/updateConfirmed", (req, res) => {
        res.sendFile(workingDir + "/html/updateConfirmed.html");
        });

app.get("/updateFail", (req, res) => {
        res.sendFile(workingDir + "/html/updateFail.html");
        });



app.get("/search", (req, res) => {
        res.sendFile(workingDir + "/html/search.html");
        });

app.get("/searchConfirmed", (req, res) => {



    var searchData = {result:searchResults};
    var page = fs.readFileSync(workingDir + "/html/searchConfirmed.html", "utf8");
    var html = mustache.to_html(page, searchData);
    res.send(html);;
        });

app.get("/searchFail", (req, res) => {
        res.sendFile(workingDir + "/html/searchFail.html");
      });



app.get("/remove", (req, res) => {
        res.sendFile(workingDir + "/html/remove.html");
        });

app.get("/removeConfirmed", (req, res) => {
        res.sendFile(workingDir + "/html/removeConfirmed.html");
        });

app.get("/removeFail", (req, res) => {
        res.sendFile(workingDir + "/html/removeFail.html");
        });



app.get("/milestones", (req, res) => {
        res.sendFile(workingDir + "/html/milestones.html");

        });

app.get("/milestoneConfirmed", (req, res) => {

    var searchData = {result:milestoneResults};
    var page = fs.readFileSync(workingDir + "/html/milestoneConfirmed.html", "utf8");
    var html = mustache.to_html(page, searchData);
        res.send(html);
        });



//_____________POST METHODS__________//


app.post("/addname", (req, res) => {
         var userToAdd = new users(req.body);

         userToAdd.save(); // Need to check is user already here?
         res.redirect("/addConfirmed");
         });

app.post("/viewPics", (req, res) => {
          console.log(req.body.test);
          });



app.post("/search", (req, res) => { //searches users
         var searchString = req.body.data;
         var query = users.findOne({});

         query.where('email').in([searchString]);

         query.exec(function (err, result)
         {
                   if (result == null)
                    {
                    res.redirect("/searchFail");
                    }
                    else
                    {
                    //foundUserEmail = result.email;
                    //foundUserName = result.username;
                    searchResults = result;
                    res.redirect("/searchConfirmed")
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
                         res.redirect("/removeConfirmed");
                      }

                      else
                      {
                        res.redirect("/removeFail");
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
             res.redirect("/updateFail")
             }

             else if(newPassword !== passwordConfirm)
             {
               res.redirect("/updateFail");
             }

             else
             {
             updateDoc.set({ password: newPassword });
             updateDoc.set({ passwordConf: passwordConfirm });
             updateDoc.save();
             res.redirect("/updateConfirmed");
             }
   });

});


app.post("/searchMilestone", (req, res) => {
    var searchString = req.body.data;
    var query = milestone.find({});
    var numMilestones;


     query.where('email').in([searchString]);

     query.exec(function (err, result)
    {
        milestoneResults = result;
        numMilestones = result.length;
        var mstoneNames = [];
        var stringto;
        milestoneResults[0].dir[0] = "this";
        milestoneResults[0].dir[1] = "that";



         console.log(milestoneResults);


        res.redirect("/milestoneConfirmed")
    });

 });


//_____________LISTEN METHODS__________//

app.listen(port, () => {
           console.log("Server listening on port " + port);
           });
