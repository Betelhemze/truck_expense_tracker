const User = require("../models/User");

//get all drivers
exports.getDrivers = async (req,res) => {
    try{

        const drivers = await User.find({
            role: "driver",
        }).select("-password");

        res.status(200).json(drivers);

    } catch (error)
{
    res.status(500).json({
        message: error.message,
    });
}
};

//get single driver
exports.getDriverById = async (req, res) => {
    try{
        const driver = await User.findOne({
            _id: req.params.id,
            role: "driver",
        }).select("-password");

        if (!driver){
            return res.status(404).json({
                message: "Driver not found"
            });
        }
        res.status(200).json(driver);
        } catch (error){
            res.status(500).json({
                message: error.message,
            });
        }
};

//create driver
exports.createDriver = async (req,res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            licenseNumber,
        } = req.body;

        //check if driver exist
        const existingUser = await User.findOne({
            email,
        });

        if (existingUser){
            return res.status(400).json({
                message: "Driver already exists",
            });
        }
        const bcrypt = require("bcryptjs");

        //hash password 
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        //create driver
        const driver = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: "driver",
            phone,
            licenseNumber,
        });
        res.status(201).json({
            message: "Driver created successfully",
            driver: {
            _id: driver._id,
            fullName: driver.fullName,
            email: driver.email,
            role: driver.role,
  },
        });
    } catch (error)
{
    res.status(500).json({
        message: error.message,
    });
}
};

//update driver
exports.updateDriver = async (req,res) => {
    try{
        const updateDriver = await User.findOneAndUpdate({
            _id: req.params.id,
            role: "driver",
        },
        req.body,
        {
            new: true,
        }
        ).select("-password");

        if (!updateDriver){
            return res.status(404).json({
                message: "Driver not found",
            });
        }

        res.status(200).json({
            message: "Driver updated successfully",
            updateDriver,
        });
    } catch (error)
{
    res.status(500).json({
        message: error.message,
    });
}    
};

//delete driver
exports.deleteDriver = async (req,res) =>{
    try{
        const deletedDriver = await User.findOneAndDelete({
            _id: req.params.id,
            role: "driver",
        });

        if (!deletedDriver){
            return res.status(404).json({
                message: "driver not found",
            });
        }
        res.status(200).json({
            message: "Driver deleted successfully",
        });

    } catch (error){
        res.status(500).json({
            message: error.message,
        });
    }
};


