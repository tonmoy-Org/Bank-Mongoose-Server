const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

require("dotenv").config();
// middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://exe-software.web.app', 'https://exeservice.online']
}))
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;


const userRoute = require("./routes/userRoutes");
const accountRoute = require("./routes/accountRoutes");
const authRoute = require("./routes/authRoutes");


mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.mj9te36.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    )
    .then(() => {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


app.use('/api/users', userRoute)
app.use('/api/account-bank', accountRoute)
app.use('/api', authRoute);


// Test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Bank-server" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Bank-Server is running on port ${PORT}`);
});
