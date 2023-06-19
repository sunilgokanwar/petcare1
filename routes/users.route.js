let express = require("express");
let router = express.Router();
let log4js = require("log4js");
const logger = log4js.getLogger("Users Routes");
let usersInterceptor = require("../interceptors/users.interceptor");
let usersController = require("../controller/userController");

logger.debug("Users Routes Initiated");

//create new user
router.post("/createuser",usersInterceptor.createUser, usersController.createUser);

//get all user list
router.get("/getAllUsers", usersController.getAllUsers);

//delete user by id
router.delete("/:id", usersController.deleteUser);

//update user
router.put("/:id", usersController.updateUser);

router.get("/:id", usersController.getUserById);

//login new user
router.post("/login", usersInterceptor.loginUser, usersController.loginUser);

//search doctor by city 
router.post("/getDoctorByCityAndPetSpecialtiy", usersController.getDoctorByCityAndPetSpecialtiy);

//send otp
//router.post("/sendOtp",usersInterceptor.sendOtp, usersController.sendOtp);

module.exports = router;
