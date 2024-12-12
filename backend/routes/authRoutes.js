const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ 
        _id: user._id,
        email: user.email 
    }, process.env.JWT_SECRET, { expiresIn: "1h"});
};

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({error: "User already exists"});
        }
        const user = new User({ email, password });
        await user.save();
        const token = generateToken(user);
        res.status(201).json({token, message: "User created successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = generateToken(user);
        res.status(400).json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
});

module.exports = router;