const express = require("express");
const app = express();

const getEndpoints = require("../controllers/getEndpoints");
const getTopics = require("../controllers/getTopics");
const getArticleById = require("../controllers/getArticleById");
const getArticles = require("../controllers/getArticles");
const getCommentsByArticleId = require("../controllers/getCommentsByArticleId");
const postComment = require("../controllers/postComment");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg })
    }
    next(error);
});

app.use((error, request, response, next) => {
    if (error.code === "22P02" || error.code === "23502") {
        response.status(400).send({ msg: "Bad Request: invalid or missing field" });
    }
    next(error);
});

app.use((error, request, response, next) => {
    response.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;