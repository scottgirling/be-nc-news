const db = require("../db/connection");

const selectArticles = (sort_by = "created_at", order = "desc") => {
    const allowedSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"];
    const allowedOrders = ["asc", "desc"]

    let queryStr = "SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id";

    if (!allowedSortBy.includes(sort_by) || !allowedOrders.includes(order)) {
        return Promise.reject({ status: 404, msg: "Invalid Input."});
    }

    queryStr += ` ORDER BY ${sort_by} ${order}`

    return db.query(queryStr).then(({ rows }) => {
        console.log(rows)
        return rows;
    })
}

module.exports = selectArticles;