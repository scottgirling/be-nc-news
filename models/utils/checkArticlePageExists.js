const db = require("../../db/connection");

const checkArticlePageExists = (limit = 10, p = 1) => {
    return db.query("SELECT * FROM articles LIMIT $1 OFFSET $2", [limit, ((p - 1) * limit)])
    .then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Page does not exist" });
        }
        return rows;
    })
}

module.exports = checkArticlePageExists;