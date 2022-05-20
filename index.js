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

// create Schema for user
const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// test 2 - 3
app.post('/api/users', (req, res) => {
	let username = req.body['username'];
	User.create({ username: username }, function (err, user) {
		if (err) console.error(err);
		res.json({ username: username, _id: user.id });
	});
});

// test 4 - 6 get users

app.get('/api/users', (req, res) => {
	User.find(function (err, users) {
		if (err) console.error(err);
		res.send(users);
	});
});

// test 7 - 8 post exercises

app.post('/api/users/:_id/exercises', (req, res) => {
	const id = req.body[':_id'];
	const { description, duration } = req.body;
	let date = req.body.date
		? new Date(req.body.date).toDateString()
		: new Date().toDateString();
	const exercise = { description, duration: +duration, date };
	User.findByIdAndUpdate(
		id,
		{ $push: { log: exercise } },
		{ new: true, strict: false },
		function (err, user) {
			if (err || !user) {
				console.error(err);
				res.send('Unable to find user with that ID');
			} else {
				res.json({"_id": id, username: user.username, ...exercise });
			}
		}
	);
});

// test 9 - 14


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
