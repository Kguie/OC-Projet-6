/**
 * Gestion des routes de sauce
 **/

const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

//Ajout d'une sauce
router.post("/", auth, multer, sauceCtrl.addSauce);

//Ajoute ou enlève une appréciation
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//Modifier sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//Supprime sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Affiche la sauce dont on rentre l'id
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Affiche toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router;