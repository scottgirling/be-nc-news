const selectArticleById = require("../models/selectArticleById");

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleById(article_id).then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getArticleById;