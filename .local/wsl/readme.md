# Utilisation de WSL (Bash on Ubuntu on Windows 10) dans VSCode

Voici quelques informations pour ceux intéressés à tenter de faire fonctionner
Bash comme terminal par défaut dans VSCode sur Windows 10. L'intégration n'est pas
parfaite encore, alors cette documentation est plus un ramassis de notes qu'une
doc "officielle"!

Quelques liens utiles pour commencer :

- [https://github.com/Microsoft/vscode/issues/6579](https://github.com/Microsoft/vscode/issues/6579)
- [https://github.com/Microsoft/vscode/issues/24967](https://github.com/Microsoft/vscode/issues/24967)
- [http://stackoverflow.com/questions/43480997/vscode-with-wsl-how-to-use-bash-for-the-launch-configurations](http://stackoverflow.com/questions/43480997/vscode-with-wsl-how-to-use-bash-for-the-launch-configurations)

## Installation

- [Installez WSL](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/) sur votre poste.
- Configurez votre environnement Bash pour npm et pour Oracle (si requis) tel qu'indiqué dans le "readme.md" principal de ce projet.
- Configurez VSCode pour que `Bash` soit le terminal par défaut. Dans `User Settings` :  
"`terminal.integrated.shell.windows": "C:\\Windows\\sysnative\\bash.exe`"
- Redémarrez VSCode

Le terminal devrait maintenant être `Bash`. Si votre profile Linux est configuré correctement pour Oracle, en lançant "`env`"
vous devriez voir ces variables provenant de votre fichier "`~/.bashrc`" :

```
LD_LIBRARY_PATH=/usr/local/oracle/instantclient:
OCI_INC_DIR=/usr/local/oracle/instantclient/sdk/include
OCI_LIB_DIR=/usr/local/oracle/instantclient
```

## Lancer une commande dans le terminal

Si votre environnement `Bash` a été bien configuré, vous devriez être en mesure de lancer "`sudo -E npm install`" dans le
terminal et l'application devrait s'installer correctement. Le "-E" est important pour que les trois variables d'environnement
discutées plus haut soient disponibles lors du "`sudo`".

Par la suite une commande telle que "`sudo su`" suivit de "`gulp start`" devrait également fonctionner. Pour une raison
qui m'échappe pour le moment, "`sudo -E gulp start`" ne semble pas fonctionner ici, il faut nécessairement switcher vers 
l'utilisateur "root" pour que ça fonctionne.

## Lancer une task dans VSCode

Je ne suis pas encore parvenu à faire en sorte qu'une task lancée par VSCode fonctionne parfaitement
dans VSCode. En utilisant le fichier "`tasks.json`" fourni à côté du readme.md présent, le fichier "compile.sh"
est utiliser comme cible pour la task de compilation. Cela est requis car sinon il semble que les variables 
d'environnement du fichier "~/.bashrc" de l'utilisateur ne sont pas exportées et la compilation relative à Oracle sera 
un échec à cause de cela. Le fichier "compile.sh" *source* donc ce fichier "~/.bashrc" avant d'appeller 
"`node_modules/.bin/gulp compile`".

Cela fonctionne, mais il y a un dernier irritant, le message "Press any key to close the terminal" à la fin
de la compilation. Il est désagréable de devoir appuyer sur une touche pour que le processus se termine.
Vous pouvez suivre les avancements à ce sujet [ici](https://github.com/Microsoft/vscode/issues/24967).

## Lancer une launch configuration utilisant Bash dans VSCode

TODO, voir [ceci](http://stackoverflow.com/questions/43480997/vscode-with-wsl-how-to-use-bash-for-the-launch-configurations).
