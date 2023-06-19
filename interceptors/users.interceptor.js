module.exports = {
  createUser: createUser,
  loginUser:loginUser,
  // sendOtp:sendOtp
};

function createUser(req, res, next) {
  let email = req.body.email;
  if (email && email !== "") {
    next();
  } else {
    res.send({
      message: "Required field/s missing.",
    });
  }
}

function loginUser(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  if (email && email !== "" && password && password !== "") {
    next();
  } else {
    res.send({
      message: "Required field/s missing.",
    });
  }
}

// function sendOtp(req, res, next) {
//   let mobileNumber = req.body.mobileNumber;
//   if (mobileNumber && mobileNumber !== "") {
//     next();
//   } else {
//     res.send({
//       message: "Required field/s missing.",
//     });
//   }
// }
