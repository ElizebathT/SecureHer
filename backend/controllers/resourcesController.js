const asyncHandler=require("express-async-handler");
const EducationalResource = require("../models/resourcesModel");

const resourcesController={
    getResources:asyncHandler(async (req, res) => {
          const resources = await EducationalResource.find();
          if(!resources){
            tres.send('No resources found')
          }
          res.send(resources);
      }),
      
    getResourceById : asyncHandler(async (req, res) => {
        const {title}=req.body
        const searchCriteria = {};
        searchCriteria.title = { $regex: title, $options: "i" };
          const resource = await EducationalResource.find(searchCriteria);
          if (!resource) throw new Error("Resource not found");
          res.send(resource);
      }),
      
      createResource :asyncHandler(async (req, res) => {
        const { title, type, content, author } = req.body;
        const existingResource = await EducationalResource.findOne({ title, type,author });      
        if (existingResource) {
          throw new Error("A resource with the same title and type already exists.");
        }      
        const newResource = new EducationalResource({ title, type, content:req.file.path, author });      
        const complete = await newResource.save();
        if (!complete) {
          throw new Error("Error in creating resource");
        }      
        res.send(newResource);
      }),
      
    updateResource :asyncHandler(async (req, res) => {
        const { id,title, type, author } = req.body;
          const updatedResource = await EducationalResource.findOne({_id:id});
          if (!updatedResource) throw new Error("Resource not found");
          updatedResource.title = title || updatedResource.title;
          updatedResource.type = type || updatedResource.type;
          updatedResource.author = author || updatedResource.author;
          await updatedResource.save()
          res.send(updatedResource);
      }),
      
    deleteResource :asyncHandler(async (req, res) => {
        const { title} = req.body;
          const deletedResource = await EducationalResource.deleteOne({title});
          if (!deletedResource) throw new Error("Resource not found or Deletion failed" );
          res.send("Resource deleted successfully");
    })
}
module.exports=resourcesController