const express = require("express");
const router = express.Router();

//mongo user model
const user = require("../models/user.model");

//mongo user verification model
const userVerification = require("../models/userVerification.model");

//email handler
const nodemailer = require("nodemailer"); 

//unique string
const {v4: uuidv4} = require("uuid");

//env variables
require("dotenv").config();

//password handler 
const bcrypt = require("bcrypt");

//path for static verified page 
const path = require("path");

// Cloudinary setup
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file uploads
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

//express-validator
const { body, validationResult } = require('express-validator');

//nodemailer stuff
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

//testing success
transporter.verify((error,success) => {
    if(error) {
        console.log(error);
    }else{
        console.log("Ready for messages");
        console.log(success);
    }
})

const { 
    trimString, 
    validateUserInput, 
    sendVerificationEmail, 
    verifyEmail,
    updateUserProfile 
} = require("../functions/userFunctions");

//Signup
router.post('/signup', async (req, res) => {
    let { name, email, password } = req.body;
    name = trimString(name);
    email = trimString(email);
    password = trimString(password);

    const validation = validateUserInput(name, email, password);
    if (!validation.isValid) {
        return res.json({
            status: "FAILED",
            message: validation.message
        });
    }

    try {
        const existingUser = await user.find({ email });
        if (existingUser.length) {
            return res.json({
                status: "FAILED",
                message: "User with the provided email already exists"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new user({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        await sendVerificationEmail(savedUser, res);

    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while creating user account"
        });
    }
});

//verify email
router.get("/verify/:userId/:uniqueString", (req, res) => {
    const { userId, uniqueString } = req.params;
    verifyEmail(userId, uniqueString, res);
});

//verified page route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
});

//Signin
router.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    email = trimString(email);
    password = trimString(password);

    if (email === "" || password === "") {
        return res.json({
            status: "FAILED",
            message: "Empty credentials Supplied"
        });
    }

    try {
        const data = await user.find({ email });
        if (!data.length) {
            return res.json({
                status: "FAILED",
                message: "Invalid credentials entered!"
            });
        }

        if (!data[0].verified) {
            return res.json({
                status: "FAILED",
                message: "Email hasn't been verified yet. Check your inbox."
            });
        }

        const result = await bcrypt.compare(password, data[0].password);
        if (result) {
            res.json({
                status: "SUCCESS",
                message: "Signin successful",
                data: data
            });
        } else {
            res.json({
                status: "FAILED",
                message: "Invalid password entered!"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while checking for existing user"
        });
    }
});

//Update Profile
router.put('/update-profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, mobileNumber, email } = req.body;

        const updateData = {};
        if (fullName) updateData.name = fullName;
        if (mobileNumber) updateData.mobileNumber = mobileNumber;
        if (email) {
            const trimmedEmail = trimString(email);
            if (trimmedEmail === "") {
                return res.json({
                    status: "FAILED",
                    message: "Email cannot be empty"
                });
            }
            updateData.email = trimmedEmail;
        }

        const updatedUser = await updateUserProfile(userId, updateData);

        res.json({
            status: "SUCCESS",
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: error.message || "An error occurred while updating profile"
        });
    }
});

// Upload Profile Picture
router.post('/upload-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.json({
                status: "FAILED",
                message: "No file uploaded."
            });
        }

        // Upload image to Cloudinary
        const base64Image = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
        const publicId = `profile_picture_${userId}_${uuidv4()}`;
        const result = await cloudinary.uploader.upload(dataUri, {
            upload_preset: 'airline_management',
            folder: 'airline_profile_pictures',
            public_id: publicId,
            quality: "auto",
            fetch_format: "auto",
            type: 'private',
            resource_type: 'image'
        });

        // Generate a signed URL that expires in 1 hour
        const signedUrl = cloudinary.url(result.public_id, {
            sign_url: true,
            type: 'private',
            expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 1 hour
            secure: true // Ensure HTTPS delivery
        });

        // Update user's profilePicture field with the signed URL
        const updatedUser = await updateUserProfile(userId, { profilePicture: result.public_id });

        res.json({
            status: "SUCCESS",
            message: "Profile picture uploaded and updated successfully",
            data: { ...updatedUser._doc, profilePicture: signedUrl } // Send signed URL to frontend for display
        });

    } catch (error) {
        console.error("Error uploading profile picture:", error);
        let errorMessage = "An unknown error occurred during profile picture upload.";
        if (error.http_code && error.http_code === 400 && error.message) {
            // Cloudinary API error (e.g., bad request, invalid parameters)
            errorMessage = `Cloudinary Error: ${error.message}`;
        } else if (error.message) {
            // General error message
            errorMessage = error.message;
        } else if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            // Axios-like error structure from fetch when response is not OK
            errorMessage = `API Error: ${error.response.data.error.message}`;
        }

        res.json({
            status: "FAILED",
            message: errorMessage
        });
    }
});

// Remove Profile Picture
router.delete('/remove-profile-picture/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const userData = await user.findById(userId);
        if (!userData || !userData.profilePicture) {
            return res.json({
                status: "FAILED",
                message: "No profile picture to remove."
            });
        }

        // Use the stored public_id directly
        const publicId = userData.profilePicture;

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, { type: 'private' });

        // Update user's profilePicture field to null in the database
        const updatedUser = await updateUserProfile(userId, { profilePicture: null });

        res.json({
            status: "SUCCESS",
            message: "Profile picture removed successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error removing profile picture:", error);
        res.json({
            status: "FAILED",
            message: error.message || "An error occurred while removing profile picture"
        });
    }
});

// Refresh Profile Picture URL
router.get('/refresh-profile-picture/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get the user's current profile picture public_id
        const userData = await user.findById(userId);
        if (!userData || !userData.profilePicture) {
            return res.json({
                status: "FAILED",
                message: "No profile picture found"
            });
        }

        // Use the stored public_id directly
        const publicId = userData.profilePicture;

        // Generate a new signed URL
        const signedUrl = cloudinary.url(publicId, {
            sign_url: true,
            type: 'private',
            expires_at: Math.floor(Date.now() / 1000) + 3600, // URL expires in 1 hour
            secure: true // Ensure HTTPS delivery
        });

        // Update the user's profile picture URL in DB (still storing public_id)
        // But send the signed URL to the frontend
        const updatedUser = await updateUserProfile(userId, { profilePicture: publicId });

        res.json({
            status: "SUCCESS",
            message: "Profile picture URL refreshed successfully",
            data: { ...updatedUser._doc, profilePicture: signedUrl }
        });

    } catch (error) {
        console.error("Error refreshing profile picture URL:", error);
        res.json({
            status: "FAILED",
            message: error.message || "An error occurred while refreshing profile picture URL"
        });
    }
});

module.exports = router;