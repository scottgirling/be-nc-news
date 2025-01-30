const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const selectArticleById = (article_id) => {
    return checkArticleExists(article_id)
    .then(() => {
        return db.query("SELECT articles.*, COUNT (comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [article_id])
    })
    .then(( { rows }) => {
        return rows[0];
    })
}

module.exports = selectArticleById;