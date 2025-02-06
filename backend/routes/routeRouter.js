const express = require('express');
const userAuthentication = require('../middlewares/userAuthentication');
const routeController = require('../controllers/routeController');
const routeRouter = express.Router();

routeRouter.get('/create',userAuthentication, routeController.getRouteWithMostUsersNearby);
routeRouter.get('/locations',userAuthentication, routeController.getAllDistressSignalLocations);

module.exports = routeRouter;