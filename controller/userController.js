let log4js = require("log4js");
const bcrypt = require("bcrypt");
const config = require("config");
let usersDao = require("../dao/users.dao");
let User = require("../models/users.model");
let tokenService = require("../services/token.service");
let logger = log4js.getLogger("Users Controller");

module.exports = {
  createUser: createUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  getUserById: getUserById,
  loginUser: loginUser,
  getDoctorByCityAndPetSpecialtiy: getDoctorByCityAndPetSpecialtiy,
 // sendOtp:sendOtp
};

//Create user
async function createUser(req, res) {
  logger.debug("Inside create user", req.body);
  let userDetails = req.body;
  userDetails.password = encryptPassword(userDetails.password);
  logger.debug("Password encrypted successfully.");
  let newUserDetails = await usersDao.insertOne(userDetails);
  if (newUserDetails && newUserDetails._id) {
    logger.debug("User created successfully : " + newUserDetails._id);
    return res.status(200).send("User created successfully.");
  }
  else {
    logger.error("Failed to create user.");
    logger.error(newUserDetails);
    return res.status(400).send("Failed to create user .");
  }

}

// Get list of all user
async function getAllUsers(req, res) {
  logger.debug("Inside getAllUsers");
  let allUsers = await usersDao.find({});
  if (allUsers && allUsers.length > 0) {
    logger.debug("User list fetched successfully : " + allUsers.length);
    return res.status(200).json({
      data: allUsers
    })
  } else {
    logger.error("Failed to fetch all users : ");
    logger.error(allUsers);
    return res.status(400).json({
      message: "Failed to fetch all users",
      data: allUsers
    })
  }
}

//Get User By Id
async function getUserById(req, res) {
  logger.debug("Inside getByIdUser");
  try {
    const user = await User.findOne({
      _id: req.body._id,
    });
    return res.status(200).json({
      message: "User Details found",
      data: user
    })
  } catch {
    return res.status(404).send({
      error: "user doesn't exist!",
    });
  }
}

//delete user by Id
async function deleteUser(req, res) {
  logger.debug("Inside  deleteUser", req.body);
  let userId = req.body._id;
  let deleteUserQuery = {
    _id: userId,
  };
  logger.debug("Delete Query : ", JSON.stringify(deleteUserQuery));
  let deleteUserDetails = await usersDao.deleteOne(deleteUserQuery);
  logger.debug("Delete User Details", deleteUserDetails);
  if (deleteUserDetails && deleteUserDetails._id) {
    logger.debug("User deleted successfully : ");
    return res.status(200).json({
      message: "User deleted successfully.",
    })
  } else {
    logger.error("Failed to delete user : ");
    logger.error(deleteUserDetails);
    return res.status(400).json({
      message: "Error in user deletion.",
    })
  }
}

async function updateUser(req, res) {
  logger.debug("Inside Update user", req.body);
  try {
    const UPDATE_USER = {};
    let updateUser = await User.findOne({ "_id": req.body._id });
    // updateUser.firstname=req.body.firstname;
    if (req.body.firstname) {
      updateUser.firstname = req.body.firstname;
    }
    if (req.body.lastname) {
      updateUser.lastname = req.body.lastname;
    }
    if (req.body.email) {
      updateUser.email = req.body.email;
    }
    if (req.body.phone) {
      updateUser.phone = req.body.phone;
    }
    updateUser.save();
    console.log("Update User", updateUser);
    res.status(200).send({
      message: "user updated sucessfully",
    });
  } catch (e) {
    logger.error("Error in user updation.", e.message);
    res.status(400).send({
      message: "Error in user updation.",
    });
  }

}

//password encrypt
function encryptPassword(plainTextPassword) {
  let saltRounds = config.get("saltRounds");
  const hashPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
  return hashPassword;
}

//password compare
function comparePassword(plainTextPassword, hashPassword) {
  let isPasswordCorrect = bcrypt.compareSync(plainTextPassword, hashPassword);
  return isPasswordCorrect;
}

//Login user
async function loginUser(req, res) {
  logger.debug("Initiated login User");
  let findUserQuery = {
    email: req.body.email,
  };
  let userDetails = await usersDao.findOne(findUserQuery);
  //logger.debug("User Details find", userDetails.length);
  if (userDetails && userDetails._id) {
    let isPasswordMatched = comparePassword(
      req.body.password,
      userDetails.password
    );
    if (isPasswordMatched) {
      logger.debug("User login successful : " + req.body.email);
      delete req.body.password;
      let token = tokenService.createToken(userDetails);
      logger.debug("Token", token);
      let response = {
        message: "User logged in successfully.",
        user: userDetails,
        token: token,
      };
      return res.status(200).send({
        response: response,
      });
    } else {
      logger.error("User login Failed : " + req.body.email);
      let error = new Error();
      error.message = "Invalid Credentials";
      return res.status(400).send({
        response: error,
      });
    }
  } else {
    logger.error("User login Failed 1st else : " + req.body.email);
    let error = new Error();
    error.message = "Invalid Credentials";
    return res.status(400).send({
      response: error,
    });
  }
}

//Find User by City and PetSpecialtiy
async function getDoctorByCityAndPetSpecialtiy(req, res) {
  logger.debug("Inside getDoctorByCityAndPetSpecialtiy");
  try {
    let searchQuery = [];
    if (req.body.isDoctor) {
      let city = req.body.city; 
      let petSpeciality = req.body.petSpeciality ? req.body.petSpeciality : [];
      searchQuery = [{
        $match: {
          isDoctor: true,
          petSpeciality :{$in:petSpeciality}
        } 
      },
      { $project: {_id:0, firstname: 1,lastname: 1, email: 1,petSpeciality:1,phone:1 } }
     ];
      if (city && city != undefined) {
        let searchQuery1 = {
          $match: {
            city: {
              $regex: new RegExp(city, "gi")
            }
          }
        }
        searchQuery.push(searchQuery1);
      }
      // if (state && state != undefined) {
      //   let searchQuery2 = {
      //     $match: {
      //       state: {
      //         $regex: new RegExp(state, "gi")
      //       }
      //     }
      //   }
      //   searchQuery.push(searchQuery2);
      // } 
      logger.debug("Search Query", JSON.stringify(searchQuery));
      let result = await User.aggregate(searchQuery);
      logger.debug("Search Query Result", result.length);
      return res.status(200).json({
        message: "Doctors Found",
        data: result
      })
    } else {
      return res.status(400).json({
        message: "User is not Doctor",
        data: []
      })
    }
  } catch (err) {
    logger.error("Error in search doctor", err.message);
    return res.status(400).json({
      message: "Error in search doctor"
    })
  }
}

// async function sendOtp(req, res) {
//   try {
//     const user = await User.findOne({
//       mobileNumber: req.body.mobileNumber,
//     });
//     if (user){
//       return res.status(200).json({
//         message: "User Details found",
//         data: user
//       })
//     }else{
      
//     }
     

//   } catch {
//     return res.status(404).send({
//       error: "user doesn't exist!",
//     });
//   }
// }

