const updateArticle = require("../models/updateArticle");

const patchArticle = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;
    updateArticle(inc_votes, article_id).then((updatedArticle) => {
        response.status(200).send({ updatedArticle })
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = patchArticle;