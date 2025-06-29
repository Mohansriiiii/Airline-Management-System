const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    verified: Boolean,
    mobileNumber: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    }
});

const user = mongoose.model("user", userSchema);

module.exports = user;