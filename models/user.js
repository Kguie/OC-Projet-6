/**
 *Définition du schéma pour le modèle utilisateur
 **/

//Import de mongoose pour utiliser les schémas
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

//Améliore les messages d'erreur lors de l'enregistrement de données uniques
userSchema.plugin(uniqueValidator);

//exportation
module.exports = mongoose.model("User", userSchema);