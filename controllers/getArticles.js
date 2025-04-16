const selectArticles = require("../models/selectArticles");
const checkArticlePageExists = require("../models/utils/checkArticlePageExists");
const checkTopicExists = require("../models/utils/checkTopicExists");

const getArticles = (request, response, next) => {
    const { sort_by, order, topic, limit, p } = request.query;
    if (topic) {
        return checkTopicExists(topic)
        .then(() => {
            return checkArticlePageExists(limit, p)
        })
        .then(() => {
            return selectArticles(sort_by, order, topic, limit, p)
        })
        .then((articles) => {
            response.status(200).send({ articles })
        })
        .catch((error) => {
            next(error);
        });
    } else {
        return checkArticlePageExists(limit, p)
        .then(() => {
            return selectArticles(sort_by, order, topic, limit, p)
        })
        .then((articles) => {
            response.status(200).send({ articles, total_count: articles.length })
        })
        .catch((error) => {
            next(error);
        });
    }
}

module.exports = getArticles;