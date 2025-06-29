const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//mongo flight model
const Flight = require("./flight.model");

const currentBookingSchema = new Schema({
    flightId: {
        type: Schema.Types.ObjectId,
        ref: `Flight`,
        required: true,
    },
    bookingTime: {
        type: Date,
        default: Date.now(),
    },
    traveller: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            dateOfBirth: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            }
    },
    selectedSeat: {
        type: String,
        required: true,
    },
    pnr: {
        type: String,
        required: true,
        unique: true,
    }
    
});

const CurrentBooking = mongoose.model("CurrentBooking", currentBookingSchema);

module.exports = CurrentBooking ;