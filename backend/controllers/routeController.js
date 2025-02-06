const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const Report = require("../models/reportingModel");
const DistressSignal = require("../models/distressSignalModel");

const routeController={
    getRouteWithMostUsersNearby :asyncHandler(async (req, res) => {
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }
    
        // Encode address for URL
        const destination = `${latitude},${longitude}`;
        
        // Query to get all user locations (replace with your actual query)
        const users = await User.find(); // Assuming lat and lng fields in your User model
        const userLocations = users.map(user => ({
            latitude: user.latitude,
            longitude: user.longitude,
        }));
    
        // Google Maps URL format for directions from current location
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    
        res.json({ googleMapsUrl, userLocations });
    }),
    
    getAllDistressSignalLocations:asyncHandler(async (req, res) => {
        const distressSignals = await DistressSignal.find({}, "location");
        const reports = await Report.find({}, "location");
    
        // Combine locations from both distress signals and reports
        const allLocations = [
          ...distressSignals.map(signal => signal.location),
          ...reports.map(report => report.location)
        ];
    
        // Return the unique locations
        const uniqueLocations = [...new Set(allLocations.map(JSON.stringify))].map(JSON.parse);
        res.send({
          locations: uniqueLocations,
        });
    })
}
module.exports=routeController