const db = require("../db/connection");
const checkCommentExists = require("../models/utils/checkCommentExists");

const removeComment = (comment_id) => {
    return checkCommentExists(comment_id)
    .then(() => {
        return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
    })
}

module.exports = removeComment;