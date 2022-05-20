const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// use bodyParser middleware
app.use('/api/users', bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// exercise Schema
const exerSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: Date,
});

// user Schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  count: Number
});

// create models for each schema
const Exercise = mongoose.model("Exercise", exerSchema);
const User = mongoose.model("User", userSchema);

// test 2 - 3
app.post("/api/users", (req, res) => {
  let username = req.body["username"];
  User.create({username: username}, function (err, user){
    if (err) console.error(err);
    res.json({username: username, _id: user.id});
  })
});

// test 4 - 6
app.get("/api/users", (req,res) => {
  User.find(function(err, users) {
    if (err) console.error(err);
    res.send(users);
  });
});

// test 7 - 8
app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params["_id"];
  const {description, duration } = req.body;
  let date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
  User.findById(id, function(err, user){
    if(err || !user) {
      console.error(err);
      res.send("Unable to find user with that ID");
    } else {
      Exercise.create({userId: id, description, duration: +duration, date }, function(err, data) {
        if (err) {
          console.error(err);
          res.send("Problem saving exercise");
        } else {
          res.json({"_id": id, "username": user.username, "date":date, "duration": +duration, "description": description})
        }
      });
    }
  });
})

// test 9 - 16
app.get("/api/users/:_id/logs", function(req,res) {
  const {from, to} = req.query;
  let limit = req.query.limit ? req.query.limit: 0;
  const id = req.params["_id"];
  User.findById(id, function(err, user){
    if(err || !user) {
      console.error(err);
      res.send("Unable to find user with that ID");
    } else {
      let dateQuery = {};
      let query = {
        userId: id
      }
      if (from) {
        dateQuery["$gte"] = new Date(from);
      }
      if (to) {
        dateQuery["$lte"] = new Date(to);
      }
      if (from || to) {
        query["date"] = dateQuery;
      }
      Exercise.find(query).limit(limit).exec((err, data) => {
        if (err) {
          console.error(err);
          res.send("Error occured");
        } else {
          const filtered = data.reduce((ls, exercise) => {
            let obj = {
              description: exercise.description,
              duration: exercise.duration,
              date: exercise.date.toDateString()
            }
            ls.push(obj);
            return ls;
          }, [])
          res.json({"_id": user._id, username: user.username, count: filtered.length, log: filtered});
        }
      });
    }  
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
