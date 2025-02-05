const express=require("express");
const userRoutes = require("./userRouter");
const distressSignalRouter = require("./distressSignalRouter");
const passport = require("passport");
const userController = require("../controllers/userController");
const router=express()

router.use("/users", userRoutes);
router.use("/signal", distressSignalRouter);
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/" }),userController.googleRegister);
 
module.exports=router