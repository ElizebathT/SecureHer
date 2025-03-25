const express=require("express");
const userRoutes = require("./userRouter");
const distressSignalRouter = require("./distressSignalRouter");
const passport = require("passport");
const userController = require("../controllers/userController");
const resourcesRouter = require("./resourcesRouter");
const reportingRouter = require("./reportingRouter");
const routeRouter = require("./routeRouter");
const supportRouter = require("./supportRoutes");
const notificationRouter = require("./notificationRoutes");
const adminRouter = require("./adminRoutes");
const router=express()

router.use("/users", userRoutes);
router.use("/admin", adminRouter);
router.use("/signal", distressSignalRouter);
router.use("/resources", resourcesRouter);
router.use("/reports", reportingRouter);
router.use("/route", routeRouter);
router.use("/support", supportRouter);
router.use("/notification", notificationRouter);
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",passport.authenticate("google", { failureRedirect: "/" }),userController.googleRegister);
 
module.exports=router