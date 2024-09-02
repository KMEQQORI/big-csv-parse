# csv-big

`csvBig` est une bibliothèque Node.js pour le traitement et l'extraction de données à partir de grands fichiers CSV. Elle est conçue pour gérer des fichiers CSV volumineux de manière efficace en utilisant les flux de lecture.

## Installation

Pour utiliser `csvBig`, vous devez d'abord l'installer via npm. Dans le répertoire de votre projet, exécutez :

```bash
npm install csvBig
```


## Utilisation
Voici comment utiliser csvParseBig pour traiter vos fichiers CSV.

### Exemple de code
```js
const csvBig = require('csvBig');

// Création d'une instance du parseur avec le chemin du fichier CSV et des options
const parser = new csvBig('path/to/largefile.csv', {
    outputFilePath: 'output.json',
    maxLines: 1000,
    delimiter: ','
});

// Extraction des premières lignes
parser.extractFirstLines(10).then((records) => {
    console.log('First 10 records:', records);
});

// Extraction des lignes correspondant à certaines conditions
parser.extractWhere([
    { attribute: 'status', filter: value => value === 'active' }
], 50).then((records) => {
    console.log('Filtered records:', records);
});
```

## Méthodes
### extractFirstLines(numberOfLines)
    Extrait les "numberOfLines" premières lignes du fichier CSV.

#### Paramètres :

- **numberOfLines (Number) :** Nombre de lignes à extraire.
- ***Retour :*** Une promesse qui se résout en un tableau des enregistrements extraits.

### extractWhere(conditions, numberOfLines)
Extrait jusqu'à numberOfLines lignes du fichier CSV qui satisfont les conditions spécifiées.

#### Paramètres :

- **conditions (Array) :** Liste de conditions où chaque condition est un objet { attribute, filter }.
  - **attribute (String) :** Nom de l'attribut à filtrer.
  - **filter (Function) :** Fonction de filtrage qui retourne true ou false pour l'attribut donné.
- **numberOfLines (Number) :** Nombre maximum de lignes à extraire.
- ***Retour :*** Une promesse qui se résout en un tableau des enregistrements extraits.

### Options du constructeur
- **inputFilePath (String) :** Le chemin du fichier CSV à traiter (obligatoire).
- **outputFilePath (String) :** Le chemin du fichier JSON de sortie (optionnel, par défaut output.json).
- **maxLines (Number) :** Nombre maximum de lignes à conserver pour l'analyse complète (optionnel).
- **delimiter (String) :** Délimiteur utilisé dans le fichier CSV (optionnel, par défaut ,).

### Notes
Assurez-vous que le fichier CSV est correctement formaté et que les en-têtes de colonne correspondent aux données.

### Contribuer
Les contributions sont les bienvenues ! Si vous avez des suggestions ou des corrections, veuillez soumettre une demande de tirage (pull request) ou ouvrir une issue sur le dépôt GitHub du projet.

### Licence
Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus d'informations.

### Auteurs
Khalil MEQQORI - Créateur du module
Pour plus d'informations ou pour toute question, veuillez ouvrir une issue sur le dépôt GitHub ou nous contacter à l'adresse meqqorikhalil@gmail.com.
