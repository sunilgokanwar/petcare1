const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique : true
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city:{
      type: String,
    },
    state:{
      type: String,
    },
    isDoctor:{
      type: Boolean,
      default : false
    },
    petSpeciality:{
      type : Array
    }
  },
  {
    // strict: true,
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
