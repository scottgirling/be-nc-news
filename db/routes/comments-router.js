const deleteComment = require("../../controllers/deleteComment");
const patchComment = require("../../controllers/patchComment");

const commentsRouter = require("express").Router();

commentsRouter
    .route("/:comment_id")
    .patch(patchComment)
    .delete(deleteComment);

module.exports = commentsRouter;