var request = require('request');

require('colors');
var _JeedomConf;

exports.init = function(){
	
	// table of properties
	 _JeedomConf = {
		pathJeedomApi:  Config.modules.Jeedom.php || '',
		apikey: Config.modules.Jeedom.apikey || '',
		ip : Config.modules.Jeedom.addrJeedom || ''
	};
	
}
  

  
exports.action = function(data, callback){
	
	if (!_JeedomConf.pathJeedomApi || !_JeedomConf.apikey || !_JeedomConf.ip ) {
		error("Jeedom:", "La configuration de Jeedom est manquante".red);
		return callback();
	}
	
	var tblCommand = {
		// Allume/éteint par pièce
		switchLight : function() { requestJeedomAction(data.client, Config.modules.Jeedom.clients[room][data.action.value])},
		scenario : function() {requestJeedomAction(data.client, Config.modules.Jeedom.clients[room][data.action.value])}
	};
	
	var room = setClient(data);
	info("Jeedom command:", data.action.command.yellow, "From:", data.client.yellow, "To:", room.yellow);
	tblCommand[data.action.command]();
	callback();
}


var setClient = function (data) {
	
	// client direct (la commande provient du client et est exécutée sur le client)
	var client = data.client;	
	// Client spécifique fixe (la commande ne provient pas du client et n'est pas exécutée sur le client et ne peut pas changer)
	if (data.action.room) 
		client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	// Client spécifique non fixe dans la commande HTTP (la commande ne provient pas du client et n'est pas exécutée sur le client et peut changer)
	if (data.action.setRoom) 
		client = data.action.setRoom;
	
	return client;
}



function requestJeedomAction (client, value, txt) {
	
	var jsonrpc = getJsonRpc(value);
	jsonrpc.method = 'execute';
	jsonrpc.params.id = value;
	
	sendJsonRequest(jsonrpc, function(state) { 
		if (txt) {
			var answer = !state ? "je ne suis pas arrivé à exécuter l'action" : txt;
			Avatar.speak(answer, client, function() {
				Avatar.Speech.end(client);
			});
		} else {
			var answer = !state ? "je ne suis pas arrivé à exécuter l'action" : "Command sent";
			info(answer);
		}
	});

}



function getJsonRpc(value) {
	
	var jsonrpc = {};
	jsonrpc.id = value;
	jsonrpc.params = {};
	jsonrpc.params.apikey = _JeedomConf.apikey;
	jsonrpc.params.plugin = 'sarah';
	jsonrpc.jsonrpc = '2.0';
	
	return jsonrpc;
}



function sendJsonRequest(_jsonrpc, callback){
	
	var uri = _JeedomConf.ip + _JeedomConf.pathJeedomApi;
	
	info('uri:', uri.yellow);
	info('rpc:', _jsonrpc);
	
	request({
		url: uri,
		method: 'POST',
		form: {request: JSON.stringify(_jsonrpc)}
	},
	function (err, response, json) {
		if (err || response.statusCode != 200) {
			info('Error: Callback request'.red);
			return callback(false);
		}
		
		callback(true);
	   
	});
	
}