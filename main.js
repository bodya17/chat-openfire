var BOSH_SERVICE = 'http://localhost:7070/http-bind/'
var connection = null;

function log(msg) 
{
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	log('ECHOBOT: Send a message to ' + connection.jid + 
	    ' to talk to me.');

	connection.addHandler(onMessage, null, 'message', null, null,  null); 
	connection.send($pres().tree());
    }
}

function onMessage(msg) {
    var to = msg.getAttribute('to');
	var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
	log(`New message from ${from}
		Text: ${Strophe.getText(elems[0])}
	`)
    return true;
}

function sendMessage() {
	// debugger;
	const recipient = document.querySelector('#recipient').value || 'user@localhost'
	console.log('sending a message to: ', recipient)
	const text = document.getElementById('message-text').value;
	console.log(text)
	var reply = $msg({to: recipient, type: 'chat'})
            .c('body').t(text)
	connection.send(reply.tree());
}

document.querySelector('#send')
	.addEventListener('click', sendMessage)

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);

    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';

	    connection.connect($('#jid').get(0).value,
			       $('#pass').get(0).value,
			       onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
});
