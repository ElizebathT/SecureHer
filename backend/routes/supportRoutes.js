const express = require('express');
const userAuthentication = require('../middlewares/userAuthentication');
const supportController = require('../controllers/supportController');
const twilioClient = require('../middlewares/twilio');
const supportRouter = express.Router();

supportRouter.post('/create',userAuthentication, twilioClient,supportController.createSupportRequest);
supportRouter.get('/viewall',userAuthentication, supportController.getNearbySupportRequests);
supportRouter.put('/edit',userAuthentication, supportController.completeSupportRequest);

module.exports = supportRouter;