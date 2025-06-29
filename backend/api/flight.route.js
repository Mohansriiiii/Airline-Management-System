const express = require("express");
const router = express.Router();

//mongo flight model
const Flight = require("../models/flight.model");

//get flight from database
router.get("/flights", async (req,res) => {
    try {
        const flights = await Flight.find({});
        res.status(200).json(flights);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

//get flights by id
router.get("/flights/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const flights = await Flight.findById(id);
        res.status(200).json(flights);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

//add flights to database
router.post("/flights",async (req,res)=>{
    try {
        const flight = await Flight.create(req.body);
        res.status(200).json(flight);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// Flight search route
router.post('/flights/search', async (req, res) => {
    const { startingCity, destinationCity, travelDate } = req.body;
    try {
      const flights = await Flight.find({
        startingCity,
        destinationCity,
        travelDate: new Date(travelDate)
      });
      res.json(flights);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router ;