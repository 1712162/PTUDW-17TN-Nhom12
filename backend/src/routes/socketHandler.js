const Message = require("../models/message");
const User = require("../models/user");

var groupUsers = {}
var userSockets = {}
var groupSockets = {}


module.exports = function(socket) {
	socket.on('disconnect', () => {
		let userName = userSockets[socket];
		let groupName = groupSockets[socket];
		if (groupName == null || userName == null)
			return;
		delete groupUsers[groupName][userName];
		delete userSockets[socket];
		delete groupSockets[socket];

		if (Object.keys(groupUsers[groupName]).length == 0)
			delete groupUsers[groupName];
	});

  	socket.on('hello', (data) => {
		let userName = data.userName;
		let groupName = data.groupName;
		if (!(groupName in groupUsers))
			groupUsers[groupName] = {};

		groupUsers[groupName][userName] = socket;
		userSockets[socket] = userName;
		groupSockets[socket] = groupName;
	  });

	socket.on('message', (data) => {
		let author = data.userName;
		let groupName = data.groupName;
		let message = data.message;
		User.findOne({username: author}, "profile_image", (err, foundUser) => {
			if (err){
				console.log(err);
				return;
			}
			let profile_image = foundUser.profile_image;

			let msgObj = new Message({
				group_name: groupName,
				author: author,
				date: Date.now(),
				profile_image: profile_image,
				message: message
			});
			msgObj.save((err) => {
				if (err) console.log(err);
			});

			let sendData = {
				userName: author,
				profile_image: profile_image.data,
				message: message
			};
			Object.keys(groupUsers[groupName]).forEach(userName => {
				groupUsers[groupName][userName].emit('message', sendData);
			});
		});

	});
}
