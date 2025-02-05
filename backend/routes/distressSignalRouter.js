const express = require('express');
const distressSignalController = require('../controllers/distressSignalController');
const userAuthentication = require('../middlewares/userAuthentication');
const distressSignalRouter = express.Router();

distressSignalRouter.post('/send',userAuthentication, distressSignalController.sendDistressSignal);
distressSignalRouter.get('/get', userAuthentication,distressSignalController.getDistressSignalsByUser);
distressSignalRouter.patch('/resolve', userAuthentication,distressSignalController.resolveDistressSignal);

module.exports = distressSignalRouter;