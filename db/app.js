const express = require("express");
const app = express();

const getEndpoints = require("../controllers/getEndpoints");
const getTopics = require("../controllers/getTopics");
const getArticleById = require("../controllers/getArticleById");
const getArticles = require("../controllers/getArticles");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg })
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "22P02") {
        response.status(400).send({ msg: "bad request: invalid ID" });
    }
    next(error);
});

app.use((error, request, response, next) => {
    response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;