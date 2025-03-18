import mongoose from 'mongoose';
import projectModel from "../models/project.model.js";

export const createProject = async({name,userId}) => {
    if(!name){
        throw new Error('Name is required');
    }
    if(!userId){
        throw new Error('User is required');
    }

    let project;
    try{
        project = await projectModel.create({
            name,
            users:[userId]
        });
    }
    catch(error){
        if(error.code===11000){
            throw new Error('Project name already exists');
        }
    }
    return project;
}

export const getAllProjects = async({userId}) => {
    if(!userId){
        throw new Error('User is required');
    }

    const projects = await projectModel.find({users:userId});
    return projects;
}

export const addUserToProject = async({projectId,users,userId}) => {
    if(!projectId){
        throw new Error('Project ID is required');
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid projectID');
    }
    if(!users || users.length===0){
        throw new Error('Users are required');
    }
    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))){
        throw new Error('Invalid userID in users array');
    }
    if(!userId){
        throw new Error('UserId is required');
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('Invalid userID');
    }

    // console.log(projectId,userId);
    const project = await projectModel.findById({
        _id:projectId,
        users:userId
    });
    if(!project){
        throw new Error('User not belong to this project.');
    }

    const newUsers = users.filter(user => !project.users.includes(user));
    project.users.push(...newUsers);
    await project.save();
    return project;
}

export const getProjectById = async({projectId}) => {
    if(!projectId){
        throw new Error('Project ID is required');
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Invalid projectID');
    }

    const project = await projectModel.findById(projectId).populate('users');
    return project;
}