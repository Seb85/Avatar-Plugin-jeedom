'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


exports.default = function (state) {
	
	return new Promise(function (resolve, reject) {
		
		setTimeout(function(){ 
			if (state.debug) info('ActionDomotique'.bold.yellow);
			
			state.action = {
				module: 'jeedom'
			};
			resolve(state);
		}, 500);	
		
	});
};
