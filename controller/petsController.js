let log4js = require("log4js");
const bcrypt = require("bcrypt");
const config = require("config");
let petsDao = require("../dao/pets.dao");
let Pet = require("../models/pets.model");
let logger = log4js.getLogger("Pets Controller");

module.exports = {
    addNewPet: addNewPet,
    getMyPets: getMyPets,
    getPetDetails:getPetDetails,
    updatePetDetails:updatePetDetails,
    deletePet:deletePet
};

//Create user
async function addNewPet(req, res) {
    logger.debug("Inside addNewPet", req.body);
    let petDetails = req.body;
    if(!(typeof petDetails._id === 'undefined')){

        let oldPetDetails = await petsDao.findOne({_id:petDetails._id});
        oldPetDetails.DOB=petDetails.DOB,
        oldPetDetails.ageMonth=petDetails.ageMonth,
        oldPetDetails.ageYear=petDetails.ageYear,
        oldPetDetails.gender=petDetails.gender,
        oldPetDetails.petBreed=petDetails.petBreed,
        oldPetDetails.petName=petDetails.petName,
        oldPetDetails.petType=petDetails.petType,
        oldPetDetails.userId=petDetails.userId,
        oldPetDetails.weight=petDetails.weight

        oldPetDetails.save();
        return res.status(200).json({ message: "Pet updet successfully." });

    }else{
    let newPetDetails = await petsDao.insertOne(petDetails);
    if (newPetDetails && newPetDetails._id) {
        console.log(newPetDetails);
        logger.debug("New Pet Added successfully : " + newPetDetails._id);
        // return res.status(200).send("New Pet Added successfully.");
        return res.status(200).json({ message: "New Pet Added successfully." });
    }
    else {
        console.log("Failed to add Pet.");
        console.log(newPetDetails);
        return res.status(400).send("Failed to add Pet.");
    }
}

}

async function getMyPets(req, res) {
    console.log(req.body,"req================");
    try {
        console.log("inside  getMyPets", req.body);
        let searchQuery = {
            userId: req.body.userId,
            petType: req.body.petType
        }
        logger.debug("SearchQuery in getMyPets", JSON.stringify(searchQuery));
        let petList = await petsDao.find(searchQuery);
        console.log("search Query Result", petList.length);
        return res.status(200).json({
            petList: petList
        })
    } catch (err) {
        logger.error("Error in getMyPets");
        logger.error(err.message);
        return res.status(500).send("Internal Server Error");
    }

} 

async function getPetDetails(req, res) {
    try {
        logger.debug("inside  getPetDetails", req.body);
        let petDetails = await petsDao.findOne({_id:req.body._id});
        logger.debug("search Query Result", petDetails);
        return res.status(200).json({
            petDetails: petDetails
        })
    } catch (error) {
        logger.error("Error in getPetDetails");
        logger.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

async function updatePetDetails(req, res) {
    logger.debug("Inside updatePetDetails", req.body);
    try {
        let updatePet = await Pet.findOne({ "_id": req.body._id });
        if (req.body.petType) {
            updatePet.petType = req.body.petType;
        }
        if (req.body.petBreed) {
            updatePet.petBreed = req.body.petBreed;
        }
        if (req.body.age) {
            updatePet.age = req.body.age;
        }
        if (req.body.gender) {
            updatePet.gender = req.body.gender;
        }
        if (req.body.weight) {
            updatePet.weight = req.body.weight;
        }
        if (req.body.DOB) {
            updatePet.DOB = req.body.DOB;
        }
        updatePet.save();
        logger.debug("Update User", updatePet);
        res.status(200).send({
            message: "pet updated sucessfully",
        });
    } catch (e) {
        logger.error("Error in pet updation.", e.message);
        res.status(400).send({
            message: "Error in pet updation.",
        });
    }
}

async function deletePet(req, res) {
    console.log("Inside  deletePet", req.body);
    try {
        console.log("Inside  deletePet", req.body);
        let deletePetDetails = await petsDao.deleteOne({ _id: req.body._id });
        logger.debug("Deleted Pet Details", deletePetDetails);
        if (deletePetDetails && deletePetDetails._id) {
            logger.debug("Pet deleted successfully : ");
            return res.status(200).json({
                message: "Pet deleted successfully.",
            })
        } else {
            logger.error("Failed to delete pet : ");
            logger.error(deletePetDetails);
            return res.status(500).json({
                message: "Error in pet deletion.",
            })
        }
    } catch (error) {
        console.log("Failed to delete pet...");
        logger.error(error.message);
        return res.status(500).json({
            message: "Error in pet deletion.",
        })
    }
}

