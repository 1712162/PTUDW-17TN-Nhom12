var activeUsers = {}
var activeSockets = {}
var activeGroups = {}
module.exports = function(socket) {
  socket.on('disconnect', () => {
	let userName = activeUsers[socket];
	socket.broadcast.emit('offline', {userName: userName});
	delete activeSockets[userName];
	delete activeUsers[socket];
	console.log(Object.keys(activeSockets))
  });
  socket.on('hello', (data) => {
	console.log(data)
	let userName = data.userName;
	activeUsers[socket] = userName;
	activeSockets[userName] = socket;
	console.log(Object.keys(activeSockets))
});
}
