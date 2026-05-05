import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async(req, res) => {
    const {name, email, password} = req.body;

    try{
        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({error: "Email already exists"});

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        res.json({message: "User created successfully"});
    }catch(err){
        res.status(500).json({error: "Something went wrong"});
    }
});

router.post("/login",async(req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error: "User not found"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({error: "Wrong password"});

        const token = jwt.sign(
            {userId: user._id, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({token, name: user.name});
    }catch(err){
        res.status(500).json({error: "Something went wrong"});
    }
});

export default router;