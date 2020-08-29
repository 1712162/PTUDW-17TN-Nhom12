const mongoose = require('mongoose');
const passwordLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
	group: {
		type: mongoose.Types.ObjectId,
		ref: "Group",
	},
	author: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	message: String,
	date: Number

});
MessageSchema.plugin(passwordLocalMongoose);
module.exports = mongoose.model("Message", MessageSchema);
