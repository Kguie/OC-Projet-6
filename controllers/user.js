/**
 * Gestion de la logique métier des routes de user
 **/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


/*Enregistrement des nouveaux utilisateurs */
exports.signup = (req, res, next) => {

    //Hash du mdp rentré par l'utilisateur
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            //Fin de création du nouvel utilisateur
            user.save()
                .then(() => res.status(201).json({ message: "L'utilisateur a bien été enregistré" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))

};

/*Connexion des utilisateurs */
exports.login = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    User.findOne({ email: req.body.email })
        .then(user => {
            //L'utilisateur n'est pas trouvé dans la BDD
            if (user === null) {
                res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" })
            } else {
                //Comparaison des hash 
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: "Paire identifiant/mot de passe incorrecte" })
                        } else {
                            res.status(200).json({
                                //Réponse avec envoi de l'id de l'utilisateur ainsi que du token
                                userId: user.id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    "RANDOM_TOKEN_SECRET",
                                    { expiresIn: "24h" }
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }))
};
