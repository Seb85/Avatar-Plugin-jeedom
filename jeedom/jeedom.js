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
		    // room: la pièce où l'ordre est exécutée
			// data.client: là où l'action a été exécutée
			switchLight(data.client, Config.modules.Jeedom.clients[room][data.action.value]);
		},
		resetSwitch : function(){
			// test avec une règle "occupe-toi de la lumière" dans "rule" du prop
			Avatar.speak("ok, je m'occupe de la lumière dans la pièce " + room, data.client, function() {
				Avatar.Speech.end(data.client);
			});
		}
	};
	
	info("Jeedom command:", data.action.command.yellow, "From:", data.client.yellow);
	room = ((data.action.room && data.action.room != 'current') ? data.action.room : data.client).toLowerCase();

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

