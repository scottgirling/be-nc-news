const db = require("../../db/connection");

const checkCommentPageExists = (article_id, limit = 10, p) => {
    return db.query("SELECT comments.comment_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC LIMIT $2 OFFSET $3", [article_id, limit, ((p - 1) * limit)])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Page does not exist" });
        }
        return rows;
    })
}

module.exports = checkCommentPageExists;