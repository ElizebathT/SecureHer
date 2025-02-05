const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler=require("express-async-handler")
const express=require('express')
const userController={
    register : asyncHandler(async(req,res)=>{        
        const { username, email, password, emergencyContacts } = req.body;
        const userExits=await User.findOne({username})
        if(userExits){
            throw new Error("User already exists")
        }
        const hashed_password=await bcrypt.hash(password,10)
        const userCreated=await User.create({
            username,
            email,
            password:hashed_password,
            emergencyContacts
        })
        if(!userCreated){
            throw new Error("User creation failed")
        }
        const payload={
            email:userCreated.email,
            id:userCreated.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            http:true,
            sameSite:"none",
            secure:false
        })
        res.send("User created successfully")
    }),

    googleRegister : asyncHandler(async(req,res)=>{        
        const email=req.user.emails[0].value
        const userExits=await User.findOne({email})
        if(!userExits){
            
        const userCreated=await User.create({        
            email,
            username:email
        })
        if(!userCreated){
            throw new Error("User creation failed")
        }
        const payload={
            email:userCreated.email,
            id:userCreated.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            http:true,
            sameSite:"none",
            secure:false
        })
    }
        res.send("User created successfully")
    }),
    
    login :asyncHandler(async(req,res)=>{
        const {email,password}=req.body
        const userExist=await User.findOne({email})
        if(!userExist){
            throw new Error("User not found")
        }
        const passwordMatch= bcrypt.compare(userExist.password,password)
        if(!passwordMatch){
            throw new Error("Passwords not matching")
        }
        const payload={
            email:userExist.email,
            id:userExist.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            sameSite:"none",
            http:true,
            secure:false
        })        
        res.send("Login successful")
        }),

    logout:asyncHandler(async(req,res)=>{
        res.clearCookie("token")
        res.send("User logged out")
        }),

    profile:asyncHandler(async (req, res) => {
        const { username, password, emergencyContacts } = req.body;
        const { userId } = req.user.id; 
        const user = await User.findOne({id:userId});
        if (!user) {
            throw new Error("User not found");
        }       
        let hashed_password = user.password; 
        if (password) {
            hashed_password = await bcrypt.hash(password, 10);
        }            
        user.username = username || user.username;
        user.password = hashed_password;
        user.emergencyContacts = emergencyContacts || user.emergencyContacts;            
        const updatedUser = await user.save();            
        if(!updatedUser){
            res.send('Error in updating')
        }
        res.send(user);
     }),
    getLocation:asyncHandler(async (req, res) => {
        const { latitude, longitude } = req.body;
        const user = await User.findOne({_id:req.user.id});
        if (!user) {
            res.send('User not found');
        }
        user.location = {
            latitude: latitude,
            longitude: longitude
        };
        await user.save();
        res.send({
            message: 'Location updated successfully',
            location: user.location
        });
    })
}
module.exports=userController