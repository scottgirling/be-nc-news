const express = require("express");
const app = express();

const getEndpoints = require("../controllers/getEndpoints");
const getTopics = require("../controllers/getTopics");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use((error, request, response, next) => {
    console.log(error);
    response.status(500).send({ msg: "Internal Server Error" });
})

module.exports = app;