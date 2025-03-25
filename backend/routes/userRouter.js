const express = require("express");
const userController = require("../controllers/userController");
const userAuthentication = require("../middlewares/userAuthentication");
const userRoutes = express.Router();

userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.put("/edit", userAuthentication,userController.profile);
userRoutes.put("/addemergency", userAuthentication,userController.emergencyContacts);
userRoutes.delete("/logout", userController.logout);
userRoutes.post("/location", userAuthentication,userController.updateLocation);
userRoutes.get("/view", userAuthentication,userController.getUserProfile);
userRoutes.get("/find", userAuthentication,userController.getLocation);
userRoutes.get("/emergency", userAuthentication,userController.view_emergency);
userRoutes.get("/forgot", userController.forgotPassword);
userRoutes.put("/reset", userController.resetPassword);

module.exports = userRoutes;
