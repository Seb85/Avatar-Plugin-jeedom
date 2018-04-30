Jeedom
=========

Ce plugin est un add-on pour le framework [Avatar](https://github.com/Spikharpax/Avatar-Serveur)

Controler la box domotique Jeedom


## Installation

- Dézippez le fichier `Avatar-Plugin-jeedom-Master.zip` dans un répertoire temporaire
- Copiez le répertoire `Jeedom` dans le répertoire `Avatar-Serveur/plugins`


## Configuration
La configuration du plugin se fait dans le fichier `Avatar-Serveur/plugins/jeedom/jeedom.prop` et `Avatar-Serveur/plugins/jeedom/jeedom.js`

jeedom.prop :
Inscrire l'api key et l'adresse IP de votre Jeedom.

jeedom.js :
Modifier dans tblcommand les requetes de votre choix :
Scenario : requestJeedomScenario
Commande : requestJeedomCmd
Ainsi que les réponses.
   
## Versions
Version 1.1
- Passage des requetes JSON en HTTP
- Fini les ID d'interaction, les ID de scénario et commande sont utiliser

Version 1.0
- Version Released
