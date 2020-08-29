var groupUsers = {}
var userSockets = {}
var groupSockets = {}


module.exports = function(socket) {
	socket.on('disconnect', () => {
		let userName = userSockets[socket];
		let groupName = groupSockets[socket];

		delete groupUsers[groupName][userName];
		delete userSockets[socket]
		delete groupSockets[socket]

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
		let sendData = {
			userName: author,
			message: message
		};
		Object.keys(groupUsers[groupName]).forEach(userName => {
			groupUsers[groupName][userName].emit('message', sendData);
		});

	});
}
