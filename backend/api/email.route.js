const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// route to send email

router.post('/send-email', async (req,res) => {
    const {flightInfo, baggage} = req.body;
    const email = flightInfo.traveller.email;

    //Create a transporter

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        },
    });

    // Email content
    let mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Your Flight Booking Details',
        text: `Hello, \n\nHere are your booking details:\n\nFlight Number: ${flightInfo.flightId.flightNumber}\nDeparture: ${flightInfo.flightId.startingCity}\nArrival: ${flightInfo.flightId.destinationCity}\nDeparture Time: ${new Date(flightInfo.flightId.startTime).toLocaleTimeString()}\nArrival Time: ${new Date(flightInfo.flightId.endTime).toLocaleTimeString()}\nSelected Seat: ${flightInfo.selectedSeat}\nAdditional Baggage: ${baggage}\n\nThank you for booking with us!`,
    };

    //send email
    transporter.sendMail(mailOptions,(error,info) => {
        if(error) {
            return res.status(500).json({message: 'Error sending email', error});

        }
        res.status(200).json({message: 'Email sent successfully', info });
    });

});

module.exports = router;