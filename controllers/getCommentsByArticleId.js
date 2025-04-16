const selectCommentByArticleId = require("../models/selectCommentByArticleId");
const checkCommentPageExists = require("../models/utils/checkCommentPageExists");

const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const { limit, p } = request.query;
    if (p) {
        return checkCommentPageExists(article_id, limit, p)
        .then(() => {
            return selectCommentByArticleId(article_id, limit, p)
        })
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((error) => {
            next(error);
        });
    } else {
        selectCommentByArticleId(article_id, limit, p)
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((error) => {
            next(error);
        });
    }
}

module.exports = getCommentsByArticleId;