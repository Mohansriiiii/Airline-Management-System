const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');

//mongo flight and currentBooking models
const Flight = require("../models/flight.model");
const CurrentBooking = require("../models/currentBooking.model");
const user = require('../models/user.model');

// Function to generate a random PNR
const generatePNR = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for(let i=0; i<6 ; i++){
        pnr += chars[Math.floor(Math.random()*chars.length)];
    }
    return pnr;
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

const sendBookingEmail = (flight, userEmail, selectedSeat, pnr) => {

    const startTime = new Date(flight.startTime).toLocaleTimeString();
    const endTime = new Date(flight.endTime).toLocaleTimeString();
    const travelDate = new Date(flight.travelDate).toLocaleDateString();

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: 'Your Flight Booking Details',
        html: `<h1>Booking Confirmation</h1>
               <p>Thank you for booking your flight with us.</p>
               <p><strong>PNR:</strong> ${pnr}</p>
               <p><strong>Flight:</strong> ${flight.companyName} ${flight.flightNumber}</p>
               <p><strong>From:</strong> ${flight.startingCity} (${startTime})</p>
               <p><strong>To:</strong> ${flight.destinationCity} (${endTime})</p>
               <p><strong>Travel Date:</strong> ${travelDate}</p>
               <p><strong>Seat:</strong> ${selectedSeat}</p>
               <p>We wish you a pleasant journey!</p>`
    };

    transporter.sendMail(mailOptions, (error,info) => {
        if(error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

//Route to get current bookings with flight details
router.get("/current-bookings", async (req,res) => {

    const { email } = req.query;

    try {
        const bookings = await CurrentBooking.find({ 'traveller.email' : email}).populate("flightId").exec();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching current bookings:', error);
        res.status(500).json({message: "Failed to fecth current bookings"});
    }
});

//create new booking
router.post("/book-flight", async (req,res) => {
    const { flightId, traveller, selectedSeat } = req.body;
    try {
        
        //Find the flight by its Id
        const flight = await Flight.findById(flightId);

        if(!flight) {
            res.status(404).json({message: "Flight not found "});
        }else{
            //Generate a unique PNR
            const pnr = generatePNR();

            // Create a new booking 
            const booking =  new CurrentBooking({
                flightId: flight._id,
                bookingTime: new Date(),
                traveller: traveller,
                pnr: pnr,
                selectedSeat: selectedSeat,
            });

            // Save the booking 
            await booking.save();

            // // Send email to user
            sendBookingEmail(flight, traveller.email, selectedSeat, pnr);

            res.status(200).json({message: "Flight booked successfully", booking});
        }

    } catch (error) {
        console.error('Error booking flight:', error);
        res.status(500).json({message: 'Failed to book the flight'});
    }
});

// to fetch booking details by PNR and last name
router.post("/checkin-details", async(req,res) => {
    const { pnr, lastName } = req.body;

    console.log('Received PNR:', pnr);
    console.log('Received lastName:', lastName);

    try {
        const booking = await CurrentBooking.findOne({ pnr: pnr }).populate('flightId').populate('traveller');
        
        if( !booking ) {
            console.error('Booking not found for PNR:', pnr);
            return res.status(404).json({message: "Booking not found"});
        }
        if(booking.traveller.lastName !== lastName) {
            return res.status(400).json({ message: "Last name does not match" });
        }

        res.status(200).json(booking);

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;