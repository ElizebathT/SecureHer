const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const DistressSignal = require("../models/distressSignalModel");

const distressSignalController={
    sendDistressSignal :asyncHandler(async (req, res) => {
        const { location } = req.body;
        const userId=req.user.id
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
            
        const distressSignal = new DistressSignal({
                userId,
                location,
        });
        const complete=await distressSignal.save();
        if(!complete){
            throw new Error('Error in creating signal');
        }
            res.send({ message: 'Distress signal sent', distressSignal });
        
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