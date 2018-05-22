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
		switchLight : function() { requestJeedomCmd(data.client, Config.modules.Jeedom.clients[room][data.action.value])},
		PC : function(){ requestJeedomScenario(data.client, Config.modules.Jeedom.clients[room][data.action.value], "Votre ordinateur s'allume.")}
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

function requestJeedomScenario (client, value, txt) {
	
	
	var uri = _JeedomConf.ip + _JeedomConf.pathJeedomApi + '?apikey=' + _JeedomConf.apikey + '&type=scenario&id=' + value + '&action=start';
	
	info('uri:', uri.yellow);
	
	request({
		url: uri,
		method: 'POST'
	},
	function(state) {
		if (txt) {
			Avatar.speak(txt, client, function() {
				Avatar.Speech.end(client);
			});
			} else {
			var answer = !state;
			Avatar.Speech.end(client);
			info(answer);
		}
		},
	function (err, response) {
		if (err || response.statusCode != 200) {
			info('Error: Callback request'.red);
			return callback(false);
		}
	   
	});
	
}

function requestJeedomMute (client, value, txt) {
	
	
	var uri = _JeedomConf.ip + _JeedomConf.pathJeedomApi + '?apikey=' + _JeedomConf.apikey + '&type=scenario&id=' + value + '&action=start';
	
	info('uri:', uri.yellow);
	
	request({
		url: uri,
		method: 'POST'
	},
	function(state) {
		if (txt) {
			Avatar.speak(txt, client, function() {
				Avatar.Speech.end(client);
			});
			} else {
			var answer = !state;
			info(answer);
		}
		},
	function (err, response) {
		if (err || response.statusCode != 200) {
			info('Error: Callback request'.red);
			return callback(false);
		}
	   
	});
	
}

function requestJeedomCmd (client, value, txt) {
	
	
	var uri = _JeedomConf.ip + _JeedomConf.pathJeedomApi + '?apikey=' + _JeedomConf.apikey + '&type=cmd&id=' + value;
	
	info('uri:', uri.yellow);
	
	request({
		url: uri,
		method: 'POST'
	},
	function(state) {
		if (txt) {
			Avatar.speak(txt, client, function() {
				Avatar.Speech.end(client);
			});
			} else {
			var answer = !state;
			Avatar.Speech.end(client);
			info(answer);
		}
		},
	function (err, response) {
		if (err || response.statusCode != 200) {
			info('Error: Callback request'.red);
			return callback(false);
		}
	   
	});
	
}
