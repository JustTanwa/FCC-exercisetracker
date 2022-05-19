const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// use bodyParser middleware
app.use("/api/users",bodyParser.urlencoded({extended: false}));


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// create Schema for user
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}
});

const User = mongoose.model("User", userSchema);

// test 2 
app.post("/api/users", (req, res) => {
  let username = req.body["username"];
  User.create({username: username}, function (err, user){
    if (err) console.error(err);
    res.json({username: username, _id: user.id});
  })
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
