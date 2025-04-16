const removeArticleByArticleId = require("../models/removeArticleByArticleId");

const deleteArticleByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    removeArticleByArticleId(article_id)
    .then(() => {
        response.status(204).send();
    })
    .catch((error) => {
        next(error);
    })
}

module.exports = deleteArticleByArticleId;