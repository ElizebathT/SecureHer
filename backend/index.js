require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./database/connectDB");
const cookieParser = require("cookie-parser")
const errorHandler = require("./middlewares/errorHandler")
const router = require("./routes")
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session=require('express-session')


const app = express();

connectDB()

app.use(express.json());
app.use(cookieParser())
app.use(
    session({
        secret:"secret",
        resave:false,
        saveUninitialized:true
    })
)
app.use(passport.initialize());
app.use(passport.session())
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },(accessToken, refreshToken, profile, done)=> {           
            return done(null, profile);
        }
    )
);
passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))


app.use(router)
app.use(cors());
app.use(errorHandler)


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
