const express = require('express');
const userAuthentication = require('../middlewares/userAuthentication');
const reportingController = require('../controllers/reportingControllers');
const reportingRouter = express.Router();

reportingRouter.post('/create',userAuthentication, reportingController.createReport);
reportingRouter.get('/viewall', userAuthentication,reportingController.getReports);
reportingRouter.get('/get', userAuthentication,reportingController.getReportByUser);
reportingRouter.get('/search', userAuthentication,reportingController.getReportById);
reportingRouter.delete('/delete', userAuthentication,reportingController.deleteReport);

module.exports = reportingRouter;