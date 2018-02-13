'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../node_modules/ava-ia/lib/helpers');

var _ = require('underscore');

exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {
		var match, command, periph;
		var periphs = Config.modules.Jeedom.intentRules;
		
		for (var i=0; i<periphs.length && !match; i++) {
			 for (var rule in Config.modules.Jeedom[periphs[i]]) {
				 if (rule != 'command') {
					match = (0, _helpers.syntax)(state.sentence, Config.modules.Jeedom[periphs[i]][rule]); 
					if (match) {
						command = (Config.modules.Jeedom[periphs[i]].command) ? Config.modules.Jeedom[periphs[i]].command : rule;
						break;
					}
				 }
			 }
		}
		
		var room = Avatar.ia.clientFromRule (state.rawSentence);
	
		setTimeout(function(){ 			
			if (match && rule) {
					
				if (state.debug) info('ActionJeedom'.bold.yellow, 'action:', command.yellow);
				
				state.action = {
					module: 'Jeedom',
					command: command,
					value: rule,
					room: room		
				};
			}		
				
			resolve(state);	
		}, 500);
	});
};
