const db = require("../db/connection");

const selectArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(( { rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Article does not exist" });
        }
        return rows[0];
    })
}

module.exports = selectArticleById;