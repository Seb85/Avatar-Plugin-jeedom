var request = require('request');

require('colors');

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
	
	var room;
	var tblCommand = {
		// Allume/éteint par pièce
		switchLight : function() { 
			switchLight(room, Config.modules.Jeedom.clients[room][data.action.value]);
		},
		resetSwitch : function(){
			// test avec une règle "occupe-toi de la lumière" dans "rule" du prop
			Avatar.speak("ok, je m'occupe de la lumière", room, function() {
				Avatar.Speech.end(room);
			});
		}
	};
	
	// met dans la variable room le client concerné par la commande et qui peut être mappé
	// Le speak sera redirigé automatiquement vers le client réel ou virtuel
	room = (data.action.room && data.action.room != 'current') ? data.action.room : data.client;
	// Affiche le nom du client concerné par l'action dans From
	info("Jeedom command:", data.action.command.yellow, "From:", room.yellow);
	
	tblCommand[data.action.command]();
	callback();
}




function switchLight (client, value) {
	
	var jsonrpc = getJsonRpc(value);
	jsonrpc.method = 'execute';
	jsonrpc.params.id = value;
	
	sendJsonRequest(jsonrpc, function(state) { 
	
		var answer = !state ? "je ne suis pas arrivé à exécuter l'action" : Config.modules.Jeedom.answers;
		
		Avatar.speak(answer, client, function() {
			Avatar.Speech.end(client);
		});

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
