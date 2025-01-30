const db = require("../db/connection");

const selectArticles = (sort_by = "created_at", order = "desc", topic) => {
    const allowedSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "votes", "article_img_url"];
    const allowedOrder = ["asc", "desc"];
    const queryValues = [];

    let queryStr = "SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";

    if (!allowedSortBy.includes(sort_by) || !allowedOrder.includes(order)) {
        return Promise.reject({ status: 404, msg: "Invalid Input."});
    }

    if (topic) {
        queryStr += " WHERE topic = $1";
        queryValues.push(topic);
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;


    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    })
}

module.exports = selectArticles;