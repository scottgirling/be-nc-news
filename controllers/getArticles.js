const selectArticles = require("../models/selectArticles");

const getArticles = (request, response, next) => {
    const { sort_by, order } = request.query;
    selectArticles(sort_by, order).then((articles) => {
        response.status(200).send({ articles })
    })
    .catch((error) => {
        next(error);
    });
}

module.exports = getArticles;