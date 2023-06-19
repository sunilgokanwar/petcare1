const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const petSchema = new Schema(
    {
        petName: {
            type: String,
            //required: true,
        },
        petType: {
            type: String,
            //required: true,
        },
        petBreed: {
            type: String,
            //required: true,                                                      
        },
        ageYear: {
            type: Number,
            required: true,
        },
        ageMonth: {
            type: Number,
            //required: true,
        },
        gender: {
            type: String,
            //required: true,
        },
        weight: {
            type: Number,
        },
        DOB: {
            type: Date,
        },
        userId: {
            type: String,
        },
    },
    {
        // strict: true,
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("Pet", petSchema);