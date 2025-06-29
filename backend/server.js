//mongodb
require("./config/db");
require('dotenv').config();

const express = require("express");
const port = process.env.PORT || 3000;

//cors
const cors = require("cors");

const bodyParser = require("express").json;

const userRouter = require("./api/user.route");
const FlightRouter = require("./api/flight.route");
const AdminRouter = require("./api/admin.route");
const currentBookingRouter = require("./api/currentBooking.route");
const emailRouter = require("./api/email.route");

//cron for updating the pastFlights collection
const cron = require("node-cron");
const movePastFlights = require("./functions/movePastFlights");

const app = express();

// Configure CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update this to match your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser());
app.use(express.urlencoded({extended:true}));

// Routes
app.use("/user", userRouter);
app.use("/admin", FlightRouter);
app.use("/admin", AdminRouter);
app.use(currentBookingRouter);
app.use(emailRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "FAILED",
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("<h1>Hello from Airline-Management-System</h1>");
});

// Schedule cron job
cron.schedule('0 * * * *', () => {
    console.log("Running movePastFlights job...");
    movePastFlights();
});
