const { totalCount } = require("../db/connection");
const selectArticles = require("../models/selectArticles");
const checkTopicExists = require("../models/utils/checkTopicExists");

const getArticles = (request, response, next) => {
    const { sort_by, order, topic, limit, p } = request.query;
    if (topic) {
        return checkTopicExists(topic)
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
        selectArticles(sort_by, order, topic, limit, p)
        .then((articles) => {
            response.status(200).send({ articles, total_count: articles.length })
        })
        .catch((error) => {
            next(error);
        });
    }
}

module.exports = getArticles;