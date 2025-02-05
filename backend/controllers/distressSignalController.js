const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const DistressSignal = require("../models/distressSignalModel");

const distressSignalController={
    sendDistressSignal :asyncHandler(async (req, res) => {
        const { location } = req.body;
        const userId=req.user.id
        const user = await User.findById(userId);
        if (!user) res.send('User not found');
            
        const distressSignal = new DistressSignal({
                userId,
                location,
        });
        const complete=await distressSignal.save();
        if(!complete){
            res.send({ message: 'Server error', error });
        }
            res.send({ message: 'Distress signal sent', distressSignal });
        
    }),
    getDistressSignalsByUser :asyncHandler( async (req, res) => {
        const  userId = req.user.id;
        const signals = await DistressSignal.find({ userId });
        if(!signals){
            res.send("No signals found!")
        }
        res.send(signals);
    }),

    resolveDistressSignal: asyncHandler(async (req, res) => {
            const { id } = req.body;
            const updatedSignal = await DistressSignal.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
            if (!updatedSignal) res.send('Distress signal not found' );
            res.send({ message: 'Distress signal resolved', updatedSignal });
            
        
    })
}
module.exports=distressSignalController