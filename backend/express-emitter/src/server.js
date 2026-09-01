require("dotenv").config();

const express = require("express");

const requestLogger = require("./middleware/requestLogger");
const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(requestLogger);

app.use("/api", apiRoutes);

app.use((req, res) => {
    res.status(404).json({
        success : false, 
        message : "Route not found!"
    });
});

app.use((req, res) => {
    res.status(500).json({
        success : false, 
        message : "Simulated internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`VLAPIS Express Emitter running on port ${PORT}`);
});
