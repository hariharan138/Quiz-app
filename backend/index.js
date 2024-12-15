require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const QuizRoutes = require('./Routes/routes');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/quiz", QuizRoutes);
app.get("/", (req, res) => {
    res.send("Quiz API is running!");
});

// MongoDB Atlas connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("Error: MONGODB_URI is not defined in the .env file.");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Atlas Connected Successfully"))
    .catch(err => {
        console.error("MongoDB Atlas Connection Error:", err);
        process.exit(1);
    });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
