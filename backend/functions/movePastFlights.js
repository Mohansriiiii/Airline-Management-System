const CurrentBooking = require("../models/currentBooking.model");
const PastFlight = require("../models/pastFlights.model");
const Flight = require("../models/flight.model");
require("../config/db"); // Add database connection

const movePastFlights = async () => {
    const now = new Date();
    try {
        // Find all current bookings and populate the flight details
        const pastBookings = await CurrentBooking.find().populate({
            path: 'flightId',
            model: 'Flight'
        });

        console.log(`Found ${pastBookings.length} total bookings`);

        const bookingsToMove = pastBookings.filter(booking => {
            if (!booking.flightId) {
                console.log(`Booking ${booking._id} has no flight reference`);
                return false;
            }
            const departureTime = new Date(booking.flightId.startTime);
            const isPast = departureTime < now;
            if (isPast) {
                console.log(`Booking ${booking._id} is past (departure: ${departureTime})`);
            }
            return isPast;
        });

        console.log(`Found ${bookingsToMove.length} past bookings to move`);

        // Move each past booking to the pastFlights collection 
        for(const booking of bookingsToMove) {
            try {
                const pastFlight = new PastFlight({
                    flightId: booking.flightId._id,
                    bookingTime: booking.bookingTime,
                    travelDate: booking.flightId.startTime,
                    passengerDetails: booking.traveller,
                    seatNumber: booking.selectedSeat,
                    pnr: booking.pnr
                });

                await pastFlight.save();
                await CurrentBooking.findByIdAndDelete(booking._id);
                console.log(`Successfully moved booking ${booking._id} to past flights`);
            } catch (bookingError) {
                console.error(`Error moving booking ${booking._id}:`, bookingError);
            }
        }

        console.log(`Successfully moved ${bookingsToMove.length} bookings to past flights`);

    } catch (error) {
        console.error('Error in movePastFlights:', error);
    } finally {
        // Close the database connection
        process.exit(0);
    }
};

// If this file is run directly, execute the function
if (require.main === module) {
    movePastFlights();
}

module.exports = movePastFlights;