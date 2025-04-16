const selectArticles = require("../models/selectArticles");
const checkPageExists = require("../models/utils/checkPageExists");
const checkTopicExists = require("../models/utils/checkTopicExists");

const getArticles = (request, response, next) => {
    const { sort_by, order, topic, limit, p } = request.query;
    if (topic) {
        return checkTopicExists(topic)
        .then(() => {
            return checkPageExists(limit, p)
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
        return checkPageExists(limit, p)
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