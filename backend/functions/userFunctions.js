const user = require("../models/user.model");
const userVerification = require("../models/userVerification.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
});

// Test transporter
transporter.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log("Ready for messages");
        console.log(success);
    }
});

// Helper function to trim string values
const trimString = (value) => {
    return typeof value === 'string' ? value.trim() : value;
};

// Validate user input
const validateUserInput = (name, email, password) => {
    if(name === "" || email === "" || password === "") {
        return {
            isValid: false,
            message: "Empty input fields!"
        };
    }
    if(!/^[a-zA-Z ]*$/.test(name)) {
        return {
            isValid: false,
            message: "Invalid name entered"
        };
    }
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return {
            isValid: false,
            message: "Invalid email entered"
        };
    }
    if(password.length < 8) {
        return {
            isValid: false,
            message: "Password is too short"
        };
    }
    return { isValid: true };
};

// Send verification email
const sendVerificationEmail = async ({_id, email}, res) => {
    const currentUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/`;
    const uniqueString = uuidv4() + _id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify your email address to complete the signup and login into your account</p><p>This link <b>expires in 6 hours.</b></p><p>Press <a href=${currentUrl + "user/verify/"+ _id + "/" + uniqueString}>here</a> to proceed</p>`
    };

    try {
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        
        const newVerification = new userVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        });

        await newVerification.save();
        await transporter.sendMail(mailOptions);
        
        res.json({
            status: "PENDING",
            message: "Verification email sent",
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "FAILED",
            message: "An error occurred while sending verification email"
        });
    }
};

// Verify email
const verifyEmail = async (userId, uniqueString, res) => {
    try {
        const result = await userVerification.find({ userId });
        
        if(result.length === 0) {
            return res.redirect(`/user/verified/error=true&message=Account record doesn't exist or has been verified already. Please sign up or log in.`);
        }

        const { expiresAt, uniqueString: hashedUniqueString } = result[0];

        if(expiresAt < Date.now()) {
            await userVerification.deleteOne({ userId });
            await user.deleteOne({ _id: userId });
            return res.redirect(`/user/verified/error=true&message=Link has expired. Please sign up again.`);
        }

        const isValidString = await bcrypt.compare(uniqueString, hashedUniqueString);
        
        if(!isValidString) {
            return res.redirect(`/user/verified/error=true&message=Invalid verification details passed. Check your inbox.`);
        }

        await user.updateOne({ _id: userId }, { verified: true });
        await userVerification.deleteOne({ userId });
        
        res.sendFile(path.join(__dirname, "./../views/verified.html"));
    } catch (error) {
        console.log(error);
        res.redirect(`/user/verified/error=true&message=An error occurred while verifying your email.`);
    }
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
    const existingUser = await user.findById(userId);
    if (!existingUser) {
        throw new Error("User not found");
    }

    // If email is being updated, validate it and check for duplicates
    if (updateData.email) {
        // Validate email format
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updateData.email)) {
            throw new Error("Invalid email format");
        }

        // Check if email is already in use by another user
        const emailExists = await user.findOne({ 
            email: updateData.email,
            _id: { $ne: userId } // Exclude current user
        });
        
        if (emailExists) {
            throw new Error("Email is already in use by another user");
        }
    }

    const updatedUser = await user.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return updatedUser;
};

module.exports = {
    trimString,
    validateUserInput,
    sendVerificationEmail,
    verifyEmail,
    updateUserProfile
}; 