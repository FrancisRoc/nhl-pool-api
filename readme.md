# Nom de votre projet

## À ajuster dans votre projet!

- Ajuster ce `readme` avec les sections et informations spécifiques à votre projet. Notez cependant qu'il
y a plusieurs sections que vous pouvez conserver car elles s'appliquent à tout projet ayant été débuté en
utilisant le générateur.

- Modifier les informations contenues dans `package.json` : le "name", la "description", les "keywords", etc.

- Ajuster les configs dans les fichiers *`/config/[ENVIRONMENT].yaml`*, particulièrement celles sous la clé "`project`".


-------------------------

## Configuration suggérée pour travailler avec [*VSCode*](https://code.visualstudio.com/) 
Utilisez les fichiers sous `/.local/vscode_suggested_settings`. Vous pouvez tout simplement
copier le répertoire "`.vscode`" fourni à la racine du projet... C'est ce que nous recommendons
de faire avant toute chose. Plusieurs parties de la documentation considère que ces configs
sont actives.

Installez l'extension [EditorConfig](http://editorconfig.org) pour
VSCode (`[CTRL]-[P]` + "`ext install EditorConfig`").  
Cette extension appliquera les règles décrites dans le fichier `.editorconfig` situé à la racine du projet.

-------------------------

## Configuration obligatoire, peu importe l'éditeur

Veuillez installer l'extension [EditorConfig](http://editorconfig.org) de votre IDE/Éditeur de texte pour que
soient appliquées les règles décrites dans le fichier `.editorconfig` situé à la racine du projet.

- Les sauts de ligne sont standardisés à "`\n`". Pas de "`\r\n`".
- Tous les fichiers doivent être encodés en `UTF-8` (sauf exception justifiable).
- L'indentation est de `4 espaces`, aucune tab.
- Autrement, le formattage doit être le même que celui appliqué par défaut par VSCode. Les règles de formattage pour
`Typescript` sont définies dans el fichier `tslint.json` situé à la racine du projet et les options de compilation
dans le fichier `tsconfig.json`.

-------------------------

## Configuration variée

### Git - autocrlf

Selon la manière dont vous avez installé Git sur votre poste, il est possible qu'une
certaine configuration soit désagréable : la configuration "`core.autocrlf`" dit à Git s'il doit
modifier ou non les sauts de ligne d'un projet lors d'un clone. Si votre config est à `true`, et
que vous êtes sur Windows, chaque fichier d'un projet cloné et basé sur ce gabarit aura ses sauts de ligne 
convertis à `\r\n` automatiquement... Mais lorsque ces fichiers seront par la suite ouverts dans VSCode, ils seront
automatiquement *re-modifiés* à `\n` par VSCode (car c'est le standard désiré et configuré)! 
Bref, sans même que vous ayez apporté des modifications volontairement, un fichier ouvert sera modifié et il vous 
sera demandé si vous désirez le sauvegarder! Pour cette raison, nous recommendons de mettre cette 
configuration Git à `false` :

*`git config --global core.autocrlf false`*

Si vous changez cette configuration tel que suggérée, vous devrez *re-cloner* le projet car les sauts de ligne 
auront déjà été modifiés par Git.

### Longueur des chemins de fichiers sur Windows

Sur Windows, les fichiers avec des paths trop longs peuvent être problématiques. Voici les deux choses à faire pour
régler le problème :

- Activer la configuration "*core.longpaths*" dans Git :  
  *`git config --global --add core.longpaths true`*

- Avec Windows 10 (règle le problème pour de bon pour Windows) :  
  [Activer les chemins long](https://www.google.com/?gfe_rd=cr&gws_rd=ssl,cr&fg=1#q=windows+10+enable+long+paths)

### Node

Soyez certain d'avoir une [version *récente*](https://nodejs.org/en/download/) de Node d'installée. 

Il est également recommandé d'installer *Gulp* globalement. Ceci permet de lancer les
commandes plus rapidement qu'en passant par les scripts *npm* qui utilisent Gulp de toute manière.

*`npm install -g gulp-cli`* 

Nous suggérons aussi que toutes les dépendances ajoutées au fichier `package.json` aient *une version fixe*. Par
exemple, utiliser *`"knex": "0.12.6"`* et non *`"knex": "~0.12.6"`* ou `"knex": "^0.12.6"`. Pour que les versions des dépendances
soient non variables par défaut, il est possible de configurer `npm` globalement avec cette commande :

*`npm config set save-prefix=`* 

Les dépendances installées par la suite seront à une version fixe, et n'auront pas "`~`" ou "`^`" comme préfix.

Notez cependant que même ici les versions des dépendances *transitives* ne seront pas garanties! Pour adresser
ce problème, il faudrait explorer :

- [Yarn](https://yarnpkg.com/en/)
ou
- [npm-lockdown](https://github.com/mozilla/npm-lockdown/) / [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap)  




### Dépendances du projet

Installez les dépendances du projet :

*`npm install`*  
ou  
*`sudo -E npm install`*



### Erreurs possibles lors d'un "`npm install`" :

- Problème de firewall.
Au moment où vous lirez cette documentation il se
peut que cela ait été réglé, mais nous avons présentement quelques problèmes avec nos règles de firewall et
les appels SSL effectués par `npm`. Voici une [page Confluence](https://villemontreal.atlassian.net/wiki/pages/viewpage.action?pageId=39404786) relative à ce problème.
La solution 100% fonctionnelle, pour le moment, est de faire une demande d'exception `FiltreUrlNoHTTPsInspec` au centre de service.
Autrement, vous *aurez* des problèmes lors de l'installation d'un projet démarré en utilisant ce générateur, particulièrement lors 
de l'installation des dépendances reliées à Oracle et SQLite.

- Erreurs de permissions.  
Tentez de lancer la commande avec "`sudo`" ou en tant qu'administrateur.


- Erreur relative à SQLite.  
Vous pouvez tenter un "`npm uninstall sqlite3`" suivi d'un "`npm uninstall sqlite3`" pour mieux cerner le problème. En général,
un problème avec l'installation de SQLite est relié à notre firewall.

-------------------------

## Commandes disponibles pour l'application

Les scripts *npm* ne sont que des indirections vers des commandes *Gulp*, qui
peuvent être lancées directement si vous avez installé Gulp de manière globale. 
Chaque commande a ainsi plus d'une manière d'être lancée.

- Pour lancer l'application *sans mode debug* :   
*`gulp start`*  
*`npm start`*  

- Pour lancer l'application en mode debug :  
*`voir la section "Déboguage dans VSCode" plus bas!`*

- Pour transpiler le TypeScript :  
*`gulp compile`*  
*`gulp c`*  
*`npm run compile`*  

- Pour supprimer les fichiers *.js* et *.js.map* générés par la transpilation :  
*`gulp clean`*  
*`npm run clean`*  

- Pour lancer les tests (units et intégration) :  
*`gulp test`*  
*`npm test`*   

- Pour lancer les tests Cucumber :  
*`gulp test-features`*   
*`npm run test-features`*

- Pour lancer les tests de charge (load) :  
*`gulp test-load`*  
*`npm run test-load`*

- Pour uniquement lancer Swagger Editor. Notez qu'un tel éditeur en mode "standalone" sera lancé sur un port 
différent de celui utilisé par l'application :  
*`gulp editor`*  
*`npm run editor`*

- Pour lancer la validation de l'application :  
*`gulp validate`*  
*`npm run validate`*

Notez que, par défaut, toutes les commandes lancent premièrement la compilation (transpilation) 
de Typescript vers Javascript. En utilisant Gulp directement, vous pouvez cependant passer le
paramètre "`--nc`" (`n`o `c`ompilation) à la fin de la commande pour éviter cette compilation,
si elle n'est pas souhaitée. Par exemple :

- *`gulp start --nc`*  

-------------------------
## Infos sur le projet

Ces pages HTML ne sont disponibles qu'en local, lors du développement. Elles fournissent des informations sur
le projet et son développement.

- [http://localhost:12345/](http://localhost:12345/) : Informations générales sur le projet
- [http://localhost:12345/readme](http://localhost:12345/readme) : Le fichier "`readme.md`", converti en HTML.
- [http://localhost:12345/open-api](http://localhost:12345/open-api) : Hyperliens vers les endpoints reliés à Open API.
- [http://localhost:12345/health](http://localhost:12345/health) : Hyperliens vers les endpoints reliés au status de l'application.
- [http://localhost:12345/metrics](http://localhost:12345/metrics) : Hyperliens vers les endpoints reliés aux statistiques de l'application.

-------------------------
## Les Endpoints par défaut du gabarit

**Note Importante :** ces URLS sont valides si vous utiliser le fichier de configuration "`default.yaml`" ou "`development.yaml`" par
défaut! Donc en local ou sur l'envionnement "development"... Sur d'autres environnements, vous devrez ajuster le host et le `domainPath`!
À ce sujet, assurez-vous de lire la section portant sur la configuration...

Notez que le *path* d'un endpoint est composé de : 

- La `racine` selon le type de endpoint (peut présentement être "*/api*", "*/documentation*" ou "*/diagnostics*")
- Le `domain path` (le domaine d'affaire, nombre de tokens variable)
- Le `path specifique au endpoint` (débutant par sa version!)


### Open API / Swagger
- [http://localhost:12345/documentation/some/business/domain/v1/ui](http://localhost:12345/documentation/some/business/domain/v1/ui) : Swagger UI (semble problématique avec certaines version de IE, utilisez un autre navigateur)
- [http://localhost:12345/documentation/some/business/domain/v1/editor](http://localhost:12345/documentation/some/business/domain/v1/editor) : Swagger Editor  
- [http://localhost:12345/documentation/some/business/domain/v1/specification](http://localhost:12345/documentation/some/business/domain/v1/specification) : Le fichier de specs Open API (YAML)  

### Diagnostics

- [http://localhost:12345/diagnostics/some/business/domain/v1/ping](http://localhost:12345/diagnostics/some/business/domain/v1/ping) : Retourne le texte "pong" et un code statut 200
- [http://localhost:12345/diagnostics/some/business/domain/v1/info](http://localhost:12345/diagnostics/some/business/domain/v1/info) : Retourne des informations sur le services, tel que 
le nom, la version, la date de publication, le code de projet...


-------------------------

## Déboguage dans [*VSCode*](https://code.visualstudio.com/) 

### *Méthode #1 : avec autoreload*

Cette méthode recompile automatiquement les fichiers TypeScript lorsqu'ils sont modifiés
et relance automatiquement l'application...

- Ouvrir le terminal et lancer :  
*`gulp debug`*  
Ceci va lancer l'application en mode *debug*, en utilisant [nodemon](https://nodemon.io/) et le flag "`--debug`". 

- Assurez-vous que, dans le panel *Debug* de VSCode, la configuration sélectionnée est
"*Local debugger*".

- Appuyez sur `[F5]`. Ceci va démarrer le débogueur de VSCode qui s'attachera à l'application.

À partir de ce moment, si vous modifiez un fichier TypeScript, il sera automatiquement recompilé,
l'application sera automatiquement redémarrée et le débogueur sera toujours fonctionnel! Vous
pouvez aussi ajouter et supprimer des breakpoints.

Pour arrêter ce mode debug avec autoreload, faite un `[CTRL]-[C]` dans le terminal.

### *Méthode #2 : sans autoreload*

Si vous n'aimez pas cette manière de travailler avec autoreload, vous pouvez toujours continuer à déboguer de manière
régulière, c'est à dire :

- Vous assurez que dans le panel *Debug* de VSCode, la configuration sélectionnée est
"*Launch the application*" (et non "*Local debugger*").

- Appuyez sur `[F5]`.

Avec cette manière de travailler, vous devez relancer l'application manuellement lorsque vous faites des
modifications aux fichiers TypeScript. Par exemple :

- `[SHIFT]-[F5]` - Arrête l'application   
- `[F5]` - Recompile les fichiers TypeScript et relance l'application  

Note : Dans le fichier `.local/vscode_suggested_settings/.vscode/launch.json` suggéré, *`"preLaunchTask": "tsc"`*
est utilisée dans la configuration "*Launch the application*" et c'est pourquoi la compilation des fichiers
TypeScript est effectuée automatiquement lorsque cette configuration est lancée par `[F5]`.

-------------------------
# Docker

## Installation Docker (Mac OS / Windows 10 / Linux)

- Installez Docker : [Windows 10](https://docs.docker.com/docker-for-windows/) / 
[Mac OS](https://docs.docker.com/docker-for-mac/) / [Linux](https://docs.docker.com/engine/installation/)

- That's it!

## Installation Docker Toolbox (Windows 7)

- Installez [Docker Toolbox](https://www.docker.com/products/docker-toolbox).

- Assurez-vous que votre projet (que nous appellerons ici "`mon-api-node`") est sous votre répertoire 
"*%userprofile%*"! Par exemple : *`C:\Users\[USER]\dev\mon-api-node`*  
Le répertoire "*%userprofile%*" est mounté automatiquement dans la machine virtuelle
lorsqu'on travaille avec Docker Toolbox et nous évite de devoir mounter quoique ce soit manuellement. 

Puis :

- Démarrez le client Docker dans un terminal *git-bash*. Par exemple :  
*`cd "C:\Program Files\Docker Toolbox"`*  
et  
*`"C:\Program Files\Git\bin\bash.exe" --login -i "C:\Program Files\Docker Toolbox\start.sh"`*  
(Note : Personnellement, j'aime me faire un fichier "`dockerclient.bat`" contenant ces commandes. Je mets ce fichier
dans mon `PATH` et je peux par la suite lancer le client Docker uniquement avec la commande "*`dockerclient`*")

## Lancer l'application avec Docker

- Allez dans le répertoire du projet (notez qu'avec Docker Toolbox, "`C:`" est accessible en utilisant "`/c/`"). Par exemple :  
*`cd /c/Users/[USER]/dev/mon-api-node`*

- Créez une image Docker pour votre projet (Ajustez le fichier "`Dockerfile`" si requis et n'oubliez pas le "." à la fin de la commande suivante) :  
*`docker build -t mon-api-node .`*  

- Finalement, pour lancer l'application :  
*`docker run -d -p 12345:12345 -v $(pwd)/log:/mtl/app/log mon-api-node`*

Ceci va automatiquement démarrer l'application (la commande "*`gulp start`*" sera automatiquement lancée). 
On mounte "`$(pwd)/log`" à "`/mtl/app/log`" pour que les logs soient générés à l'extérieur du container.

Vous pouvez également mounter un fichier de configurations (voir [node-config](https://github.com/lorenwest/node-config) pour plus 
de détails) :    
*`docker run -d -p 12345:12345 -v $(pwd)/log:/mtl/app/log -v $(pwd)/production.yaml:/mtl/app/config/production.yaml mon-api-node`*

## Déboguer l'application roulant dans Docker

Pour déboguer l'application roulant dans Docker Toolbox depuis VSCode, créez l'image Docker tel que décrit à la
section précédante puis :

- Créez un container et entrez dedans avec *bash*, en exposant le port "5858" en plus du port "12345" :  
*`docker run --rm -p 12345:12345 -p 5858:5858 -ti mon-api-node /bin/bash`*

- Lancez le mode debug :  
*`gulp debug`*

À ce moment, l'application sera démarrée et un socket attendra la connection d'un débogueur sur le port *5858*.

- Dans votre VSCode local, dans l'onglet "*Debug*", assurez-vous que la configuration "*`Docker Debugger`*" est sélectionnée.

- Appuyez sur "`[F5]`".

Vous pouvez maintenant ajouter des breakpoints dans le code, lancer une requête (depuis un navigateur, Postman, etc.)
et déboguer dans VSCode. Par exemple : "`http://192.168.99.100:12345/test/v1/upper/mtl`". Il se peut que l'IP de votre machine virtuelle 
ne soit pas "*192.168.99.100*". Pour valider cet IP, lancez "*`docker-machine ip`*" dans un terminal Windows régulier 
(pas en utilisant le client Docker)... S'il differt, mettre à jour la configuration "*`Docker Debugger`*" de votre VSCode.

Finalement, notez que vous ne pouvez *pas* effectuer de modifications à vos fichiers, dans VSCode, lorsque vous déboguez de cette manière...
L'application roule en fait dans le container Docker, avec sa copie des fichiers.

## Mounter les fichiers locaux de l'application

**Notez que de mounter les fichiers locaux de l'application dans Docker Toolbox sur Windows 7 ne fonctionne pas parfaitement!**

Les principaux problèmes que nous avons rencontrés en tentant de mounter les fichiers locaux de l'application en lançant le
container Docker sur Windows 7 sont :

- La dépendance "`sqlite3`" cause un problème lorsque les fichiers locaux sont mountés. Le path de certaines sous-dépendances est
trop long et le mélange Docker/Windows 7 n'aime pas trop (Windows 10 devrait régler ce problème). Il vous faut donc désinstaller cette dépendance :

*`npm uninstall sqlite3`*

Vous devrez aussi mettre la configuration "`configs.dataSources.localFile.clients.knex.enabled`" à "`false`" pour ne pas que la dépendance
ainsi supprimée ne cause de problème. L'exemple utilisant SQLite sera à ce moment désactivé, mais l'application pourra démarrer.



Une fois cela fait, vous pouvez tenter l'expérience de mounter vos fichiers locaux de l'application, ce qui permet de les modifier localement dans
votre IDE, et de voir le résultat directement dans l'application *roulant dans Docker*. Voici les étapes à suivre (en plus des 
particularités exposées çi haut) :

- Lancez un container Docker, en mountant les fichiers locaux de l'application à "*`/mtl/app`*", et entrez à l'intérieur avec *bash* :  
*`docker run --rm -p 12345:12345 -p 5858:5858 -ti -v $(pwd):/mtl/app mon-api-node /bin/bash`*

- Lancez l'application, en mode *debug*, depuis le container Docker :  
*`gulp debug`*  

L'application devrait maintenant être démarrée, en mode *debug* et vous devriez être en mesure de la déboguer tel qu'expliqué
à la section précédante "*Déboguer l'application roulant dans Docker*". Mais vous devriez en plus être en mesure de modifier vos fichiers
locaux, depuis VSCode, et l'application roulant dans Docker devrait alors être redémarrée automatiquement et utiliser les nouvelles
modifications.

-------------------------

## Développement

### Validation de l'application

Lorsqu'on démarre le serveur, l'application est automatiquement validée et ne démarrera tout simplement pas si des problèmes
sont trouvés! Une des validations effectuées est de s'assurer que le fichier de specs Open API de l'application ("*`open-api/open-api.yaml`*")
représente bien les routes de l'application. Pour cette raison, il est *obligatoire* de définir les routes à exposer dans l'API
dans le fichier "*`src/routes.ts`*". Ce fichier sera utilisé lors de la validation des routes.

À cause de cette même validation, lorsque vous créez une nouvelle route il faut *nécessairement* la définir à la fois dans "*`src/routes.ts`*"
et dans le fichier de specs *`open-api/open-api.yaml`*. L'application refusera de démarrer s'il manque quelque chose , mais il vous sera
en tout temps possible de rouler le *Swagger Editor*, pour vous aidez à mettre à jour le fichier de specs. Pour cela, il suffit de lancer :  

*`gulp editor`*

### Le décorateur "@autobind"

Lorsqu'une route est exécutée et donc une méthode d'un controlleur appellée, il faut être certain que la valeur
de la variable "*`this`*" soit la bonne si utilisée dans la méthode. Pour ce faire, il faut que la méthode 
*ait été bindée correctement* ([documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)). 
Nous voulons que "*`this`*" représente *l'instance du controlleur* à ce moment, ce qui n'est pas assuré en Javascript
(fait surprenant pour un développeur nouveau à ce langage!)

Le décorateur "`@autobind`" (fourni par la librairie [autobind-decorator](https://github.com/andreypopp/autobind-decorator)) s'occupe de binder 
correctement les méthodes d'une classe à son instance, sans que vous ayez à le faire manuellement. Il suffit de décorer les classes de vos controlleurs avec ce dernier.
Voir le controller [testController](https://bitbucket.org/villemontreal/generator-mtl-node-api/src/master/generators/app/templates/src/controllers/testController.ts) 
pour un exemple.

### Async/Await dans les controlleurs

Lorsqu'une erreur survient dans un controlleur, il faut tout le temps que le "`next(error)`" d'Express soit appelé pour que l'erreur 
soit gérée correctement et qu'une réponse soit retournée à la requête HTTP courante. Ceci est fait automatiquement par le gabarit si vous
suivez les instructions suivantes...

- Chaque route *doit* être déclarée dans le fichier *`src/routes.tc`*. Les routes déclarées dans ce fichier seront automatiquement wrappées 
  avec un *try/catch* appellant `next(error)` sans que cela doit être fait explicitement. Notez que vous pouvez *aussi* mettre un *try/catch* dans vos
  handlers et appeler le `next(error)` par vous-même! Le wrapper n'est qu'un filet de sécurité...

- Chaque handler défini dans un controlleur doit être spécifié comme étant *`async`*.

- Chaque appel asynchrone effectué dans un handler doit :

    - Soit être précédé du mot clé "*`await`*".
    - Soit être *retourné* en tant que Promise (donc précédé du mot clé "*`return`*")  

- Chaque handler doit aussi :
    1. Soit générer une réponse (bref, que les headers HTTP aient été envoyés à la sortie du handler)
    2. Soit appeler `next()`  
    3. Soit appeler `render()`  

    ... autrement, une erreur sera automatiquement retournée au client.





### Obtenir l'URL publique d'un endpoint

Lorsqu'une route est définie, seule une partie du path complet est spécifiée. Par exemple :
```typescript
{ method: HttpMethods.POST, path: "/v1/users", handler: testController.saveUser }
```
Pour obtenir l'URL publique menant à ce endpoint, vous devez utiliser la function *`createPublicUrl(...)`* fournie
dans le fichier "`src/utils/utils.ts`". Par exemple :
```typescript
 let url = utils.createPublicUrl("/v1/users", EndpointTypes.API);
```
L'url sera à ce moment *`"http://localhost:12345/api/some/business/domain/v1/users"`* (pour les configs par défaut et sur
l'environnement de développement). Il est important de spécifier le *type de endpoint* ("`EndpointTypes.API`" dans notre exemple) car ceci
modifie la racine du path final...

### Script non commité pour tests locaux

Si vous voulez lancer un script pour tester quelques parties de votre application, nous recommendons
un fichier "`src/test.ts`". Ce fichier précis est déjà ignoré dans Git alors il n'y a pas de danger de le commiter 
par mégarde. Nous fournissons un template exemple pour un tel fichier, à "`local/suggested_local_test_template/test.ts`", vous
pouvez tout simplement le copier à "`src/test.ts`".

Si vous utilisez VSCode, une "*launch configuration*" est fournie permettant de déboguer ce fichier :
"*`Debug the 'src/test.ts' file`*". Il suffit de sélectionner cette configuration dans le panel
"*Debug*" de VSCode, puis de faire un "*`[F5]`*" pour lancer le script en mode debug.

### Tests

Les tests vont à côté des fichiers testés, ont le même nom que ces derniers mais avec un suffix *`.test.ts`*.

Lorsque *`gulp test`* (ou *`npm test`*) est lancé, trois choses sont exécutées :
- La validation de `TSLint` (avec les règles définies dans "*`tslint.json`*"). Les tests vont *échouer* si le code ne respecte
pas ces règles. Notez aussi qu'il est possible que cette validaiton soit également effectuée par Jenkins un moment donné,
indépendemment du fichier "*`tslint.json`*" de l'application... Bref, ne modifier pas ce fichier! Vaut mieux que les tests
échouent sur votre poste avant que votre application ne soit poussée.
- La validation effectuée par "`src/appValidator.ts`". Pour le moment, ceci valide si les routes publiques de l'application sont est
sync avec ce qui est défini dans le fichier de specs Open API.
- Les tests unitaires et d'intégration eux-mêmes.

Finalement, notez qu'il est possible que la task "`tslint`" (qui est automatiquement lancée par *`gulp test`*), fasse ressortir des
erreurs de style *que VSCode ne trouve pas*! Par exemple, les règles demandant un "type checking" ne sont pas
automatiquement appliquées par VSCode, [pour le moment](https://github.com/Microsoft/vscode-tslint/issues/70).

### Varia

- Les constantes de l'application vont dans : */src/configs/constants.ts*
- Les configurations de l'application vont dans : */src/configs/configs.ts*.
- Les données requises par les tests vont sous : */tests/resources*.
- Les données *générées* par les tests vont sous : */test-data*. Ce répertoire est ignoré dans Git.

-------------------------

## Configurations de l'application et environnement

La librairie de configurations utilisée est [node-config](https://github.com/lorenwest/node-config).

Par défaut, l'application roule avec le type d'environnement "`development`". Pour spécifier un autre type d'environnement 
à utiliser, il faut utiliser la variable d'environnement "`NODE_ENV`". Autrement que de setter cette variable d'environnement
de manière permanente sur la machine, il est possible de démarrer l'application en utilisant un environnement spécifique par :

*`set NODE_ENV=acceptation&& gulp start`*  
(exemple pour environnement "acceptation". Notez qu'il n'y a pas d'espace après le nom de l'environnement.)

Les types d'environnements reconnus présentement sont : "`development`", "`acceptation`" et "`production`".

Les configurations sont spécifiées dans les fichiers `YAML` situés dans le répertoire
*`config`*, à la racine du projet :

- Le fichier *`default.yaml`* contient les configurations utilisées par défaut. Dans les autres fichiers, il possible
d'overrider ces configs par défaut.

- Le fichier `development.yaml` contient les configurations spécifiques à utiliser lorsque l'environnement est "development".
- Le fichier `acceptation.yaml` contient les configurations spécifiques à utiliser lorsque l'environnement est "acceptation".
- Le fichier `production.yaml` contient les configurations spécifiques à utiliser lorsque l'environnement est "production". Certaines
configurations (plus sensibles) sont vides et doivent être fournies dynamiquement lors du déploiement ou lors de l'exécution
de l'application. Voir la documentation de [node-config](https://github.com/lorenwest/node-config) pour apprendre comment effectuer ceci.
- Le fichier `local.yaml` n'est *pas* commité dans le controlleur de sources! Il est à utiliser en local, lors du développement.
Ses configurations vont overrider celles de tous les autres fichiers.

Notez qu'il est possible d'overrider les configurations par command line ou en variables d'environnement réguliers. Voir la documentation de
[node-config](https://github.com/lorenwest/node-config) à ce sujet!

-------------------------

## Gulp
Gulp est utilisé pour lancer les différentes tâches. Ce sont d'ailleurs des tâches Gulp
qui sont utilisées comme scripts dans `package.json`.

Le fichier principal de Gulp, `gulpfile.js` n'est qu'une indirection permetant
de définir les tâches Gulp en *TypeScript* au lieu de Javascript. 
Les tâches Gulp sont en fait définies dans `gulpcore.ts`

Il y a une tâche un peu différente cependant : "*compile*". Cette tâche est exécutée directement
dans le fichier `gulpfile.js`, en Javascript. Ceci est compréhensible puisque c'est la transpilation
que "compile" effectue qui permet que les autres tâches puissent être écrites en TypeScript!

Il semble que [gulpclass](https://github.com/pleerock/gulpclass) ne soit
pas une meilleure solution que celle que nous proposons car, bien qu'une technique y 
est suggérée pour transpiler le fichier `gulpcore.ts` lui-même, si des *imports* sont 
requis dans ce fichier, ça ne fonctionnera pas car les *dépendances* ne sont pas 
nécessairement transpilées!

### Déboguer une tâche Gulp

Si vous utilisez VSCode, une "*launch configuration*" est fournie permettant de déboguer une tâche Gulp :
"*`Debug a Gulp task`*". Il suffit de modifier cette configuration, dans le fichier *`.vscode/launch.json`*
pour y indiquer le nom de la tâche Gulp à déboguer, de sélectionner cette configuration dans le panel
"*Debug*" de VSCode, puis de faire un "*`[F5]`*" pour lancer le tout.

### Déboguer un fichier de test spécifique

Si vous utilisez VSCode, une "*launch configuration*" est fournie permettant de déboguer un fichier de test
(*mocha*) spécifique : "*`Debug a test file`*". Il suffit de modifier cette configuration, dans le fichier 
*`.vscode/launch.json`*
pour y indiquer le path vers le fichier de test à déboguer, de sélectionner cette configuration dans le panel
"*Debug*" de VSCode, puis de faire un "*`[F5]`*" pour lancer le tout.


-------------------------

## Gestion des erreurs

La structure des erreurs retournées par l'API est basée sur les 
[GuideLines de Microsoft](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses).

La gestion des erreurs est effectuée dans deux fichiers : 
 
- *`src/app.ts`* : y sont définies les routes qui serviront à "attapper" les erreurs. Il s'agit particulièrement
d'une route pour attaper les "resources non trouvées" (404) et d''une route pour attraper toute autre erreur. 
Ces routes passent la balle au controlleur dédié qui les gérera :
- *`src/controllers/core/errorController.ts`*.

Lorsqu'une erreur survient, que ce soit une erreur système non attendue ou une erreur lancée manuellement, l'API retournera une réponse
consistant en l'object `IErrorResponse`. C'est cet object, avec un Content-Type `"application/json"`, que recevra 
le client ayant effectué la requête.

`IErrorResponse` et les autres composants reliés aux erreurs sont définis dans le fichier *`src/models/core/apiError.ts`*. C'est là que sont
exportées les interfaces reliées aux erreurs ainsi que des functions permettant de construire facilement
une erreur.

Lorsque vous lancez une erreur par vous-même, il est recommandé d'utiliser la function *`createError()`* qui est 
exportée par le fichier *`src/models/core/apiError.ts`*. Cette function démarre un *builder* permettant de facilement
construire l'erreur à lancer. On peut spécifier :

- Le message à logger
- Le niveau de log à utiliser
- Est-ce que la stack trace doit être loggée ou non. Pour un simple `404`, en général la stack trace est superflue.
- Le status HTTP à utiliser pour la réponse (ex: `404`)
- Le *code* de l'erreur à utiliser. Ceci doit être une string constante et significative (ex: "`UserNotFound`").
- Le message *publique* à utiliser dans l'erreur retournée. Si ce message publique n'est pas défini, un message générique sera utilisé.
- Des "`details`" et "`innererror`", tels que définis dans les 
[GuideLines de Microsoft](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#7102-error-condition-responses).

Note : ne pas oublier le `throw` et ne pas oublier d'appeller *`.build()`* à la fin du processus de création de l'erreur! Par exemple :

```typescript
throw createError("SomeCode", "A log message").httpStatus(HttpStatusCodes.NOT_IMPLEMENTED).build();
```

Pour lancer une erreur `404`, lorsqu'une resource n'est pas trouvée dans un controlleur, vous pouvez utilisez la 
function *`createNotFoundError()`*, aussi exportée par *`src/models/core/apiError.ts`*. Cette function gère automatiquement 
certains paramètres spécifiques à l'erreur "Not Found".

Même chose pour lancer une erreur relative à des paramètres invalides : il est possible de directement utiliser la
function *`createInvalidParameterError()`* au lieu de constuire l'erreur from scratch.

-------------------------

## Open API / Swagger

[Open API](https://www.openapis.org/), aussi connu sous le nom [Swagger](http://swagger.io/), est une spécification 
qui permet de documenter une API REST (ses endpoints, les paramètres, les types de retour, etc). Une API fournissant 
un fichier de specs Open API est documentée d'une manière standardisée et peut être consommée facilement 
par des clients connaissant Open API.

Il y a beaucoup, beaucoup de manières différentes de travailler avec Open API et beaucoup de librairies/plugins proposant
une méthode particulière. Ce qui est commun à toutes les approches est, qu'au bout du compte, l'API
fournit un endpoint servant un fichier YAML ou Json respectant la spec Open API et décrivant l'API. On appelle ce
fichier le "*fichier de specs Open API*" de l'application.

Présentement, dans ce gabarit, les fichiers reliés à Open API sont situés dans le répertoire *`open-api`*, à la racine du projet.
Le fichier *`open-api.yaml`* est le fichier de specs lui-même, décrivant l'API. Le fichier *`openApiConfigurer.ts`* contient le code
permettant d'enregistrer des routes reliées à Open API (routes décrites plus bas), le fichier *`openApiValidator.ts`* est utilisé
pour valider le fichier de specs et, finalement, *`swagger-editor-config.json`* est le fichier de config pour l'éditeur Swagger
(inclu dans le gabarit).

Les routes enregistrées par *`open-api.ts`* sont, par défaut :

- *`/v1/specification`* : sert le fichier de specs lui-même (*`open-api.yaml`*). Notez que les éléments "`host`", "`schemes`"
et "`basePath`" sont *automatiquement générés* et ajoutés au fichier servi! En fait, si vous tentez de les ajouter au fichier 
*`open-api.yaml`* directement, ils seront overwrittés.

- *`/v1/ui`* : sert [Swagger UI](http://swagger.io/swagger-ui/), une interface web présentant de manière "friendly"
la spec Open API de l'API. Cette interface permet aussi de tester les endpoints de l'API.

- *`/v1/editor`* : sert [Swagger Editor](http://swagger.io/swagger-editor/), un éditeur fait spécifiquement pour
modifier le fichier de specs Open API de l'API. Les modifications effectuées dans cet éditeur seront automatiquement
sauvegardées dans le fichier *`open-api.yaml`* (sauf les éléments "`host`", "`schemes`" et  "`basePath`"!). Il est possible de lancer
l'éditeur en mode "standalone", sans lancer l'application elle-même, en utilisant la commande "*`gulp editor`*".

Notez que l'éditeur Swagger a présentement [des](https://github.com/whitlockjc/json-refs/issues/91) 
[problèmes](https://github.com/swagger-api/swagger-editor/issues/1005) avec les références circulaires et va afficher
"*undefined*" pour quelques champs. C'est le cas avec la définition de nos `Errors`. Malgré ce petit
problème, le schéma généré est bel et bien valide!

Notez que nous avons testé *beaucoup* de solutions Swagger disponibles et nous sommes très au courant des librairies
qui génèrent automatiquement les routes et qui valident automatiquement les requêtes reçues, en utilisant le fichier 
de specs. Cela dit, nous n'avons pas encore statué sur la meilleure approche à utiliser... Certaines de ces solutions sont
très intrusives et forcent une structure précise pour l'application. Aussi, nous désirons conserver le contrôle
sur la structure des erreurs retournées : certains plugins validant automatiquement les paramètres reçus
ne permettent pas un tel contrôle.

Pour le moment, la manière de travailler suggérée est de mettre à jour le fichier de specs *`open-api.yaml`* 
manuellement ou en utilisant le Swagger Editor inclu dans le gabarit. Il faut aussi définir les routes de cet 
API dans le fichier *`src/routes.ts`* de l'application. Lorsque le serveur est lancé, une validation est effectuée
(en utilisant entre autre [Swagger Parser](http://bigstickcarpet.com/swagger-parser)) pour s'assurer que les 
routes définies dans le fichier de specs et celles définies dans *`src/routes.ts`* sont bien synchronisées.

### À revisiter à nouveau dans le futur :

- [Tsoa](https://github.com/lukeautry/tsoa) - approche *bottom-up* par excellence, qui génère automatiquement le fichier 
de specs en utilisant certains `decorators` et le fait que TypeScript est typé statiquement.

- [routing-controllers](https://github.com/pleerock/routing-controllers) - Aussi basé sur des `decorators`, les routes
sont générées en annotant les méthodes de controlleurs. Ne supporte pas la génération de specs Open API (à ce jour).

- [LoopBack](http://loopback.io/) - Développé par IBM au même titre qu'Express.

-------------------------

# TODO prochains trucs sur la liste / à explorer

- Sécurité
- [Yarn](https://yarnpkg.com/en/) ?
- [npm-lockdown](https://github.com/mozilla/npm-lockdown/) / [shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap)  

-------------------------

|
:-----:|
|Projet débuté en utilisant le générateur : *[mtl-node-api](https://bitbucket.org/villemontreal/generator-mtl-node-api)*

