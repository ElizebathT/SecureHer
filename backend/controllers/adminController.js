const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const DistressSignal = require("../models/distressSignalModel");
const Report = require("../models/reportingModel");
const SupportRequest = require("../models/supportModel");

const adminController={
    getDashboardData :asyncHandler(async (req, res) => {
        const userCount = await User.countDocuments({ role: { $ne: "admin" } });
          const signalCount = await DistressSignal.find();
          const reportCount = await Report.find();
      
          const dashboard = {
            userCount,
            signalCount,
            reportCount,
          };
      
          res.send(dashboard);
        
      }),
      
    verifyUser:asyncHandler(async (req, res) => {
        const { id,status } = req.body;
        const user = await User.findOne({ id });
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        if (status === "approved") {
            user.verified = true;
        } else if (status === "rejected") {
            user.verified = false;
        }
    
        await user.save();
        res.json({ message: "User verification updated"});
    }),
    viewallSupport:asyncHandler(async (req, res) => {
        const requests = await SupportRequest.find();    
        res.send(requests);      
    }),
}
module.exports=adminController