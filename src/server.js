import express from "express";

const PORT = 4000;

const app = express();

const gossipMiddleware = (req, res, next) => {
    console.log(`Someone is going to: ${req.url}`);
    next();
}

const handleHome = (req, res) => {
    return res.send("I love middlewares");
};

app.get("/", gossipMiddleware, handleHome);

app.listen(PORT, () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀.`));