/**
 * Gestion de la logique métier des routes de sauce
 **/

const Sauce = require("../models/sauce");
const fs = require("fs");


/*Ajoute une nouvelle sauce*/
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: "Sauce ajoutée !" }) })
        .catch(error => { res.status(400).json({ error }) })
};


/*Modifie une sauce*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    //Sécurité pour être sur que l'utilisateur ne puisse créer un produit à son nom puis le modifier avec le userId d'un autre
    delete sauceObject._userId;
    Sauce.findById(req.params.id)
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Requête non autorisé" });
            } else {
                //Efface l'ancienne image du serveur si il y a  une nouvelle image dans la requête
                if (!!req.file) {
                    const filename = sauce.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
                            .catch(error => res.status(401).json({ error }));
                    });
                }
                //Met à jour la sauce
                else {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
                        .catch(error => res.status(401).json({ error }));
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


/*Noter une sauce*/
exports.likeSauce = (req, res, next) => {
    //Récupération de la valeur de like
    const likeSauce = req.body.like;
    const validateUserId = req.auth.userId;
    Sauce.findById(req.params.id)
        .then((sauce) => {
            //Ajout d'une appréciation négative
            if (likeSauce === -1) {

                //L'utilisateur a déjà auparavant ajouté une appréciation
                if ((sauce.usersDisliked.includes(validateUserId)) || (sauce.usersLiked.includes(validateUserId))) {
                    res.status(401).json({ message: "Veuillez d'abord enlever votre appréciation" });
                }

                //L'utilisateur n'avait pas encore laissé d'appréciation
                else {
                    //Ajout de l'id utilisateur à la liste des usersDisliked et +1 au total de dislikes
                    Sauce.updateOne({ _id: req.params.id }, {
                        $push: { usersDisliked: validateUserId },
                        $inc: { dislikes: +1 }
                    })
                        .then(() => res.status(200).json({ message: "Dislike ajouté!" }))
                        .catch(error => res.status(401).json({ error }));
                }
            }
            //L'utilisateur choisit de mettre  une note neutre
            if (likeSauce === 0) {

                //L'utilisateur avait auparavant ajouté un like
                if (sauce.usersLiked.includes(validateUserId)) {
                    //Suppression de l'id de l'utilisateur de la liste des usersLiked et retrait de 1 du total des likes
                    Sauce.updateOne({ _id: req.params.id }, {
                        $pull: { usersLiked: validateUserId },
                        $inc: { likes: -1 }
                    }).then(() => res.status(200).json({ message: "Like retiré!" }))
                        .catch(error => res.status(401).json({ error }));
                }

                //L'utilisateur n'avait auparavant pas aimé le produit    
                if (sauce.usersDisliked.includes(validateUserId)) {
                    //Suppression de l'id de l'utilisateur de la liste des usersDisliked et retrait de 1 du total des dislikes
                    Sauce.updateOne({ _id: req.params.id }, {
                        $pull: { usersDisliked: validateUserId },
                        $inc: { dislikes: -1 }
                    })
                        .then(() => res.status(200).json({ message: "Dislike retiré!" }))
                        .catch(error => res.status(401).json({ error }));
                }
            }

            //L'utilisateur choisit d'ajouter un like    
            if (likeSauce === 1) {

                //L'utilisateur a déjà auparavant ajouté une appréciation
                if ((sauce.usersDisliked.includes(validateUserId)) || (sauce.usersLiked.includes(validateUserId))) {
                    res.status(401).json({ message: "Veuillez d'abord enlever votre appréciation" });
                }

                //L'utilisateur n'avait pas encore laissé d'appréciation        
                else {
                    //Ajout de l'id utilisateur à la liste des usersLiked et +1 au total de likes
                    Sauce.updateOne({ _id: req.params.id }, {
                        $push: { usersLiked: validateUserId },
                        $inc: { likes: +1 }
                    })
                        .then(() => res.status(200).json({ message: "Like ajouté!" }))
                        .catch(error => res.status(401).json({ error }));
                }
            }

        })
        .catch(error => {
            res.status(400).json({ error });
        });
};



/*Supprimer une sauce*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findById(req.params.id)
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Requête non autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                //Supprime la photo 
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "Sauce supprimé !" }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


/*Affiche une sauce selon son id*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findById(req.params.id)
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};


/*Affiche toutes les sauces*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
};




