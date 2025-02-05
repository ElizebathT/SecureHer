const express = require('express');
const userAuthentication = require('../middlewares/userAuthentication');
const resourcesController = require('../controllers/resourcesController');
const  upload  = require("../middlewares/cloudinary");
const resourcesRouter = express.Router();

resourcesRouter.post('/create',userAuthentication,upload.single("content"), resourcesController.createResource);
resourcesRouter.get('/get', userAuthentication,resourcesController.getResources);
resourcesRouter.get('/search', userAuthentication,resourcesController.getResourceById);
resourcesRouter.put('/edit', userAuthentication,resourcesController.updateResource);
resourcesRouter.delete('/delete', userAuthentication,resourcesController.deleteResource);

module.exports = resourcesRouter;