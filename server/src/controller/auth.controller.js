const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register
exports.register = async (req,res) =>{
    try{
        const{
            fullName,
            email,
            password,
            role,
            phone,
            licenseNumber,
        } = req.body;

        //check exisiting user
        const exisitingUser = await User.findOne({email});

        if(exisitingUser){
            return res.status(400).json({
                message: "user already exists"
            });
        }
        
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            phone,
            licenseNumber,
        });
        res.status(201).json({
            message: "user created successfully",
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//login
exports.login = async (req,res) =>{
    try{
        const {email, password} = req.body;

        //check user
        const user = await User.findOne({email});
        if (!user){
            return res.status(404).json({
                message: "user not found"
            });
        }

        //compare password
        const isMatch = await bcrypt.compare(
            password, 
            user.password
        );
        if (!isMatch){
            return res.status(400).json({
                message: "invalid credentials",
            });
        }
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );
        res.status(200).json({
            message: "login successful",
            token,
            user,

        });
    } catch (error){
        res.status(500).json({
            message: error.message,
        });
    }
};