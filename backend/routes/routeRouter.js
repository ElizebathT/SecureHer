const express = require('express');
const userAuthentication = require('../middlewares/userAuthentication');
const routeController = require('../controllers/routeController');
const routeRouter = express.Router();

routeRouter.get('/create',userAuthentication, routeController.getRouteWithMostUsersNearby);

module.exports = routeRouter;