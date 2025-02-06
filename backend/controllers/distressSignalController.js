const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const DistressSignal = require("../models/distressSignalModel");

const distressSignalController={
    sendDistressSignal :asyncHandler(async (req, res) => {
        
        const userId = req.user.id;
        const client=req.client
        const user = await User.findById(userId);
        const location = user.location
        if (!user) throw new Error('User not found');

        if (!user.emergencyContacts) {
            throw new Error('No emergency contact found');
        }

        const distressSignal = new DistressSignal({
            userId,
            location,
        });

        const complete = await distressSignal.save();
        if (!complete) {
            throw new Error('Error in creating signal');
        }
        const phone="+91"+user.emergencyContacts
        const destination = `${location.latitude},${location.longitude}`;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
        
        const messageBody = `Emergency Alert! ${user.username} is in distress at location: ${googleMapsUrl}. Please check immediately.`;
        
            await client.messages.create({
                body: messageBody,
                from: req.number,
                to: phone, 
            });
            res.send({ message: 'Distress signal sent and SMS delivered', distressSignal });
    }),
    getDistressSignalsByUser :asyncHandler( async (req, res) => {
        const  userId = req.user.id;
        const signals = await DistressSignal.find({ userId });
        if(!signals){
            throw new Error("No signals found!")
        }
        res.send(signals);
    }),

    resolveDistressSignal: asyncHandler(async (req, res) => {
            const { id } = req.body;
            const updatedSignal = await DistressSignal.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
            if (!updatedSignal) throw new Error('Distress signal not found' );
            res.send({ message: 'Distress signal resolved', updatedSignal });
            
        
    })
}
module.exports=distressSignalController