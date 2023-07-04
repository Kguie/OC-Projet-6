# Piiquante #
 
 Ce projet correspond au projet 6 de la formation développeur Web de OPENCLASSROOMS.


## Table des Matières

- [Introduction](#introduction)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Consommer l'API](#consommer-l-api)
- [Structure du Projet](#structure-du-projet)
- [Auteurs](#auteurs)
- [Exigences fonctionnelles](#exigences-fonctionnelles)
- [Outils et contraintes techniques](#outils-et-contraintes-techniques)


## Introduction 

L'objectif ici est d'intégrer l'interface du site Oh my food avec du code HTML et SASS en mobile first tout en ajoutant des animations. 


## Installation

- Installation des dépendances : Cloner ce repository et lancer `yarn install` pour installer les dépendances.


## Utilisation

- Utiliser  `yarn start` pour lancer nodemon server.
- L'API est en écoute sur [http://localhost:3000](http://localhost:3000).

## Consommer l'API

L'API GC-Admin-App est une API REST. Une fois lancée, cette API met plusieurs routes à votre disposition

- Les routes User (utilisateur) :

    ● Route de connection d'un utilisateur (Permet d'acquérir le token nécessaire à l'authentification):
    `POST /users/login`

    ● Route pour ajouter un utilisateur :
    `POST /users/signup`  


- Les routes Sauces :

    ● Route pour ajouter une sauce (authentification requise):
    `POST /sauces/`

    ● Ajouter ou supprimer une appréciation (authentification requise) :
    `POST /sauces/:id/like`

    ● Route pour supprimer une sauce (authentification requise) :
    `PUT /sauces/:id`

    ● Route pour supprimer une sauce (authentification requise) :
    `DELETE /sauces/:id`

     ● Route pour récupérer les données de la sauce dont on rentre l'id (authentification requise) :
    `GET /sauces/:id`

    ● Route pour récupérer les données de tous les clients (authentification requise) :
    `GET /sauces`

## Structure du Projet

- images/           # Dossier contenant les images
- controllers/      # Dossier contenant les controllers
- middleware/       # Contient les middlewares
- models/           # Contient les models
- routes/           # Contient les routes  
- app.js            # Fichier js de l'application 
- server.js         # Fichier js du serveur  

## Auteurs

- [GUIEBA Kévin](https://github.com/Kguie/)


## Exigences fonctionnelles 

- API Routes
    - Toutes les routes sauce pour les sauces doivent disposer d’une autorisation (le token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »).
    - Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne correspond pas, renvoyer « 403: unauthorized request. » Cela permet de s'assurer que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.

## Outils et contraintes techniques 

- Exigences de sécurité
    - Le mot de passe de l'utilisateur doit être haché.
    - L'authentification doit être renforcée sur toutes les routes sauce requises.
    - Les adresses électroniques dans la base de données sont uniques et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.
    - La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.
    - Un plugin Mongoose doit assurer la remontée des erreurs issues de la base de données.
    - Les versions les plus récentes des logiciels sont utilisées avec des correctifs de sécurité actualisés.
    - Le contenu du dossier images ne doit pas être téléchargé sur GitHub.