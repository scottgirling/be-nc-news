const db = require("../db/connection");

const updateComment = (inc_votes, comment_id) => {
    return db.query("UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *", [inc_votes, comment_id])
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = updateComment;