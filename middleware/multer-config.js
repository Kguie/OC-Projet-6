/**
 * Gestion de la configuration de multer pour l'importation d'image
 **/

const multer = require("multer");
const path = require("path");



//Types de fichiers pris en compte
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
};

//Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (req, file, callback) => {
        //Supprime les espaces et les cas d'extensions écrites à l'intérieur du nom
        const fileName = file.originalname.split(" ").join("_");
        const name = path.parse(fileName).name;

        //Génération de l’extension
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + "." + extension);
    }
});

/*Vérification de l'extension*/
const filter = (req, file, callback) => {
    if ((file.mimetype).includes("jpeg") || (file.mimetype).includes("png") || (file.mimetype).includes("jpg")) {
        callback(null, true);
    } else {
        callback("Error: Seuls les fichiers jpg, jpeg, et png sont autorisés!");
    }
};


//Upload de l'image avec contrôle de la taille du fichier
let upload = multer({
    storage: storage,
    //Limite de taille de la photo 2MB
    limits: { fileSize: 2000000 },
    fileFilter: filter
});

module.exports = upload.single("image");