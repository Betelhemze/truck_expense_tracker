const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("mongoDB connected!!!");

    app.listen(PORT, () =>{
        console.log("server running on port 5000!!");
    })
})
.catch((err) => {
    console.error("MongoDB connection error:");
    console.error(err.message);

});