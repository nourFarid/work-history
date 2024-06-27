const express = require('express');
const router = express.Router();
const projectController = require('./project.controller');

router.post('/createProject', projectController.createProject);
router.get('/getProjectById/:id', projectController.getProjectById);
router.get('/getAllProjects', projectController.getAllProjects);
router.put('/updateProjectById/:id', projectController.updateProjectById);
router.put('/updateSubmittionPackageById/:id', projectController.updateSubmittionPackageById);
router.put('/updateProjectGeneralById/:id', projectController.updateProjectGeneralById);
router.delete('/deleteProjectById/:id', projectController.deleteProjectById);

module.exports = router;
