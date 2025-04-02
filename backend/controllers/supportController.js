const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const SupportRequest = require("../models/supportModel");
const Notification = require("../models/notificationModel");

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const supportController={
    createSupportRequest:asyncHandler(async (req, res) => {
        const {requestDetails}=req.body
        const currentUser = await User.findOne({_id:req.user.id});
        if (!currentUser || !currentUser.location) {
            throw new Error("Current user location not found");
        }

        const allUsers = await User.find({ _id: { $ne: currentUser.id } });

        const nearbyUsers = allUsers.filter(user => {
            if (user.username !== "Admin" && user.location && user.location.latitude && user.location.longitude) {
                const distance = getDistance(
                    currentUser.location.latitude,
                    currentUser.location.longitude,
                    user.location.latitude,
                    user.location.longitude
                );
                return distance <= 5;
            }
            return false;
        });
        
        if (nearbyUsers.length === 0) {
            res.send("No nearby users found.");
        }
        const destination = `${currentUser.location.latitude},${currentUser.location.longitude}`;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

        const messageBody = `🚨 Support Request! 🚨\n${currentUser.username} is in distress at location:\n${googleMapsUrl}\n\n📌 Details: ${requestDetails}\n`;
        
        const client=req.client
        nearbyUsers.map(async (user) => {            
            if (user.phone) {
                const number="+91"+user.phone
                await client.messages.create({
                    body: messageBody,
                    from: req.number,
                    to: number,
                });
            }
        })
        const supportRequest = await SupportRequest.create({
            userId: currentUser._id,
            requestDetails,
            location: currentUser.location,
            nearbyUsers: nearbyUsers.map(user => user._id) // Save nearby users
        });
        if(!supportRequest){
            throw new Error("Failed to save the request!")
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
                message: "A support request has been sent.",
            });
            await notification.save();
            
            res.send({ message: "Distress signal sent, SMS delivered, and notification saved", distressSignal });
        })
            res.send("Request send")
      }),

      getNearbySupportRequests :asyncHandler(async (req, res) => {
        const userId = req.user.id;
        
        const supportRequests = await SupportRequest.find({
            nearbyUsers: userId
        }).populate("userId", "username email") // Optionally populate the userId to get user details
          .populate("nearbyUsers", "username email"); // Optionally populate the nearbyUsers to get user details
    
        if (supportRequests.length === 0) {
            res.send("No support requests received.");
        }
    
        res.send(supportRequests );
      }),
      
    completeSupportRequest :asyncHandler(async (req, res) => {
          const { id } = req.body;      
          const request = await SupportRequest.findById(id);
          if (!request) {
            throw new Error("Request not found");
          }      
          request.status = "completed";
          await request.save();      
          res.send("Request marked as completed");
      }),
}
module.exports=supportController