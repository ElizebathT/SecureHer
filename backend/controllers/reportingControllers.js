const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const Report = require("../models/reportingModel");
const Notification = require("../models/notificationModel");

const reportingController={
    createReport :asyncHandler(async (req, res) => {
        const { incidentDetails,  reportType, anonymous } = req.body;    
        const user=await User.findOne({_id:req.user.id})
        const location =user.location
        const reportData = {
          incidentDetails,
          location,
          reportType,
          anonymous
        };    
        if(anonymous=="false"){
          reportData.userId=req.user.id
          
        }
        const newReport = new Report(reportData);
        const complete=await newReport.save();   
        if(!complete){
          throw new Error("Failed to report")
        } 
        const sendDistressSignal = asyncHandler(async (req, res) => {
          const userId = req.user.id;
          const client = req.client;
          const user = await User.findById(userId);
          
          if (!user) throw new Error("User not found");
          if (!user.emergencyContacts) throw new Error("No emergency contact found");
      
          const location = user.location;
          const distressSignal = new DistressSignal({ userId, location });
          const complete = await distressSignal.save();
      
          if (!complete) {
              throw new Error("Error in creating signal");
          }
      
          const phone = "+91" + user.emergencyContacts;
          const destination = `${location.latitude},${location.longitude}`;
          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
          const messageBody = `Emergency Alert! ${user.username} is in distress at location: ${googleMapsUrl}. Please check immediately.`;
          
          // Send SMS notification
          await client.messages.create({
              body: messageBody,
              from: req.number,
              to: phone,
          });
          
          // Save notification in the database
          const notification = new Notification({
              user: userId,
              message: "A report has been filed.",
          });
          await notification.save();
          
          res.send({ message: "Distress signal sent, SMS delivered, and notification saved", distressSignal });
      })
        res.send({ message: "Report submitted successfully", report: newReport });
    }),
    
  getReports :asyncHandler(async (req, res) => {
        const reports = await Report.find().select("-__v"); 
        if(!reports)
        {
          res.send('No reports found')
        }
        res.send(reports);
    }),
    
  getReportByUser :asyncHandler(async (req, res) => {
        const report = await Report.find({userId:req.user.id});
        if (!report) {
          res.send("No report found" );
        }
        res.status(200).json(report);
    }),

  getReportById :asyncHandler(async (req, res) => {
    const {incidentDetails,reportType}=req.body
        const searchCriteria = {};
        if(incidentDetails){
        searchCriteria.incidentDetails = { $regex: incidentDetails, $options: "i" };}
        if(reportType){
          searchCriteria.reportType = { $regex: reportType, $options: "i" };}
        const report = await Report.find(searchCriteria);
        if (!report) {
          throw new Error("Report not found");
        }
        res.send(report);
    }),
    
  deleteReport:asyncHandler( async (req, res) => {
    const {id}=req.body
        const report = await Report.deleteOne({_id:id,userId:req.user.id});    
        if (!report) {
          throw new Error("Report not found or Delete function failed");
        }  
        res.send("Report deleted successfully");
    }),    
}
module.exports=reportingController