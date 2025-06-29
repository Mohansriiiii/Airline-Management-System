const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlightSchema = new Schema({
        companyName: {
            type: String,
            required: [true,"Please enter an airLine name"],
        },
        flightNumber: {
            type: String,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        startingCity:{
            type: String,
            required: true,
        },
        layovers: {
            type: Number,
            required:true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        destinationCity: {
            type: String,
            required: true,
        },
        pricePerSeat: {
            type: Number,
            required: true,
        },
        totalSeats: {
            type: Number,
            required: true,
            default: 168,
        },
        seatsAvailable: {
            type: Number,
            required: true,
            default: 0,
        },
        travelDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

const Flight = mongoose.model("Flight", FlightSchema);

module.exports = Flight ;