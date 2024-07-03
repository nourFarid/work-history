const errorHandling = require('../utils/errorHandling');
const httpStatusText = require('../utils/httpStatusText');
const Project = require('../models/project.model');

// Create a new project
// const createProject = errorHandling.asyncHandler(async (req, res, next) => {
//   const project = req.body;

//   const newProject = await Project.create(project);
//   if (!newProject)
//     return next(new Error(`Can't create project`, { cause: 400 }));

//   return res.status(201).json({ status: httpStatusText.SUCCESS, data: { newProject } });
// });


const createProject = errorHandling.asyncHandler(async (req, res, next) => {
  const project = req.body;
  // const {createdBy}= req.body

  // Parse updates if present
  if (project.updates) {
    try {
      project.updates = JSON.parse(project.updates);
    } catch (error) {
      return next(new Error(`Invalid updates format`, { cause: 400 }));
    }
  }

  // Handle picture upload
  if (req.file) {
    project.picture = req.file.path; // Save the file path to the picture field
  }

  const newProject = await Project.create(project);
  if (!newProject) {
    return next(new Error(`Can't create project`, { cause: 400 }));
  }

  return res.status(201).json({ status: 'success', data: { newProject } });
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
  const {createdBy}= req.params
  const projects = await Project.find({createdBy});

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: { projects } });
});


const updateProjectGeneralById = async (req, res, next) => {
  const projectId = req.params.id;
  const updates = req.body;
  const { checkedBy, designedBy, ...updateFields } = updates; // Destructure checkedBy and designedBy separately

  try {
    // Update checkedBy if provided
    if (checkedBy) {
      await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { checkedBy: { $each: checkedBy } } }, // Use $addToSet to add unique items
        { new: true }
      );
    }

    // Update designedBy if provided
    if (designedBy) {
      await Project.findByIdAndUpdate(
        projectId,
        { $addToSet: { designedBy: { $each: designedBy } } }, // Use $addToSet to add unique items
        { new: true }
      );
    }

    // Update other fields using $set
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json({ status: 'success', data: { updatedProject } });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
};
  
  const updateProjectById = errorHandling.asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;
    const { updates } = req.body;  // Assuming updates is correctly structured as an array of objects
  
    const newUpdates = updates.map(update => ({
      update: update.update,
      updateDate: update.updateDate || Date.now()  // Use provided updateDate or current date
    }));
  
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $push: { updates: { $each: newUpdates } } },
        { new: true }
      );
  
      if (!updatedProject) {
        return next(new Error(`Can't update project`, { cause: 400 }));
      }
  
      return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updatedProject } });
    } catch (error) {
      return next(new Error(`Failed to update project: ${error.message}`));
    }
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
