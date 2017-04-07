'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _helpers = require('../../node_modules/ava-ia/lib/helpers');
exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {
		
		
		var match;
		for (var rule in Config.modules.jeedom.rules) {
			match = (0, _helpers.syntax)(state.sentence, Config.modules.jeedom[45]);
			if (match) break;
			
		setTimeout(function(){ 
			if (state.debug) info('ActionDomotique'.bold.yellow, 'action:', 45.yellow);
			state.action = {
				module: 'jeedom',
				command: 45
			};
			resolve(state);
		}, 500);	
		
	});
};
