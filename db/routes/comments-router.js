const deleteComment = require("../../controllers/deleteComment");

const commentsRouter = require("express").Router();

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment);

module.exports = commentsRouter;