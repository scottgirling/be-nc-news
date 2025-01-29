const selectCommentByArticleId = require("../models/selectCommentByArticleId");

const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectCommentByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({ comments });
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getCommentsByArticleId;