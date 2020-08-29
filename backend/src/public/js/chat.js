const socket = io();
socket.emit('hello', {userName: globalVar.userName});