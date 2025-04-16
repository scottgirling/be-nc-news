const addComment = require("../models/addComment");

const postComment = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;
    addComment(article_id, username, body)
    .then((newComment) => {
        response.status(201).send({ newComment });
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = postComment;