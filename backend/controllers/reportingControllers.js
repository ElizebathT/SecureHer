const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const Report = require("../models/reportingModel");

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