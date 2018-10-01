var express = require("express");
var fs = require('fs');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
var mustache = require('mustache');
var app = express();
const port = 3001;
const workingDir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(workingDir + '/'));

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
    endDate: String
  });
var milestone = mongoose.model("milestone", milestoneSchema);

var imgInfoSchema = new mongoose.Schema(
  { name: String,
    dir: String
  });


var infoContainerSchema = new mongoose.Schema(
  {
    info: [imgInfoSchema]
  });

var info = mongoose.model("imgInfo", imgInfoSchema);
var infoContainer = mongoose.model("infoContainer", infoContainerSchema);


var picObject = new infoContainer;
var searchResults;
var milestoneResults;


//_____________GET METHODS__________//


app.get("/", (req, res) => {
    res.sendFile(workingDir + "/html/index.html");
});

app.get("/add", (req, res) => {
    res.sendFile(workingDir + "/html/add.html");
});

app.get("/addConfirmed", (req, res) => {
    res.sendFile(workingDir + "/html/addConfirmed.html");
});

app.get("/addFail", (req, res) => {
    res.sendFile(workingDir + "/html/addFail.html");
});

app.get("/userExists", (req, res) => {
    res.sendFile(workingDir + "/html/userExists.html");
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

app.get("/noImages", (req, res) => {
    res.sendFile(workingDir + "/html/noImages.html");
});

app.get("/milestoneConfirmed", (req, res) => {
    var searchData = {result:milestoneResults};
    var page = fs.readFileSync(workingDir + "/html/milestoneConfirmed.html", "utf8");
    var html = mustache.to_html(page, searchData);
    res.send(html);
});

app.get("/milestoneSearchFail", (req, res) => {
    res.sendFile(workingDir + "/html/milestoneSearchFail.html");
});

app.get("/displayPics", (req, res) => {
    var imgData = {pictures:picObject};
    var page = fs.readFileSync(workingDir + "/html/viewPics.html", "utf8");
    var html = mustache.to_html(page, picObject);
    res.send(html);
});

//_____________POST METHODS__________//


app.post("/addname", (req, res) => {
    var userToAdd = new users(req.body);
    var p = req.body.password;
    var pConf = req.body.passwordConf;
    var searchString = req.body.email;
    var query = users.findOne({});
    if (p == pConf )
    {
      query.where('email').in([searchString]);

      query.exec(function (err, result)
      {
        if (result == null)
        {
          userToAdd.save();
          res.redirect("/addConfirmed");
        }
        else
        {

          res.redirect("/userExists")
        }

        });
    }

    else
    {
      res.redirect("/addFail");
    }


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
        searchResults = result;
        res.redirect("/searchConfirmed")
      }

      });
});

app.post("/remove", (req, res) => {
     var removeString = req.body.data;
     var query = users.deleteOne({});
     query.where('email').in([removeString]);

     query.exec(function (err, delUser)
     {
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

    query.exec(function (err, updateDoc)
    {
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
  var query = users.findOne({});
  query.where('email').in([searchString]);

  query.exec(function (err, result)
  {

    if (result == null)
    {
      res.redirect("/milestoneSearchFail");
    }
    else
    {
      var mquery = milestone.find({});
      mquery.where('email').in([searchString]);

      mquery.exec(function (err, result)
      {
          if (result.length == 0)
          {
            res.redirect("/milestoneSearchFail");
          }
          else
          {
          milestoneResults = result;
          res.redirect("/milestoneConfirmed");
          }
      });
    }

    });

 });

app.post("/viewPics", (req, res) => {
    tempPicObject = new infoContainer;
    var picDir = "/Images/" + req.body.username + "/" + req.body.milestonename + "/";
    var objectIndex = 0;
    fs.readdir(workingDir + picDir, function(err, items)
    {

      if(items[0] == undefined)
      {
        res.redirect("/noImages");
      }
    else
    {
      for (var i=0; i<items.length; i++)
      {
        if (items[i] == ".DS_Store")
        {
          console.log("Found a DS_Store, Ignoring it");
        }
        else
        {
          var picInfo = new info;
          picInfo.name = items[i];
          picInfo.dir = picDir + items[i];
          tempPicObject.info[objectIndex] = picInfo;
          objectIndex++;
        }

      }
      objectIndex = 0;
      picObject = tempPicObject;
      res.redirect("/displayPics");
    }
    });

 });

app.post("/sendPic", (req, res) => {
        res.sendFile(workingDir + req.body.toServe);
 });

//_____________LISTEN METHODS__________//

app.listen(port, () => {
         console.log("Server listening on port " + port);
  });
