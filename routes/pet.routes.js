let express = require("express");
let router = express.Router();
let log4js = require("log4js");
const logger = log4js.getLogger("Pets Routes");
let petsController = require("../controller/petsController");

logger.debug("Pets Routes Initiated");

//add new pet
router.post("/addNewPet", petsController.addNewPet);

//get the pet list on the basis of userId and petType
router.post("/getMyPets", petsController.getMyPets);


//get the Pet Details on the basis of petId
router.get("/getPetDetails", petsController.getPetDetails);

//update pet details
router.post("/updatePetDetails", petsController.updatePetDetails);

//delete Pet
router.delete("/deletePet", petsController.deletePet);

module.exports = router;
