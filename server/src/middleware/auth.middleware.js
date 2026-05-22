const jwt = require("jsonwebtoken");

exports.protect = async (req,res,next) =>  {
    try{
        let token;

        //check authorization header
        if(
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")

        ) {
            token = req.headers.authorization.split(" ")[1];

        }

        //no token
        if(!token){
            return res.status(401).json({
                message: "not authorized, no token",
            });
        }
        //verify token
        const decoded = jwt.verify(
            token, process.env.JWT_SECRET
        );

        //attach user info to request
        req.user = decoded;
        next();
    } catch(err){
        return res.status(401).json({
            message: "not authorized",

        });
    }
};