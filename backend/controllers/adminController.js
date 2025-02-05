const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const DistressSignal = require("../models/distressSignalModel");
const Report = require("../models/reportingModel");

const adminController={
    getDashboardData :asyncHandler(async (req, res) => {
          const userCount = await User.find();
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
        const {email}=req.body
        const user= await User.findOne({email})
        if(!user){
            throw new Error('User not found')
        }
        user.verified=true
        await user.save()
        res.send("User verified")
    }),
}
module.exports=adminController