const express = require("express");
const userAuthentication = require("../middlewares/userAuthentication");
const adminController = require("../controllers/adminController");
const adminAuthentication = require("../middlewares/admin");

const adminRouter = express.Router();

adminRouter.get("/get", userAuthentication,adminAuthentication, adminController.getDashboardData);
adminRouter.put("/verify", userAuthentication,adminAuthentication, adminController.verifyUser);

module.exports = adminRouter;
