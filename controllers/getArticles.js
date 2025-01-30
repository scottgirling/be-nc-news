const selectArticles = require("../models/selectArticles");
const checkTopicExists = require("../models/utils/checkTopicExists");

const getArticles = (request, response, next) => {
    const { sort_by, order, topic } = request.query;
    if (topic) {
        return checkTopicExists(topic)
        .then(() => {
            return selectArticles(sort_by, order, topic)
        })
        .then((articles) => {
            response.status(200).send({ articles })
        })
        .catch((error) => {
            next(error);
        });
    } else {
        selectArticles(sort_by, order)
        .then((articles) => {
            response.status(200).send({ articles })
        })
        .catch((error) => {
            next(error);
        });
    }
}

module.exports = getArticles;