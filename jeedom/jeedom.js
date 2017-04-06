var Promise = require('q').Promise;
var request = require('request');

require('colors');

exports.action = function (data, callback) {

    info("Jeedom from:", data.client.yellow);
    var debug = false;

    /************************************************************************************************
     ** require list
     ************************************************************************************************/
    var EventEmitter = require('events').EventEmitter; //

    /************************************************************************************************
     ** Path list
     ************************************************************************************************/
    var pathJeedomApi = '/core/api/jeeApi.php';

    /************************************************************************************************
     ** callbackReturn method
     ************************************************************************************************/
    var callbackReturn = new EventEmitter();

    /***************************************************
     ** @description Set the tts message
     ** @function tts
     ** @param message string
     ***************************************************/
    callbackReturn.on('tts', function (message) {
        console.log(message);
        callback({tts: message});
    });

    /************************************************************************************************
     ** jeedomProcess method
     ************************************************************************************************/
    var jeedomProcess = new EventEmitter();

    /***************************************************
     ** @description Send interaction request to jeedom
     ** @function execute
     ***************************************************/
    jeedomProcess.on('execute', function () {
        console.log('--------EXECUTE--------');
        var jsonrpc = getJsonRpc();
        jsonrpc.method = 'execute';
        for (var i in data) {
            jsonrpc.params[i] = data[i];
        }
        sendJsonRequest(jsonrpc, readReturn);
    });
	
	/***************************************************
     ** @description Ask user
     ** @function ask
     ***************************************************/
    jeedomProcess.on('ask', function () {
        console.log('--------ASK--------');
		console.log(data);
		response_raw = JSON.parse(data.response);
		response = {};
		for(var i in response_raw){
			response[response_raw[i]] = response_raw[i];
		}
        SARAH.askme(data.ask, response, data.timeout * 1000, function(answer, end){
			console.log('Answer : ' + answer);
			var jsonrpc = getJsonRpc();
			jsonrpc.method = 'askResult';
			jsonrpc.params['id'] = data.id;
			jsonrpc.params['response'] = answer;
			sendJsonRequest(jsonrpc, end);
		});
    });
	
	/***************************************************
     ** @description sendJsonRequest
     ** @function sendJsonRequest
     ***************************************************/

	function sendJsonRequest(_jsonrpc, callback){
        var adresse = config.addrJeedom;
        if (adresse.indexOf('http://') < 0) {
            adresse = 'http://' + adresse;
        }
        console.log('Adresse : ' + adresse + pathJeedomApi);
		console.log(_jsonrpc)
        var request = require('request');
        request({
            url: adresse + pathJeedomApi,
            method: 'POST',
            form: {request: JSON.stringify(_jsonrpc)}
        },
        function (err, response, json) {
            if (err || response.statusCode != 200) {
                console.log('Error: Callback request');
                callbackReturn.emit('tts', 'Echec de la requete à jeedom');
            }
			result = checkReturn(JSON.parse(json));
			if(result === false){
				return;
			}
            console.log('-------REQUEST SUCCESS-------');
			callback(JSON.parse(json)['result']);
        });
    }


    /************************************************************************************************
     ** function
     ************************************************************************************************/
	 
    /***************************************************
     ** @description Generate json rpc for jeedom
     ** @function getJsonRpc
     ** @return string json
     ***************************************************/
    function getJsonRpc() {
        var jsonrpc = {};
        jsonrpc.id = data.id;
        jsonrpc.params = {};
        jsonrpc.params.apikey = Config.modules.jeedom.apikeyJeedom;
        jsonrpc.params.plugin = 'sarah';
        jsonrpc.jsonrpc = '2.0';
        return jsonrpc;
    }

    /***************************************************
     ** @description ?
     ** @function isset
     ** @return ?
     ***************************************************/
    function isset() {
        var a = arguments,
                l = a.length,
                i = 0,
                undef;

        if (l === 0) {
            throw new Error('Empty isset');
        }
        while (i !== l) {
            if (a[i] === undef || a[i] === null) {
                return false;
            }
            i++;
        }
        return true;
    }

    /************************************************************************************************
     ** Main
     ************************************************************************************************/
    console.log('Plugin "jeedom" for Sarah starting');
    config = Config.modules.jeedom;
	if (!config.apikeyJeedom){
		console.log("Clef api manquante");
		callback({'tts' : 'Clef api manquante'});
		return;
	}
	console.log(data);
	if(data.method == 'execute'){
		jeedomProcess.emit(data.method);
	}else{
		callback();
	}
};
