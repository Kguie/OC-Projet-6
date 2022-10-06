/**
 * Gestion des routes de user
 **/

const express = require("express");
const userCtrl = require("../controllers/user");
const router = express.Router();
const loginLimiter = require("../middleware/limiter");

//Enregistrement d'un nouvel utilisateur
router.post("/signup", userCtrl.signup);

//Connection de l'utilisateur
router.post("/login", loginLimiter, userCtrl.login);

module.exports = router;