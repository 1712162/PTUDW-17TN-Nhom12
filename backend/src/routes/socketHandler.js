var onlineUsers = {}
var onlineSockets = {}
module.exports = function(socket) {
  socket.on('disconnect', () => {
	let userName = onlineUsers[socket];
	socket.broadcast.emit('offline', {userName: userName});
	delete onlineSockets[userName];
	delete onlineUsers[socket];
	console.log(Object.keys(onlineSockets))
  });
  socket.on('hello', (data) => {
	console.log(data)
	let userName = data.userName;
	onlineUsers[socket] = userName;
	onlineSockets[userName] = socket;
	console.log(Object.keys(onlineSockets))
});
}
