const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Flight = require("./flight.model");

const pastFlighthSchema = new Schema({
    flightId: {
        type: Schema.Types.ObjectId,
        ref: `Flight`,
    },
    bookingTime: Date,
    travelDate: Date,
});

const PastFlight = mongoose.model("PastFlight", pastFlighthSchema);

module.exports = PastFlight ;