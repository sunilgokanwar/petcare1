let express = require("express");
let log4js = require("log4js");
let PetModel = require("../models/pets.model");
const logger = log4js.getLogger("Pets Dao");

module.exports = {
  insertOne: insertOne,
  findOne: findOne,
  find: find,
  deleteOne: deleteOne,
};

//insert record
async function insertOne(petDetails) {
  let petData = new PetModel(petDetails);
  let newPet = await petData.save().catch((err) => {
    return err;
  });
  return newPet;
}
// find record
async function findOne(query) {
  let petDetails = await PetModel.findOne(query).catch((err) => {
    return err;
  });
  return petDetails;
}
// find all record
async function find(query) {
  let petList = await PetModel.find(query).catch((err) => {
    return err;
  });
  return petList;
}
//delete record
async function deleteOne(query) {
  let userDeleted = await PetModel.findByIdAndRemove(query).catch((err) => {
    return err;
  });
  return userDeleted;
}
