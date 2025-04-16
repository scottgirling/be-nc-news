const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const selectCommentByArticleId = (article_id, limit = 10, p = 1) => {
    return checkArticleExists(article_id)
    .then(() => {
        let queryStr = "SELECT comments.body, comments.votes, comments.author, comments.article_id, comments.created_at, comments.comment_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC LIMIT $2"

        if (p) {
            p = p - 1;
            queryStr += ` OFFSET ${p * limit}`;
        }

        return db.query(queryStr, [article_id, limit])
    })
    .then(({ rows }) => {
        return rows;
    })
}

module.exports = selectCommentByArticleId;