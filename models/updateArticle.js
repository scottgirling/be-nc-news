const db = require("../db/connection");
const checkArticleExists = require("./utils/checkArticleExists");

const updateArticle = (inc_votes, article_id) => {
    return checkArticleExists(article_id)
    .then(() => {
        return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id])
    })
    .then(({ rows }) => {
        return rows[0];
    })
}

module.exports = updateArticle;