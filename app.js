/**
 * Gestion de l'app avec la connexion à MongoDB et insertion des dispositifs de sécurité
 **/

const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
const app = express();

//Utilisation des variables d'environnement
dotenv.config();

//Connexion à la BDD
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//Ajout des CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Protection helmet contre les attaques XSS
app.use(helmet.xssFilter());
//Protection contre le click jacking
app.use(helmet.frameguard({ action: "deny" }));

//Import des routes et gestion des images(fichier statique)
app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;