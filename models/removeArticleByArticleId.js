const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const removeArticleByArticleId = (article_id) => {
    return checkArticleExists(article_id)
    .then(() => {
        return db.query("DELETE FROM comments WHERE comments.article_id = $1", [article_id])
    })
    .then(() => {
        return db.query("DELETE FROM articles WHERE article_id = $1", [article_id]);
    })
}

module.exports = removeArticleByArticleId;