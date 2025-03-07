import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedinUser = await userModel.findOne({ email: req.user.email });

        // Check if loggedinUser is found
        if (!loggedinUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = loggedinUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

export const getAllProjects = async (req, res) => {
    try {
        const loggedinUser = await userModel.findOne({ email: req.user.email });

        // Check if loggedinUser is found
        if (!loggedinUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = loggedinUser._id;
        // console.log(userId);
        const projects = await projectService.getAllProjects(userId);

        return res.status(200).json({ projects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users } = req.body;
        const loggedinUser = await userModel.findOne({ email: req.user.email });

        // Check if loggedinUser is found
        if (!loggedinUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = loggedinUser._id;

        const updatedProject = await projectService.addUserToProject({ projectId,users,userId });

        return res.status(200).json(updatedProject);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message});
    }
}

export const getProjectById = async (req, res) => {
    try {
        const {projectId} = req.params;

        const project = await projectService.getProjectById({projectId});

        return res.status(200).json(project);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
}