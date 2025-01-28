const db = require("../db/connection");

const selectArticles = () => {
    return db.query("SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC")
    .then(({ rows }) => {
        return rows;
    })
}

module.exports = selectArticles;