const db = require("../db/connection");
const checkArticleIdExists = require("./utils/checkArticleIdExists");

const addComments = (article_id, username, body) => {
    return checkArticleIdExists(article_id)
    .then(() => {
        return db.query("INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *", [article_id, username, body])
    })
    .then(({ rows }) => {
        return rows[0];
    })
}

module.exports = addComments;