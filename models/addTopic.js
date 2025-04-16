const db = require("../db/connection");

const addTopic = (slug, description) => {
    return db.query("INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *", [slug, description])
    .then(( { rows }) => {
        return rows[0];
    })
}

module.exports = addTopic;