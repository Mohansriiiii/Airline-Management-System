const mongoose = require("mongoose");
require('dotenv').config();

const dbURI = process.env.MONGODB_URI ;
if (!dbURI) {
    console.error("MongoDB URI is not defined in environment variables");
    process.exit(1);
}

mongoose.connect(dbURI, {
    // useNewUrlParser: true, // Deprecated and has no effect in Node.js Driver version 4.0.0 and later
    // useUnifiedTopology: true // Deprecated and has no effect in Node.js Driver version 4.0.0 and later
})
.then(() => {
    console.log("MongoDB Connected!");
})
.catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if cannot connect to database
});