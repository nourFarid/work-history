const errorHandling = require('../utils/errorHandling');
const httpStatusText = require('../utils/httpStatusText');
const Project = require('../models/project.model');

// Create a new project
const createProject = errorHandling.asyncHandler(async (req, res, next) => {
  const project = req.body;

  const newProject = await Project.create(project);
  if (!newProject)
    return next(new Error(`Can't create project`, { cause: 400 }));

  return res.status(201).json({ status: httpStatusText.SUCCESS, data: { newProject } });
});

// Get a project by ID
const getProjectById = errorHandling.asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  const project = await Project.findById(projectId);
  if (!project)
    return next(new Error(`Project not found`, { cause: 404 }));

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { project } });
});

// Get all projects
const getAllProjects = errorHandling.asyncHandler(async (req, res, next) => {
  const projects = await Project.find();

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { projects } });
});


const updateProjectGeneralById = errorHandling.asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const updates = req.body;
    const { checkedBy, designedBy } = req.body;
  
    let updateFields = { ...updates };
  
    // Remove checkedBy and designedBy from general updates as they need to be pushed
    delete updateFields.checkedBy;
    delete updateFields.designedBy;
  
    // Perform $push operations separately for checkedBy and designedBy
    if (checkedBy) {
      await Project.findByIdAndUpdate(
        projectId,
        { $push: { checkedBy: checkedBy } },
        { new: true }
      );
    }
  
    if (designedBy) {
      await Project.findByIdAndUpdate(
        projectId,
        { $push: { designedBy: designedBy } },
        { new: true }
      );
    }
  
    // Perform $set operation for the rest of the fields
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateFields },
      { new: true }
    );
  
    if (!updatedProject) {
      return next(new Error(`Can't update project`, { cause: 400 }));
    }
  
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedProject } });
  });
  
  module.exports = {
    updateProjectGeneralById,
  };
  
const updateProjectById = errorHandling.asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;
  const updates = req.body.updates;


  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $push: {
         updates: [{ update: updates, updateDate: Date.now() }] 
        
        } },
    { new: true }
  );
  if (!updatedProject)
    return next(new Error(`Can't update project`, { cause: 400 }));

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedProject } });
});
// Update a submittionPackage by ID
const updateSubmittionPackageById = errorHandling.asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;
  const updates = req.body.updates;


  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $push: {
        submittionPackage: updates
        
        } },
    { new: true }
  );
  if (!updatedProject)
    return next(new Error(`Can't update project`, { cause: 400 }));

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedProject } });
});

// Delete a project by ID
const deleteProjectById = errorHandling.asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject)
    return next(new Error(`Can't delete project`, { cause: 400 }));

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { deletedProject } });
});

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  updateProjectById,
  deleteProjectById,
  updateSubmittionPackageById,
  updateProjectGeneralById
};
