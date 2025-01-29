const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const selectCommentByArticleId = (article_id) => {
    return checkArticleExists(article_id)
    .then(() => {
        return db.query("SELECT comments.body, comments.votes, comments.author, comments.article_id, comments.created_at, comments.comment_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC", [article_id])
    })
    .then(({ rows }) => {
        return rows;
    })
}

module.exports = selectCommentByArticleId;