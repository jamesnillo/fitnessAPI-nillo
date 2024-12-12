const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "userId is Required"]
	},
	name: {
		type: String,
		required: [true, "Name is Required"]
	},
	duration: {
		type: String,
		required: [true, "Duration is Required"]
	},
	status: {
		type: String,
		default: "pending"
	},
	dateAdded: {
		type: Date,
		default: Date.now
	}
})


module.exports = mongoose.model('Workout', workoutSchema);