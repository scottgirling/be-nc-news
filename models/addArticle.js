const db = require("../db/connection");

const addArticle = (author, title, body, topic, article_img_url) => {
    if (article_img_url === undefined) {
        article_img_url = "https://images.pexels.com/photos/defaultimage1234567";
    }
    
    return db.query("INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *", [author, title, body, topic, article_img_url])
    .then(( { rows }) => {
        return db.query("SELECT articles.*, COUNT (comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id", [rows[0].article_id])
    })
    .then(({ rows }) => {
        return rows[0]
    })
}

module.exports = addArticle;