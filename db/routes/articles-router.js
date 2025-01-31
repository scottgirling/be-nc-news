const getArticles = require("../../controllers/getArticles");
const getArticleById = require("../../controllers/getArticleById");
const patchArticle = require("../../controllers/patchArticle");
const getCommentsByArticleId = require("../../controllers/getCommentsByArticleId");
const postComment = require("../../controllers/postComment");

const articlesRouter = require("express").Router();

articlesRouter
    .route("/")
    .get(getArticles);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticle)

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articlesRouter;