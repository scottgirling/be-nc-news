const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const addComment = (article_id, username, body) => {
    return checkArticleExists(article_id)
    .then(() => {
        return db.query("INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *", [article_id, username, body])
    })
    .then(({ rows }) => {
        return rows[0];
    })
}

module.exports = addComment;