import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        
        if(!token){
            return res.status(401).send({error: 'Unauthorized user'});
        }

        const isBlacklisted = await redisClient.get(token);
        if(isBlacklisted){
            res.cookies('token','');
            return res.status(401).send({error: 'Unauthorized user'});
        }
        
        // console.log("Token received:", token); // Debugging

        // Verify the token
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.decode(token);
        // console.log("Decoded token:", decoded); // Debugging

        req.user = decoded;
        next();
    }
    catch(err){

        console.error("JWT Verification Error:", err.message); // Log the error
        return res.status(401).send({error: 'Unauthorized user'});
    }
}