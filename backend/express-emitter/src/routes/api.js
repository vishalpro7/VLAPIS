const express = require("express")

const router = express.Router()

router.get("/users", (req, res) => {
    setTimeout(() => {
        res.status(200).json({
            success : true, 
            data : [
                {id : "u101", name : "Alice"}, 
                {id : "u102", name : "Bob"}
            ]
        });
    }, Math.random() * 3000);
});

router.get("/products", (req, res) => {
    setTimeout(() => {
        res.status(200).json({
            success : true, 
            data : [
                {id : "p101", name : "Laptop"},
                {id : "p102", name : "Keyboard"}
            ]
        });
    }, Math.random() * 5000);
});

router.post("/login", (req, res) => {
    setTimeout(() => {
        res.status(200).json({
            success : true, 
            message : "Login Successful"
        });
    }, Math.random() * 250);
});

router.get("/health", (req, res) => {
    res.status(200).json({
        status : "healthy"
    });
});

router.get("/simulation/error", (req, res) => {
  res.status(500).json({
    success: false,
    message: "Simulated internal server error"
  });
});

module.exports = router;

