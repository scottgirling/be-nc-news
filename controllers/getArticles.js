const selectArticles = require("../models/selectArticles");

const getArticles = (request, response) => {
    selectArticles().then((articles) => {
        response.status(200).send({ articles })
    });
}

module.exports = getArticles;