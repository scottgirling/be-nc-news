const db = require("../../db/connection");

const checkTopicExists = (topic) => {
    return db.query("SELECT * FROM topics WHERE slug = $1", [topic]).then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, msg: "Topic not found." });
        }
        return rows;
    });
}

module.exports = checkTopicExists;