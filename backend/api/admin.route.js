const express = require("express");
const router = express.Router();

//mongo user model
const Admin = require("../models/admin.model");

//password handler 
const bcrypt = require("bcrypt");

//signup
router.post("/signup", (req,res) =>{
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();
    
    if(name == "" || email == "" || password == "" || dateOfBirth == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    }else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        });
    }else if(password.length < 8){
        res.json({
            status: "FAILED",
            message: "Password is too short"
        });
    }else{
        //checking if admin already exist
        Admin.find({email}).then(result => {
            if(result.length) {
                //An admin already exists
                console.log(err);
                res.json({
                    status: "FAILED",
                    message: "Admin with provided email already exists!"
                }); 
            }else{
                //Try to create admin

                //password handling
                const saltRounds = 10 ;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newAdmin = new Admin({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    })

                    newAdmin.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while Saving the Admin!"
                        })
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing the password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An Error Occured while checking for existing user!"
            });
        })
    }
})

//signin
router.post("/signin", (req,res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();
    
    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied!"
        });
    }else{
        //check if user exist
        Admin.find({email})
            .then(data => {
                if(data.length){
                    //user exist

                    const hashedPassword = data[0].password;
                    bcrypt.compare(password,hashedPassword).then(result => {
                    if(result) {
                        //password match
                        res.json({
                            status : "SUCCESS",
                            message: "Signin successful",
                            data: data
                        });
                    }else{
                        res.json({
                            status : "FAILED",
                            message: "Invalid password entered!",
                        });
                    }
                    })
                    .catch(err => {
                        res.json({
                            status : "FAILED",
                            message: "An error occured while comparing the passwords",
                        });
                    })
                }else {
                    res.json({
                        status: "FAILED",
                        message: "Invalid credentials supplied!"
                    });
                }
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while checking for existing user!"
                })
            })
    }
})

module.exports = router ;