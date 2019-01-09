# (R)Évolution
(R)Évolution est une fiction interactive en Javascript. De par sa conception, elle ne nécessite (actuellement) aucun serveur et se joue donc directement dans un navigateur.

## Pour jouer

Télécharger la dernière release et ouvrir `play.html` dans votre navigateur favori.

## Aspects techniques

Les données du jeu sont écrites dans des balises HTML dédiées `<al-*>` (cf. [Using custom elements on MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)). Elles sont ensuite traitées et transformées en objets puis c'est les propriétés des objets qui sont ensuite affichés.

Toute mise à jour de données est faite d'abord sur le DOM, modifiant donc les `<al-*>` avec le nouveau contenu. Ceux-ci seront réanalysés et les modifications seront renvoyés vers les objets correspondants.

## Contexte de développement

Jeu réalisé par [Loïc Aubrays](https://github.com/Aubrays). La version 0.1 a été réalisée comme projet de validation en janvier 2019 du cours « Publication numérique » , enseigné par Isaac Pante à l’[Université de Lausanne](http://www.unil.ch).

## Voir aussi

Vous pouvez consulter la page `credits.html` pour mes sources d'inspiration.
