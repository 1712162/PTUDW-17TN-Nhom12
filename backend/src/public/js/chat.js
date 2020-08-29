const socket = io();

/* <div class="my-message">
<div class="my-message-content">Hey! I know it, I
	know it for year. But I will do it, no
	matter what, or I die.</div>
</div> */


/* <div class="another-message">
	<div class="image"><img src="/assets/img/avatar.jpg" class="img-fluid"/></div>
	<div class="message-content">Hey! I know it, I
		know it for year. But I will do it, no
		matter what, or I die.
	</div>
</div> */

function anotherMessage(author, message) {
	let html =`<div class="another-message"><div class="message-content">${message}</div></div>`;
	return html;
}

function myMessage(message) {
	let html =`<div class="my-message"><div class="my-message-content">${message}</div></div>`;
	return html;
}



function sendMsg() {
	let message = document.getElementById("input-message").value;
	socket.emit(
		'message',
		{
			userName: globalVar.userName,
			groupName: globalVar.groupName,
			message: message
		}
	)
	document.getElementById("input-message").value = '';
}

function recvMsg(data) {
	let author = data.userName;
	let message = data.message;
	let messageBox = document.getElementById('message-box');
	console.log(data)
	if (author == globalVar.userName)
		messageBox.insertAdjacentHTML(
			'beforeend', myMessage(message));
	else
		messageBox.insertAdjacentHTML(
			'beforeend', anotherMessage(author, message));
}

socket.emit('hello', {
	userName: globalVar.userName,
	groupName: globalVar.groupName
});
socket.on('message', recvMsg)
