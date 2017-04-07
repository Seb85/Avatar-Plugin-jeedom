'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../node_modules/ava-ia/lib/helpers');

exports.default = function (state, actions) {
	  
	if (state.isIntent) return (0, _helpers.resolve)(state);
	 
	for (var rule in Config.modules.jeedom.rules) {
		var match = (0, _helpers.syntax)(state.sentence, Config.modules.jeedom.rules[rule]); 
		if (match) break;
	}

	if (match) {
		if (state.debug) info('IntentJeedom'.bold.green, 'syntax:',((match) ? 'true'.green : 'false'.green));
		state.isIntent = true;
		return (0, _helpers.factoryActions)(state, actions);
	} else 
		return (0, _helpers.resolve)(state);
	
  
};
