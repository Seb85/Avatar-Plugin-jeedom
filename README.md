Jeedom
=========

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Controler la box domotique Jeedom


## Installation

- Dézippez le fichier `Avatar-Plugin-jeedom-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `jeedom` dans le répertoire `Avatar-Serveur/plugins`
- Copiez le fichier `intents/intent.jeedom.js`dans le répertoire `Avatar-Serveur/ia/intents/`
- Copiez le fichier `actions/action.domotique.js` dans le répertoire `Avatar-Serveur/ia/actions/`
- Editez le fichier `Avatar-Serveur/ia/actions/index.js`, allez à la fin du fichier et juste avant `function _interopRequireDefault(obj)` ajoutez les lignes suivantes:

```javascript
var _actionJeedom = require('./action.domotique');

Object.defineProperty(exports, 'domotique', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_actionJeedom).default;
  }
});

// Fin du fichier...
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
```

- Editez le fichier `Avatar-Serveur/ia/intents/index.js`, allez à la fin du fichier et juste avant `function _interopRequireDefault(obj)` ajoutez les lignes suivantes:

```javascript

var _intentJeedom = require('./intent.jeedom');

Object.defineProperty(exports, 'jeedom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_intentJeedom).default;
  }
});

// Fin du fichier...
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
```

- Editez le fichier `Avatar-Serveur/ia/index.js`
	- Ajoutez dans l'import des intents, l'intention `jeedom`
	- Ajoutez dans l'import des actions, l'action `domotique`
	- Ajoutez dans la fonction export.intent(), l'association de l'intention-action

```javascript
import { jeedom, tvChannels, tvActions, music, weather, hour,  manageAvatar, shoppingList, translate, lastAction, intentEnd} from './intents';
import { domotique, freeTV, freeRules, Sonos, forecastMsn, forecastYahoo, worldHour, avatarRules, shopping, translator, backupAction, actionEnd} from './actions';


exports.intent = function () {

	// Configure the intents
	ava
	 .intent(translate, translator)
	 // Déclaration blague CI-DESSOUS !
	 .intent(jeedom, domotique)
	 .intent(hour, worldHour)
	 .intent(weather, [forecastYahoo, forecastMsn])
	 .intent(music, Sonos)
	 .intent(manageAvatar, avatarRules)
	 .intent(shoppingList, shopping)
	 .intent(lastAction, backupAction)
	 .intent(intentEnd, actionEnd)  // Toujours à la fin, controle si une règle est passée
}
```


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/jeedom/jeedom.prop`

Inscrire l'api key et l'adresse IP de votre Jeedom.

Les réponses des interactions se font dans la propriété "answers". Peut etre vide si vous ne souhaitez pas de réponse.

Ajouté vos différents clients avatar dans la propriété "clients", puis vos commandes en fonction des propriétés "rules" et "manageLight".
   
## Versions
Version 1.0 
- Version Released
