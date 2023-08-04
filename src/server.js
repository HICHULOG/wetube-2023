import express from "express";

const app = express();

const PORT = 4000;

const gossipMiddleware = (req, res, next) => {
    console.log(`Someone is going to: ${req.url}`);
    next();
}

const handleHome = (req, res) => {
    return res.send("I love middlewares");
};

const handleLogin = (req, res) => {
    res.send("Login here.");
};

app.get("/", gossipMiddleware, handleHome);
app.get("/login", handleLogin);

const handleListening = () => 
    console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);