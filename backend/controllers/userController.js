const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler=require("express-async-handler")
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const userController={
    forgotPassword: asyncHandler(async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
            throw new Error("User not found");
        }
    
        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    
        // Set token and expiration
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();
    
        // Construct reset link (Frontend URL should handle token submission)
        const resetLink = `http://yourfrontend.com/reset-password/${resetToken}`;
    
        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        };
    
        await transporter.sendMail(mailOptions);
    
        res.send({ message: "Password reset link sent to email" });
    }),
    
   resetPassword : asyncHandler(async (req, res) => {
        const { token, newPassword } = req.body;
    
        // Hash the token to match the stored hash
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: Date.now() },
        });
    
        if (!user) {
            throw new Error("Invalid or expired token");
        }
    
        // Hash new password and update user
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
    
        res.send({ message: "Password reset successfully" });
    }),

    register : asyncHandler(async(req,res)=>{        
        const { username, email, password, emergencyContacts, phone } = req.body;
        const userExits=await User.findOne({username})
        if(userExits){
            throw new Error("User already exists")
        }
        const hashed_password=await bcrypt.hash(password,10)
        const userCreated=await User.create({
            username,
            email,
            phone,
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
        const passwordMatch=await bcrypt.compare(password,userExist.password)
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

    getUserProfile : asyncHandler(async (req, res) => {
            const userId = req.user.id;         
            const user = await User.findById(userId).select("-password"); 
            if (!user) {
                throw new Error("User not found");
            }        
            res.send({
                message: "User details retrieved successfully",
                user
            });
        }),

    logout:asyncHandler(async(req,res)=>{
        res.clearCookie("token")
        res.send("User logged out")
        }),

    profile:asyncHandler(async (req, res) => {
        const { username, password, emergencyContacts,phone } = req.body;
        const userId = req.user.id; 
        const user = await User.findOne({_id:userId});
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
        user.phone = phone || user.phone;            
        const updatedUser = await user.save();            
        if(!updatedUser){
            res.send('Error in updating')
        }
        res.send(user);
     }),
    updateLocation:asyncHandler(async (req, res) => {
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
    }),
    getLocation:asyncHandler(async (req, res) => {
        const { email } = req.body; 
        const user = await User.findOne({_id:req.user.id});

        const requestingUser = await User.findOne({email});

        if (!requestingUser) {
            throw new Error("Requesting user not found");
        }

        // Check if requesting user is in the emergencyContacts list of the target user
        if (!user.emergencyContacts.includes(requestingUser.phone)) {
            throw new Error("You are not authorized to view this user's location" );
        }

        // Return the location of the user
        res.send({ location: user.location });
    })
}
module.exports=userController